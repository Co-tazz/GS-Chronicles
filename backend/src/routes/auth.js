const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppConfig = require('../models/AppConfig');
const { requireAuth } = require('../middleware/auth');
const { requireMongo } = require('../middleware/mongo');
const rateLimit = require('express-rate-limit');
const { info } = require('../utils/logger');

const limiter = rateLimit({ windowMs: 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

function validateEmail(email) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);
}

function validatePassword(pw) {
  // min 8, upper, lower, number, symbol
  return (
    typeof pw === 'string' &&
    pw.length >= 8 &&
    /[A-Z]/.test(pw) &&
    /[a-z]/.test(pw) &&
    /[0-9]/.test(pw) &&
    /[^A-Za-z0-9]/.test(pw)
  );
}

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  const payload = { sub: user._id.toString(), isAdmin: !!(user.isAdmin || user.role === 'admin') };
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

router.post('/signup', limiter, requireMongo, async (req, res) => {
  try {
    const body = req.body || {};
    const email = String(body.email || '').trim().toLowerCase();
    const username = String(body.username || '').trim();
    const password = String(body.password || '');

    // Config gate (allow admin email to bypass)
    const cfg = (await AppConfig.findById('global')) || (await AppConfig.create({ _id: 'global' }));
    const isAdminEmail = email === process.env.ADMIN_EMAIL;
    info('Signup gate', { allowSignups: !!cfg.allowSignups, isAdminEmail, email, adminEmailEnv: process.env.ADMIN_EMAIL });
    if (!cfg.allowSignups && !isAdminEmail) {
      return res.status(403).json({ ok: false, error: 'signups_disabled' });
    }

    if (!validateEmail(email)) return res.status(400).json({ ok: false, error: 'invalid_email' });
    if (!validatePassword(password)) return res.status(400).json({ ok: false, error: 'weak_password' });
    if (!username) return res.status(400).json({ ok: false, error: 'invalid_username' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ ok: false, error: 'email_exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = email === process.env.ADMIN_EMAIL;
    const user = await User.create({ email, username, password: hashedPassword, isAdmin });
    info('User created', { id: user._id.toString(), email, isAdmin });

    const token = signToken(user);
    res.json({
      ok: true,
      token,
      user: { id: user._id.toString(), email: user.email, username: user.username, isAdmin: !!user.isAdmin, settings: user.settings },
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post('/login', limiter, requireMongo, async (req, res) => {
  try {
    const body = req.body || {};
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ ok: false, error: 'invalid_credentials' });
    const ok = await bcrypt.compare(password, user.password || user.passwordHash);
    if (!ok) return res.status(401).json({ ok: false, error: 'invalid_credentials' });
    const token = signToken(user);
    res.json({ ok: true, token, user: { id: user._id.toString(), email: user.email, username: user.username, isAdmin: !!(user.isAdmin || user.role === 'admin'), settings: user.settings } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get('/me', requireAuth, requireMongo, async (req, res) => {
  try {
    const id = req.user?.id;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true, user: { id: user._id.toString(), email: user.email, username: user.username, isAdmin: !!(user.isAdmin || user.role === 'admin'), settings: user.settings } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.patch('/settings', requireAuth, requireMongo, async (req, res) => {
  try {
    const id = req.user?.id;
    const body = req.body || {};
    const theme = body?.theme;
    if (theme && !['light', 'dark', 'system'].includes(theme)) {
      return res.status(400).json({ ok: false, error: 'invalid_theme' });
    }
    const updates = {};
    if (theme) updates['settings.theme'] = theme;
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ ok: false, error: 'not_found' });
    res.json({ ok: true, user: { id: user._id.toString(), email: user.email, username: user.username, isAdmin: !!(user.isAdmin || user.role === 'admin'), settings: user.settings } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;