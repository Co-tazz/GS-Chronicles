const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { requireAuth } = require('../middleware/auth');
const { requireMongo } = require('../middleware/mongo');
const { info, error } = require('../utils/logger');

// Protect alerts routes; require DB
router.use(requireAuth, requireMongo);

// GET /api/alerts/active -> alerts in active state for the authenticated user
router.get('/active', async (req, res) => {
  try {
    const userId = String(req.user?.id);
    const realmId = req.query?.realmId != null ? Number(req.query.realmId) : undefined;
    const q = { userId, state: 'active' };
    if (realmId != null && !Number.isNaN(realmId)) q.realmId = realmId;
    const alerts = await Alert.find(q).sort({ time: -1 });
    res.json({ alerts });
  } catch (e) {
    error('Alerts GET active failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// GET /api/alerts/history -> acknowledged or dismissed alerts for the authenticated user
router.get('/history', async (req, res) => {
  try {
    const userId = String(req.user?.id);
    const realmId = req.query?.realmId != null ? Number(req.query.realmId) : undefined;
    const q = { userId, state: { $in: ['acknowledged', 'dismissed'] } };
    if (realmId != null && !Number.isNaN(realmId)) q.realmId = realmId;
    const alerts = await Alert.find(q).sort({ time: -1 });
    res.json({ alerts });
  } catch (e) {
    error('Alerts GET history failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// POST /api/alerts/acknowledge -> set state to acknowledged
router.post('/acknowledge', async (req, res) => {
  try {
    const userId = String(req.user?.id);
    const alertId = String(req.body?.alertId || '');
    if (!alertId) return res.status(400).json({ error: 'missing_alertId' });
    const doc = await Alert.findById(alertId);
    if (!doc) return res.status(404).json({ error: 'not_found' });
    if (String(doc.userId) !== userId) return res.status(403).json({ error: 'forbidden' });
    doc.state = 'acknowledged';
    await doc.save();
    info('Alert acknowledged', { id: alertId });
    res.json({ ok: true, alert: doc });
  } catch (e) {
    error('Alerts POST acknowledge failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// POST /api/alerts/dismiss -> set state to dismissed
router.post('/dismiss', async (req, res) => {
  try {
    const userId = String(req.user?.id);
    const alertId = String(req.body?.alertId || '');
    if (!alertId) return res.status(400).json({ error: 'missing_alertId' });
    const doc = await Alert.findById(alertId);
    if (!doc) return res.status(404).json({ error: 'not_found' });
    if (String(doc.userId) !== userId) return res.status(403).json({ error: 'forbidden' });
    doc.state = 'dismissed';
    await doc.save();
    info('Alert dismissed', { id: alertId });
    res.json({ ok: true, alert: doc });
  } catch (e) {
    error('Alerts POST dismiss failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;