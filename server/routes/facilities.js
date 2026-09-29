import { Router } from 'express';
import db from '../database.js';

const router = Router();

function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

router.get('/', (req, res) => {
  try {
    const { lat, lng, type, emergency } = req.query;
    let facilities = db.prepare('SELECT * FROM health_facilities').all();

    if (type) facilities = facilities.filter(f => f.type === type);
    if (emergency === 'true') facilities = facilities.filter(f => f.emergency_available);

    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);
      facilities = facilities.map(f => ({ ...f, distance: Math.round(calcDistance(userLat, userLng, f.lat, f.lng) * 10) / 10 }));
      facilities.sort((a, b) => a.distance - b.distance);
    }

    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get facilities' });
  }
});

router.get('/nearby', (req, res) => {
  try {
    const { lat, lng, radius, type } = req.query;
    if (!lat || !lng) return res.status(400).json({ success: false, error: 'Location (lat, lng) is required' });

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radius) || 20;

    let facilities = db.prepare('SELECT * FROM health_facilities').all();
    if (type) facilities = facilities.filter(f => f.type === type);

    facilities = facilities
      .map(f => ({ ...f, distance: Math.round(calcDistance(userLat, userLng, f.lat, f.lng) * 10) / 10 }))
      .filter(f => f.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get nearby facilities' });
  }
});

export default router;
