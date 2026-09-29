import { Router } from 'express';
import db from '../database.js';

const router = Router();

function localize(item, lang) {
  if (lang === 'hi') {
    return { ...item, name: item.name_hi || item.name, common_use: item.common_use_hi || item.common_use, precautions: item.precautions_hi || item.precautions };
  }
  if (lang === 'ta') {
    return { ...item, name: item.name_ta || item.name, common_use: item.common_use_ta || item.common_use, precautions: item.precautions_ta || item.precautions };
  }
  return item;
}

function localizeHerb(item, lang) {
  if (lang === 'hi') {
    return { ...item, name: item.name_hi || item.name, traditional_use: item.traditional_use_hi || item.traditional_use, explanation: item.explanation_hi || item.explanation, safety_info: item.safety_info_hi || item.safety_info };
  }
  if (lang === 'ta') {
    return { ...item, name: item.name_ta || item.name, traditional_use: item.traditional_use_ta || item.traditional_use, explanation: item.explanation_ta || item.explanation, safety_info: item.safety_info_ta || item.safety_info };
  }
  return item;
}

router.get('/medicines', (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const medicines = db.prepare('SELECT * FROM medicines ORDER BY name').all();
    res.json({ success: true, data: medicines.map(m => localize(m, lang)) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get medicines' });
  }
});

router.get('/medicines/:id', (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const medicine = db.prepare('SELECT * FROM medicines WHERE id = ?').get(req.params.id);
    if (!medicine) return res.status(404).json({ success: false, error: 'Medicine not found' });
    res.json({ success: true, data: localize(medicine, lang) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get medicine' });
  }
});

router.get('/ayurveda', (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const herbs = db.prepare('SELECT * FROM ayurveda_herbs ORDER BY name').all();
    res.json({ success: true, data: herbs.map(h => localizeHerb(h, lang)) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get herbs' });
  }
});

router.get('/ayurveda/:id', (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const herb = db.prepare('SELECT * FROM ayurveda_herbs WHERE id = ?').get(req.params.id);
    if (!herb) return res.status(404).json({ success: false, error: 'Herb not found' });
    res.json({ success: true, data: localizeHerb(herb, lang) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get herb' });
  }
});

export default router;
