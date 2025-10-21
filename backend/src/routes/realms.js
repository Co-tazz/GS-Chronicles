const express = require('express');
const router = express.Router();
const { getConnectedRealms } = require('../services/blizzard');

// GET /api/realms -> list realms (flattened from connected realms index)
router.get('/', async (req, res) => {
  try {
    const data = await getConnectedRealms();
    // Map Blizzard response to a simple list
    const realms = (data?.connected_realms || []).map((cr) => ({
      id: cr.id,
      href: cr.href,
    }));
    res.json({ realms });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/realms/connected -> raw connected realm index
router.get('/connected', async (req, res) => {
  try {
    const data = await getConnectedRealms();
    res.json({ connectedRealms: data?.connected_realms || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;