const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.replace(/^Bearer\s+/i, '');
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ ok: false, error: 'server_misconfigured: JWT_SECRET missing' });
  }
  if (!token) {
    return res.status(401).json({ ok: false, error: 'unauthorized: token_missing' });
  }
  try {
    const payload = jwt.verify(token, secret);
    // Attach auth context (id + isAdmin)
    req.user = {
      id: payload.sub || payload.userId || 'unknown',
      isAdmin: !!payload.isAdmin,
      roles: payload.roles || [],
    };
    return next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: 'unauthorized: token_invalid' });
  }
}

module.exports = { requireAuth };