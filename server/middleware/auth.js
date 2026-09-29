import jwt from 'jsonwebtoken';
import db from '../database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'healora_jwt_secret_key_2024';

export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = db.prepare('SELECT id, email, phone, role, name, preferred_language FROM users WHERE id = ?').get(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    return res.status(500).json({ success: false, error: 'Authentication error' });
  }
}

export function roleCheck(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
}

export { JWT_SECRET };
