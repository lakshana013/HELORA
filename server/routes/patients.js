import { Router } from 'express';
import db from '../database.js';
import { authenticate, roleCheck } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, roleCheck('patient'));

router.get('/profile', (req, res) => {
  try {
    const patient = db.prepare('SELECT * FROM patients WHERE user_id = ?').get(req.user.id);
    if (!patient) return res.status(404).json({ success: false, error: 'Patient profile not found' });
    res.json({ success: true, data: { ...req.user, ...patient } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
});

router.put('/profile', (req, res) => {
  try {
    const { age, gender, emergency_contact, medical_history, allergies, current_medicines, pregnancy_status, location_lat, location_lng } = req.body;
    const patient = db.prepare('SELECT id FROM patients WHERE user_id = ?').get(req.user.id);
    if (!patient) return res.status(404).json({ success: false, error: 'Patient profile not found' });

    db.prepare(`UPDATE patients SET age = COALESCE(?, age), gender = COALESCE(?, gender), emergency_contact = COALESCE(?, emergency_contact),
      medical_history = COALESCE(?, medical_history), allergies = COALESCE(?, allergies), current_medicines = COALESCE(?, current_medicines),
      pregnancy_status = COALESCE(?, pregnancy_status), location_lat = COALESCE(?, location_lat), location_lng = COALESCE(?, location_lng) WHERE id = ?`)
      .run(age, gender, emergency_contact, medical_history, allergies, current_medicines, pregnancy_status, location_lat, location_lng, patient.id);

    const updated = db.prepare('SELECT * FROM patients WHERE id = ?').get(patient.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

router.get('/health-history', (req, res) => {
  try {
    const patient = db.prepare('SELECT id FROM patients WHERE user_id = ?').get(req.user.id);
    if (!patient) return res.json({ success: true, data: [] });

    const history = db.prepare(`SELECT ss.id, ss.timestamp, ss.symptoms_text, ss.triage_level, ss.ai_summary, ss.recommended_action, ss.status
      FROM symptom_sessions ss WHERE ss.patient_id = ? ORDER BY ss.timestamp DESC LIMIT 50`).all(patient.id);

    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get health history' });
  }
});

router.get('/sessions', (req, res) => {
  try {
    const patient = db.prepare('SELECT id FROM patients WHERE user_id = ?').get(req.user.id);
    if (!patient) return res.json({ success: true, data: [] });

    const sessions = db.prepare(`SELECT * FROM symptom_sessions WHERE patient_id = ? ORDER BY timestamp DESC LIMIT 50`).all(patient.id);
    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get sessions' });
  }
});

router.get('/sessions/:id', (req, res) => {
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

export default router;
