import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from '../database.js';
import { authenticate, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res) => {
  try {
    const { name, phone, email, password, role, age, gender, emergency_contact,
      preferred_language, specialization, hospital_clinic, medical_registration_id } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({ success: false, error: 'Name, password, and role are required' });
    }
    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    if (phone) {
      const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
      if (existing) return res.status(400).json({ success: false, error: 'Phone number already registered' });
    }
    if (email) {
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existing) return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const userId = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);

    db.prepare(`INSERT INTO users (id, email, phone, password_hash, role, name, preferred_language) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(userId, email || null, phone || null, passwordHash, role, name, preferred_language || 'en');

    if (role === 'patient') {
      const patientId = uuidv4();
      db.prepare(`INSERT INTO patients (id, user_id, age, gender, emergency_contact) VALUES (?, ?, ?, ?, ?)`)
        .run(patientId, userId, age || null, gender || null, emergency_contact || null);
    } else {
      const doctorId = uuidv4();
      db.prepare(`INSERT INTO doctors (id, user_id, specialization, hospital_clinic, medical_registration_id) VALUES (?, ?, ?, ?, ?)`)
        .run(doctorId, userId, specialization || null, hospital_clinic || null, medical_registration_id || null);
    }

    const token = jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: { id: userId, name, email, phone, role, preferred_language: preferred_language || 'en' },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.post('/login', (req, res) => {
  try {
    const { phone, email, password, role } = req.body;

    if (!password) return res.status(400).json({ success: false, error: 'Password is required' });

    let user;
    if (phone) {
      user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
    } else if (email) {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    } else {
      return res.status(400).json({ success: false, error: 'Phone or email is required' });
    }

    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    if (role && user.role !== role) return res.status(401).json({ success: false, error: 'Invalid credentials for this role' });

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, preferred_language: user.preferred_language },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

router.get('/me', authenticate, (req, res) => {
  try {
    const user = req.user;
    let profile = null;

    if (user.role === 'patient') {
      profile = db.prepare('SELECT * FROM patients WHERE user_id = ?').get(user.id);
    } else {
      profile = db.prepare('SELECT * FROM doctors WHERE user_id = ?').get(user.id);
    }

    res.json({ success: true, ...user, profile });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get profile' });
  }
});

router.put('/profile', authenticate, (req, res) => {
  try {
    const { name, preferred_language } = req.body;
    if (name) db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, req.user.id);
    if (preferred_language) db.prepare('UPDATE users SET preferred_language = ? WHERE id = ?').run(preferred_language, req.user.id);

    const updated = db.prepare('SELECT id, email, phone, role, name, preferred_language FROM users WHERE id = ?').get(req.user.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

export default router;
