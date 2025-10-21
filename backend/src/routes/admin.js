const express = require('express');
const router = express.Router();
const AppConfig = require('../models/AppConfig');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { requireMongo } = require('../middleware/mongo');

router.get('/config', requireAuth, requireAdmin, requireMongo, async (_req, res) => {
  try {
    const cfg = (await AppConfig.findById('global')) || (await AppConfig.create({ _id: 'global' }));
    res.json({ ok: true, allowSignups: !!cfg.allowSignups });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.patch('/config', requireAuth, requireAdmin, requireMongo, async (req, res) => {
  try {
    const allowSignups = req.body?.allowSignups;
    if (allowSignups == null) return res.status(400).json({ ok: false, error: 'missing_allowSignups' });
    const cfg = await AppConfig.findByIdAndUpdate('global', { allowSignups: !!allowSignups }, { new: true, upsert: true });
    res.json({ ok: true, allowSignups: !!cfg.allowSignups });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;