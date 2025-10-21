const express = require('express');
const router = express.Router();
const Watchlist = require('../models/Watchlist');
const { requireAuth } = require('../middleware/auth');
const { requireMongo } = require('../middleware/mongo');
const { info, error } = require('../utils/logger');

// Protect all watchlist routes
router.use(requireAuth, requireMongo);

// GET /api/watchlist?userId=
router.get('/', async (req, res) => {
  try {
    const query = {};
    // Scope to authenticated user by default; allow explicit override only if same user
    const requestedUser = req.query.userId ? String(req.query.userId) : null;
    const authUser = req.user?.id ? String(req.user.id) : null;
    if (requestedUser && requestedUser === authUser) {
      query.userId = requestedUser;
    } else if (authUser) {
      query.userId = authUser;
    }
    if (req.query.realmId != null) {
      const r = Number(req.query.realmId);
      if (!Number.isNaN(r)) query.realmId = r;
    }
    const items = await Watchlist.find(query).sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) {
    error('Watchlist GET failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// POST /api/watchlist/items
router.post('/items', async (req, res) => {
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
    info('Watchlist item added', { id: doc._id.toString(), itemId: doc.itemId });
    res.json({ ok: true, item: doc });
  } catch (e) {
    error('Watchlist POST failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/watchlist/items/:id
router.delete('/items/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await Watchlist.findById(id);
    if (!doc) return res.status(404).json({ error: 'not_found' });
    if (String(doc.userId) !== String(req.user?.id)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    await Watchlist.findByIdAndDelete(id);
    info('Watchlist item deleted', { id });
    res.json({ ok: true });
  } catch (e) {
    error('Watchlist DELETE failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/watchlist/items/:id
router.patch('/items/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const updates = {};
    if (body.targetBuy != null) updates.targetBuy = Number(body.targetBuy);
    if (body.targetSell != null) updates.targetSell = Number(body.targetSell);
    if (body.alertEnabled != null) updates.alertEnabled = !!body.alertEnabled;
    if (body.realmId != null) updates.realmId = Number(body.realmId);
    const before = await Watchlist.findById(id);
    if (!before) return res.status(404).json({ error: 'not_found' });
    if (String(before.userId) !== String(req.user?.id)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    // Prevent duplicates when changing realm or item
    const nextRealmId = updates.realmId != null ? updates.realmId : before.realmId;
    const nextItemId = updates.itemId != null ? Number(updates.itemId) : before.itemId;
    const dup = await Watchlist.findOne({ userId: String(before.userId), realmId: nextRealmId, itemId: nextItemId, _id: { $ne: id } });
    if (dup) return res.status(409).json({ error: 'duplicate' });
    const doc = await Watchlist.findByIdAndUpdate(id, updates, { new: true });
    info('Watchlist item updated', { id });
    res.json({ ok: true, item: doc });
  } catch (e) {
    error('Watchlist PATCH failed', { message: e.message });
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;