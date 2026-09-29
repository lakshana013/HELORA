import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authenticate, roleCheck } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, roleCheck('doctor'));

router.get('/profile', (req, res) => {
  try {
    const doctor = db.prepare('SELECT * FROM doctors WHERE user_id = ?').get(req.user.id);
    if (!doctor) return res.status(404).json({ success: false, error: 'Doctor profile not found' });
    res.json({ success: true, data: { ...req.user, ...doctor } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
});

router.get('/stats', (req, res) => {
  try {
    const doctor = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(req.user.id);
    if (!doctor) return res.json({ success: true, data: { totalPatients: 0, pendingReviews: 0, activeCamps: 0, areasCovered: 0 } });

    const totalPatients = db.prepare('SELECT COUNT(DISTINCT patient_id) AS cnt FROM camp_registrations cr JOIN health_camps hc ON cr.camp_id = hc.id WHERE hc.doctor_id = ?').get(doctor.id)?.cnt || 0;
    const pendingReviews = db.prepare("SELECT COUNT(*) AS cnt FROM symptom_sessions WHERE doctor_review_status = 'pending'").get()?.cnt || 0;
    const activeCamps = db.prepare("SELECT COUNT(*) AS cnt FROM health_camps WHERE doctor_id = ? AND status IN ('planned', 'ongoing')").get(doctor.id)?.cnt || 0;
    const areasCovered = db.prepare('SELECT COUNT(DISTINCT village_area) AS cnt FROM health_camps WHERE doctor_id = ?').get(doctor.id)?.cnt || 0;

    res.json({ success: true, data: { totalPatients, pendingReviews, activeCamps, areasCovered } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get stats' });
  }
});

router.get('/patients', (req, res) => {
  try {
    const patients = db.prepare(`
      SELECT u.name, u.phone, p.*,
        (SELECT COUNT(*) FROM symptom_sessions WHERE patient_id = p.id) as session_count,
        (SELECT triage_level FROM symptom_sessions WHERE patient_id = p.id ORDER BY timestamp DESC LIMIT 1) as last_triage
      FROM patients p JOIN users u ON p.user_id = u.id ORDER BY u.name`).all();
    res.json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get patients' });
  }
});

router.get('/triage-sessions', (req, res) => {
  try {
    const status = req.query.status || 'pending';
    let sessions;
    if (status === 'all') {
      sessions = db.prepare(`SELECT ss.*, u.name AS patient_name, p.age, p.gender
        FROM symptom_sessions ss JOIN patients p ON ss.patient_id = p.id JOIN users u ON p.user_id = u.id
        ORDER BY ss.timestamp DESC LIMIT 50`).all();
    } else {
      sessions = db.prepare(`SELECT ss.*, u.name AS patient_name, p.age, p.gender
        FROM symptom_sessions ss JOIN patients p ON ss.patient_id = p.id JOIN users u ON p.user_id = u.id
        WHERE ss.doctor_review_status = ? ORDER BY ss.timestamp DESC LIMIT 50`).all(status);
    }
    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get triage sessions' });
  }
});

router.get('/triage-sessions/:id', (req, res) => {
  try {
    const session = db.prepare(`SELECT ss.*, u.name AS patient_name, p.age, p.gender, p.allergies, p.current_medicines, p.medical_history
      FROM symptom_sessions ss JOIN patients p ON ss.patient_id = p.id JOIN users u ON p.user_id = u.id
      WHERE ss.id = ?`).get(req.params.id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });

    const messages = db.prepare('SELECT * FROM session_messages WHERE session_id = ? ORDER BY timestamp ASC').all(session.id);
    res.json({ success: true, data: { ...session, messages } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get session' });
  }
});

router.post('/triage-sessions/:id/review', (req, res) => {
  try {
    const { notes, observations, triage_override, referral } = req.body;
    const doctor = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(req.user.id);
    const session = db.prepare('SELECT * FROM symptom_sessions WHERE id = ?').get(req.params.id);
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });

    const newStatus = referral ? 'referred' : 'reviewed';
    db.prepare(`UPDATE symptom_sessions SET doctor_review_status = ?, triage_level = COALESCE(?, triage_level) WHERE id = ?`)
      .run(newStatus, triage_override || null, req.params.id);

    const noteId = uuidv4();
    db.prepare(`INSERT INTO doctor_notes (id, doctor_id, patient_id, session_id, notes, observations, referral) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(noteId, doctor.id, session.patient_id, session.id, notes || null, observations || null, referral || null);

    res.json({ success: true, data: { message: 'Review saved' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save review' });
  }
});

router.get('/rural-areas', (req, res) => {
  try {
    const areas = [
      { id: '1', village: 'Thiruvalluvar Nagar', population: 3200, patients: 45, nearest_facility: 'PHC Kelambakkam', distance_km: 3.2, last_camp: '2024-08-15', needs: 'General health, diabetes screening' },
      { id: '2', village: 'Kannapuram', population: 2100, patients: 32, nearest_facility: 'District Hospital', distance_km: 12.0, last_camp: '2024-06-20', needs: 'Maternal health, vaccinations' },
      { id: '3', village: 'Perumbakkam Colony', population: 4500, patients: 28, nearest_facility: 'CHC Medavakkam', distance_km: 5.1, last_camp: null, needs: 'Dental, eye check-up' },
      { id: '4', village: 'Semmancheri Village', population: 2800, patients: 51, nearest_facility: 'PHC Semmancheri', distance_km: 1.8, last_camp: '2024-09-01', needs: 'Blood pressure, general' },
      { id: '5', village: 'Neelankarai West', population: 1500, patients: 19, nearest_facility: 'Clinic Neelankarai', distance_km: 4.5, last_camp: '2024-07-10', needs: 'Ayurveda, wellness' },
      { id: '6', village: 'Palavakkam Rural', population: 3800, patients: 37, nearest_facility: 'District Hospital', distance_km: 8.7, last_camp: null, needs: 'Emergency training, first aid' },
      { id: '7', village: 'Injambakkam', population: 2200, patients: 23, nearest_facility: 'PHC Injambakkam', distance_km: 6.2, last_camp: '2024-05-15', needs: 'Nutrition, child health' },
      { id: '8', village: 'Uthandi Outskirts', population: 2900, patients: 41, nearest_facility: 'CHC Uthandi', distance_km: 7.8, last_camp: '2024-04-20', needs: 'Chronic disease management' },
    ];

    const camps = db.prepare('SELECT village_area, MAX(date) as last_camp FROM health_camps GROUP BY village_area').all();
    const campMap = Object.fromEntries(camps.map(c => [c.village_area, c.last_camp]));

    for (const area of areas) {
      if (campMap[area.village]) area.last_camp = campMap[area.village];
    }

    res.json({ success: true, data: areas });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get rural areas' });
  }
});

export default router;
