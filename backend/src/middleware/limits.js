const rateLimit = require('express-rate-limit');

const limitRefresh = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { limitRefresh };