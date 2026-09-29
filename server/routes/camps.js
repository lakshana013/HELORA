import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authenticate, roleCheck } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { status } = req.query;
    let camps;
    if (status) {
      camps = db.prepare(`SELECT hc.*, u.name AS doctor_name,
        (SELECT COUNT(*) FROM camp_registrations WHERE camp_id = hc.id) AS registered_count
        FROM health_camps hc JOIN doctors d ON hc.doctor_id = d.id JOIN users u ON d.user_id = u.id
        WHERE hc.status = ? ORDER BY hc.date DESC`).all(status);
    } else {
      camps = db.prepare(`SELECT hc.*, u.name AS doctor_name,
        (SELECT COUNT(*) FROM camp_registrations WHERE camp_id = hc.id) AS registered_count
        FROM health_camps hc JOIN doctors d ON hc.doctor_id = d.id JOIN users u ON d.user_id = u.id
        ORDER BY hc.date DESC`).all();
    }
    res.json({ success: true, data: camps });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get camps' });
  }
});

router.get('/upcoming', (req, res) => {
  try {
    const camps = db.prepare(`SELECT hc.*, u.name AS doctor_name,
      (SELECT COUNT(*) FROM camp_registrations WHERE camp_id = hc.id) AS registered_count
      FROM health_camps hc JOIN doctors d ON hc.doctor_id = d.id JOIN users u ON d.user_id = u.id
      WHERE hc.status = 'planned' AND hc.date >= date('now') ORDER BY hc.date ASC`).all();
    res.json({ success: true, data: camps });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get upcoming camps' });
  }
});

router.post('/', authenticate, roleCheck('doctor'), (req, res) => {
  try {
    const { name, village_area, date, time, location_address, lat, lng, services } = req.body;
    if (!name || !date) return res.status(400).json({ success: false, error: 'Camp name and date are required' });

    const doctor = db.prepare('SELECT id FROM doctors WHERE user_id = ?').get(req.user.id);
    if (!doctor) return res.status(404).json({ success: false, error: 'Doctor not found' });

    const campId = uuidv4();
    db.prepare(`INSERT INTO health_camps (id, doctor_id, name, village_area, date, time, location_address, lat, lng, services) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(campId, doctor.id, name, village_area || null, date, time || null, location_address || null, lat || null, lng || null,
        Array.isArray(services) ? services.join(',') : services || null);

    const camp = db.prepare('SELECT * FROM health_camps WHERE id = ?').get(campId);
    res.status(201).json({ success: true, data: camp });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create camp' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const camp = db.prepare(`SELECT hc.*, u.name AS doctor_name
      FROM health_camps hc JOIN doctors d ON hc.doctor_id = d.id JOIN users u ON d.user_id = u.id
      WHERE hc.id = ?`).get(req.params.id);
    if (!camp) return res.status(404).json({ success: false, error: 'Camp not found' });
    res.json({ success: true, data: camp });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get camp' });
  }
});

router.put('/:id', authenticate, roleCheck('doctor'), (req, res) => {
  try {
    const { name, village_area, date, time, location_address, services, status } = req.body;
    const camp = db.prepare('SELECT * FROM health_camps WHERE id = ?').get(req.params.id);
    if (!camp) return res.status(404).json({ success: false, error: 'Camp not found' });

    db.prepare(`UPDATE health_camps SET name = COALESCE(?, name), village_area = COALESCE(?, village_area),
      date = COALESCE(?, date), time = COALESCE(?, time), location_address = COALESCE(?, location_address),
      services = COALESCE(?, services), status = COALESCE(?, status) WHERE id = ?`)
      .run(name, village_area, date, time, location_address,
        Array.isArray(services) ? services.join(',') : services, status, req.params.id);

    const updated = db.prepare('SELECT * FROM health_camps WHERE id = ?').get(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update camp' });
  }
});

router.get('/:id/patients', (req, res) => {
  try {
    const patients = db.prepare(`SELECT cr.*, u.name AS patient_name, p.age, p.gender,
      (SELECT symptoms_text FROM symptom_sessions WHERE patient_id = p.id ORDER BY timestamp DESC LIMIT 1) AS last_symptoms,
      (SELECT triage_level FROM symptom_sessions WHERE patient_id = p.id ORDER BY timestamp DESC LIMIT 1) AS last_triage
      FROM camp_registrations cr JOIN patients p ON cr.patient_id = p.id JOIN users u ON p.user_id = u.id
      WHERE cr.camp_id = ? ORDER BY cr.registered_at DESC`).all(req.params.id);
    res.json({ success: true, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get camp patients' });
  }
});

router.post('/:id/register', authenticate, roleCheck('patient'), (req, res) => {
  try {
    const patient = db.prepare('SELECT id FROM patients WHERE user_id = ?').get(req.user.id);
    if (!patient) return res.status(404).json({ success: false, error: 'Patient not found' });

    const existing = db.prepare('SELECT id FROM camp_registrations WHERE camp_id = ? AND patient_id = ?').get(req.params.id, patient.id);
    if (existing) return res.status(400).json({ success: false, error: 'Already registered' });

    const regId = uuidv4();
    db.prepare(`INSERT INTO camp_registrations (id, camp_id, patient_id) VALUES (?, ?, ?)`).run(regId, req.params.id, patient.id);

    res.status(201).json({ success: true, data: { id: regId, message: 'Registered successfully' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to register' });
  }
});

router.put('/:id/patients/:patientId', authenticate, roleCheck('doctor'), (req, res) => {
  try {
    const { consultation_status, doctor_notes, referral_needed } = req.body;
    db.prepare(`UPDATE camp_registrations SET consultation_status = COALESCE(?, consultation_status),
      doctor_notes = COALESCE(?, doctor_notes), referral_needed = COALESCE(?, referral_needed)
      WHERE camp_id = ? AND patient_id = ?`)
      .run(consultation_status, doctor_notes, referral_needed ? 1 : 0, req.params.id, req.params.patientId);

    res.json({ success: true, data: { message: 'Updated' } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update' });
  }
});

export default router;
