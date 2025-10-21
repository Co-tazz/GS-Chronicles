const express = require('express');
const router = express.Router();
const { getRecommendations, runAiScan } = require('../services/aiEngine');
const { limitRefresh } = require('../middleware/limits');

// GET /api/recommendations -> AI picks
router.get('/', async (req, res) => {
  const realmId = Number(req.query.realmId || process.env.DEFAULT_REALM_ID || 1303);
  try {
    const items = await getRecommendations({ realmId });
    res.json({ recommendations: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/recommendations/refresh -> queue or run scan
router.post('/refresh', limitRefresh, async (req, res) => {
  const realmId = Number(req.body?.realmId || process.env.DEFAULT_REALM_ID || 1303);
  try {
    await runAiScan({ realmId });
    res.json({ status: 'done' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;