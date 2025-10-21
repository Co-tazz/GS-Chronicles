const express = require('express');
const router = express.Router();
const { getCurrentToken, fetchAndCacheToken } = require('../services/tokenService');
const TokenHistory = require('../models/TokenHistory');
const { ageMinutes } = require('../utils/time');
const { limitRefresh } = require('../middleware/limits');

// GET /api/token -> current token price
router.get('/', async (req, res) => {
  try {
    const region = req.query.region || process.env.REGION || 'eu';
    const doc = await getCurrentToken(region);
    const age = ageMinutes(doc.lastUpdated);
    res.json({ region: doc.region, price: doc.price, lastUpdated: doc.lastUpdated, meta: { updated: doc.lastUpdated, age_minutes: age } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/token/refresh -> fetch now
router.post('/refresh', limitRefresh, async (req, res) => {
  try {
    const doc = await fetchAndCacheToken();
    const age = ageMinutes(doc.lastUpdated);
    res.json({ ok: true, price: doc.price, lastUpdated: doc.lastUpdated, meta: { updated: doc.lastUpdated, age_minutes: age } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/token/history -> 7-day price history
router.get('/history', async (req, res) => {
  try {
    const region = req.query.region || process.env.REGION || 'eu';
    const days = Number(req.query.days || 7);
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const doc = await TokenHistory.findOne({ region });
    const points = (doc?.data || []).filter((p) => new Date(p.timestamp) >= from).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    res.json({ region, points, meta: { from: from.toISOString(), to: new Date().toISOString(), days } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;