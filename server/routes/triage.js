import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authenticate, roleCheck } from '../middleware/auth.js';
import { startTriageSession, continueTriageSession, generateTriageSummary } from '../ai/triageEngine.js';

const router = Router();
router.use(authenticate, roleCheck('patient'));

router.post('/start', async (req, res) => {
  try {
    const { language, symptoms_text, voice_transcript } = req.body;
    if (!symptoms_text) return res.status(400).json({ success: false, error: 'Symptoms text is required' });

    const patient = db.prepare('SELECT * FROM patients WHERE user_id = ?').get(req.user.id);
    if (!patient) return res.status(404).json({ success: false, error: 'Patient profile not found' });

    const sessionId = uuidv4();

    db.prepare(`INSERT INTO symptom_sessions (id, patient_id, language, symptoms_text, voice_transcript) VALUES (?, ?, ?, ?, ?)`)
      .run(sessionId, patient.id, language || 'en', symptoms_text, voice_transcript || null);

    const userMsgId = uuidv4();
    db.prepare(`INSERT INTO session_messages (id, session_id, role, content, message_type) VALUES (?, ?, 'user', ?, ?)`)
      .run(userMsgId, sessionId, symptoms_text, voice_transcript ? 'voice' : 'text');

    const aiResult = await startTriageSession(patient, symptoms_text, language || 'en');

    const aiMsgId = uuidv4();
    db.prepare(`INSERT INTO session_messages (id, session_id, role, content, message_type) VALUES (?, ?, 'assistant', ?, 'text')`)
      .run(aiMsgId, sessionId, aiResult.content);

    if (aiResult.isEmergency) {
      db.prepare(`UPDATE symptom_sessions SET triage_level = 'red', status = 'completed' WHERE id = ?`).run(sessionId);
    }

    res.status(201).json({
      success: true,
      data: {
        session_id: sessionId,
        content: aiResult.content,
        isEmergency: aiResult.isEmergency,
      },
    });
  } catch (err) {
    console.error('Triage start error:', err);
    res.status(500).json({ success: false, error: 'Failed to start triage session' });
  }
});

router.post('/message', async (req, res) => {
  try {
    const { session_id, content, message_type } = req.body;
    if (!session_id || !content) return res.status(400).json({ success: false, error: 'session_id and content are required' });

    const patient = db.prepare('SELECT * FROM patients WHERE user_id = ?').get(req.user.id);
    const session = db.prepare('SELECT * FROM symptom_sessions WHERE id = ? AND patient_id = ?').get(session_id, patient.id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });

    const userMsgId = uuidv4();
    db.prepare(`INSERT INTO session_messages (id, session_id, role, content, message_type) VALUES (?, ?, 'user', ?, ?)`)
      .run(userMsgId, session_id, content, message_type || 'text');

    const messages = db.prepare('SELECT role, content FROM session_messages WHERE session_id = ? ORDER BY timestamp ASC').all(session_id);

    const aiResult = await continueTriageSession(messages, content, patient, session.language);

    const aiMsgId = uuidv4();
    db.prepare(`INSERT INTO session_messages (id, session_id, role, content, message_type) VALUES (?, ?, 'assistant', ?, 'text')`)
      .run(aiMsgId, session_id, aiResult.content);

    if (aiResult.isEmergency) {
      db.prepare(`UPDATE symptom_sessions SET triage_level = 'red', status = 'completed' WHERE id = ?`).run(session_id);
    }

    res.json({
      success: true,
      data: {
        content: aiResult.content,
        isEmergency: aiResult.isEmergency,
        triageComplete: aiResult.triageComplete || false,
      },
    });
  } catch (err) {
    console.error('Triage message error:', err);
    res.status(500).json({ success: false, error: 'Failed to process message' });
  }
});

router.post('/complete', async (req, res) => {
  try {
    const { session_id } = req.body;
    const patient = db.prepare('SELECT * FROM patients WHERE user_id = ?').get(req.user.id);
    const session = db.prepare('SELECT * FROM symptom_sessions WHERE id = ? AND patient_id = ?').get(session_id, patient.id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });

    const messages = db.prepare('SELECT role, content FROM session_messages WHERE session_id = ? ORDER BY timestamp ASC').all(session_id);

    const summary = await generateTriageSummary(messages, patient);

    db.prepare(`UPDATE symptom_sessions SET triage_level = ?, ai_summary = ?, recommended_action = ?, status = 'completed' WHERE id = ?`)
      .run(summary.triage_level, summary.ai_summary, summary.recommended_action, session_id);

    const historyId = uuidv4();
    db.prepare(`INSERT INTO health_history (id, patient_id, session_id, main_symptoms, triage_level) VALUES (?, ?, ?, ?, ?)`)
      .run(historyId, patient.id, session_id, session.symptoms_text, summary.triage_level);

    res.json({ success: true, data: summary });
  } catch (err) {
    console.error('Triage complete error:', err);
    res.status(500).json({ success: false, error: 'Failed to complete session' });
  }
});

router.get('/session/:id', (req, res) => {
  try {
    const patient = db.prepare('SELECT id FROM patients WHERE user_id = ?').get(req.user.id);
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });

    const session = db.prepare('SELECT * FROM symptom_sessions WHERE id = ? AND patient_id = ?').get(req.params.id, patient.id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });

    const messages = db.prepare('SELECT * FROM session_messages WHERE session_id = ? ORDER BY timestamp ASC').all(session.id);

    res.json({ success: true, data: { ...session, messages } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get session' });
  }
});

router.post('/send-to-doctor', (req, res) => {
  try {
    const { session_id } = req.body;
    const patient = db.prepare('SELECT id FROM patients WHERE user_id = ?').get(req.user.id);
    const session = db.prepare('SELECT * FROM symptom_sessions WHERE id = ? AND patient_id = ?').get(session_id, patient.id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });

    db.prepare(`UPDATE symptom_sessions SET doctor_review_status = 'pending' WHERE id = ?`).run(session_id);

    res.json({ success: true, data: { message: 'Session sent for doctor review' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to send to doctor' });
  }
});

export default router;
