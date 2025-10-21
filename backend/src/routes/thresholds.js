const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const { requireAuth } = require('../middleware/auth');
const { requireMongo } = require('../middleware/mongo');
const { info, error } = require('../utils/logger');

// /api/thresholds mirrors Watchlist with realmId and uniqueness
router.use(requireAuth, requireMongo);

// GET /api/thresholds?realmId=&itemId=
router.get('/', async (req, res) => {
  try {
    const userId = String(req.user?.id);
    const realmId = req.query?.realmId != null ? Number(req.query.realmId) : undefined;
    const itemId = req.query?.itemId != null ? Number(req.query.itemId) : undefined;
    const q = { userId };
    if (realmId != null && !Number.isNaN(realmId)) q.realmId = realmId;
    if (itemId != null && !Number.isNaN(itemId)) q.itemId = itemId;
    const items = await Watchlist.find(q).sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) {
    error('Thresholds GET failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// POST /api/thresholds
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const userId = String(req.user?.id || body.userId || 'anon');
    const itemId = Number(body.itemId);
    const realmId = body.realmId != null ? Number(body.realmId) : Number(process.env.DEFAULT_REALM_ID || 1303);
    if (Number.isNaN(itemId) || Number.isNaN(realmId)) return res.status(400).json({ error: 'invalid_item_or_realm' });
    const exists = await Watchlist.findOne({ userId, itemId, realmId });
    if (exists) return res.status(409).json({ error: 'duplicate' });
    const doc = await Watchlist.create({
      userId,
      realmId,
      itemId,
      targetBuy: body.targetBuy != null ? Number(body.targetBuy) : undefined,
      targetSell: body.targetSell != null ? Number(body.targetSell) : undefined,
      alertEnabled: body.alertEnabled != null ? !!body.alertEnabled : true,
    });
    info('Threshold added', { id: doc._id.toString(), itemId: doc.itemId, realmId: doc.realmId });
    res.json({ ok: true, item: doc });
  } catch (e) {
    error('Thresholds POST failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/thresholds/:id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const before = await Watchlist.findById(id);
    if (!before) return res.status(404).json({ error: 'not_found' });
    if (String(before.userId) !== String(req.user?.id)) return res.status(403).json({ error: 'forbidden' });
    const updates = {};
    if (body.targetBuy != null) updates.targetBuy = Number(body.targetBuy);
    if (body.targetSell != null) updates.targetSell = Number(body.targetSell);
    if (body.alertEnabled != null) updates.alertEnabled = !!body.alertEnabled;
    if (body.realmId != null) updates.realmId = Number(body.realmId);
    if (body.itemId != null) updates.itemId = Number(body.itemId);
    const nextRealmId = updates.realmId != null ? updates.realmId : before.realmId;
    const nextItemId = updates.itemId != null ? updates.itemId : before.itemId;
    const dup = await Watchlist.findOne({ userId: String(before.userId), realmId: nextRealmId, itemId: nextItemId, _id: { $ne: id } });
    if (dup) return res.status(409).json({ error: 'duplicate' });
    const doc = await Watchlist.findByIdAndUpdate(id, updates, { new: true });
    info('Threshold updated', { id });
    res.json({ ok: true, item: doc });
  } catch (e) {
    error('Thresholds PUT failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/thresholds/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Watchlist.findById(id);
    if (!doc) return res.status(404).json({ error: 'not_found' });
    if (String(doc.userId) !== String(req.user?.id)) return res.status(403).json({ error: 'forbidden' });
    await Watchlist.findByIdAndDelete(id);
    info('Threshold deleted', { id });
    res.json({ ok: true });
  } catch (e) {
    error('Thresholds DELETE failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;