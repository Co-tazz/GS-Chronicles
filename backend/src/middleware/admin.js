function requireAdmin(req, res, next) {
  const isAdmin = !!(req.user && req.user.isAdmin);
  if (!isAdmin) {
    return res.status(403).json({ ok: false, error: 'forbidden: admin_only' });
  }
  return next();
}

module.exports = { requireAdmin };