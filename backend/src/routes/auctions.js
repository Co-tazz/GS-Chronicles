const express = require('express');
const router = express.Router();
const { getLatestAuctions, fetchAndCacheAuctions } = require('../services/auctionService');
const { ageMinutes } = require('../utils/time');
const { limitRefresh } = require('../middleware/limits');

// GET /api/auctions/:realmId -> latest snapshot
router.get('/:realmId', async (req, res) => {
  const realmId = Number(req.params.realmId);
  try {
    const doc = await getLatestAuctions(realmId);
    const age = ageMinutes(doc.updatedAt);
    res.json({ realmId, auctions: doc.auctions || [], updatedAt: doc.updatedAt || null, meta: { updated: doc.updatedAt || null, age_minutes: age } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/auctions/:realmId/refresh -> fetch now
router.post('/:realmId/refresh', limitRefresh, async (req, res) => {
  const realmId = Number(req.params.realmId);
  try {
    const doc = await fetchAndCacheAuctions(realmId);
    const age = ageMinutes(doc.updatedAt);
    res.json({ ok: true, count: (doc.auctions || []).length, meta: { updated: doc.updatedAt || null, age_minutes: age } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;