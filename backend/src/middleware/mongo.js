const mongoose = require('mongoose');

function requireMongo(req, res, next) {
  if (mongoose.connection?.readyState === 1) {
    return next();
  }
  return res.status(503).json({ ok: false, error: 'service_unavailable: mongo_not_connected' });
}

module.exports = { requireMongo };