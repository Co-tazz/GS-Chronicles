require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { info, warn, error } = require('./utils/logger');
const { getAuthToken } = require('./services/blizzard');
const pkg = require('../package.json');
const { connectDB, connectWithRetry } = require('./config/db');

const auctionsRoutes = require('./routes/auctions');
const tokenRoutes = require('./routes/token');
const recommendationsRoutes = require('./routes/recommendations');
const alertsRoutes = require('./routes/alerts');
const thresholdsRoutes = require('./routes/thresholds');
const realmsRoutes = require('./routes/realms');
const watchlistRoutes = require('./routes/watchlist');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const { registerAuctionCron } = require('./cron/fetchAuctions');
const { registerTokenCron } = require('./cron/fetchToken');
const { registerAiScanCron } = require('./cron/aiScan');
const { registerAlertsCron } = require('./cron/alerts');
const { fallbackCache } = require('./utils/cache');
const TokenPrice = require('./models/TokenPrice');
const Auction = require('./models/Auction');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
// Enable CORS preflight for all routes
// Express v5 path-to-regexp does not accept '*' catch-all; use regex
app.options(/.*/, cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(compression());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health
app.get('/api/status', (req, res) => {
  const uptimeSec = Math.round(process.uptime());
  const uptime = `${Math.floor(uptimeSec / 3600)}h ${Math.floor((uptimeSec % 3600) / 60)}m`;
  res.json({ ok: true, version: pkg.version, uptime, time: new Date().toISOString() });
});

app.get('/api/status/full', async (req, res) => {
  const token = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '');
  const expected = process.env.INTERNAL_STATUS_TOKEN || '';
  if (!expected || token !== expected) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  const env = {
    REGION: !!process.env.REGION,
    BLIZZARD_CLIENT_ID: !!process.env.BLIZZARD_CLIENT_ID,
    BLIZZARD_CLIENT_SECRET: !!process.env.BLIZZARD_CLIENT_SECRET,
    MONGO_URI: !!process.env.MONGO_URI,
  };
  const mongo = { connected: !!(require('mongoose').connection?.readyState === 1) };
  let blizzard = { token: 'unknown' };
  try {
    await getAuthToken();
    blizzard = { token: 'ok' };
  } catch (e) {
    blizzard = { token: 'error', message: e.message };
  }
  res.json({ ok: true, env, mongo, blizzard });
});

// Routes
app.use('/api/auctions', auctionsRoutes);
app.use('/api/token', tokenRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/thresholds', thresholdsRoutes);
app.use('/api/realms', realmsRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Boot

function logEnvStatus() {
  const envReport = [
    process.env.REGION ? `✅ REGION=${process.env.REGION}` : '⚠️ REGION missing',
    process.env.BLIZZARD_CLIENT_ID ? '✅ BLIZZARD_CLIENT_ID present' : '❌ BLIZZARD_CLIENT_ID missing',
    process.env.BLIZZARD_CLIENT_SECRET ? '✅ BLIZZARD_CLIENT_SECRET present' : '❌ BLIZZARD_CLIENT_SECRET missing',
    process.env.MONGO_URI ? '✅ MONGO_URI present' : '❌ MONGO_URI missing',
  ];
  envReport.forEach((line) => info(line));
}

(async () => {
  logEnvStatus();
  try {
    // Attempt once, then keep retrying in the background
    await connectDB();
  } catch (e) {
    error('[DB] Starting without DB connection', { message: e?.message || String(e) });
  }
  connectWithRetry();

  // When DB becomes available, sync fallback cache into collections
  const mongoose = require('mongoose');
  mongoose.connection.on('connected', async () => {
    try {
      // Sync tokens
      for (const [region, data] of Object.entries(fallbackCache.tokens)) {
        await TokenPrice.findOneAndUpdate(
          { region },
          { price: data.price, lastUpdated: data.lastUpdated || new Date() },
          { upsert: true }
        );
        info('Synced token from fallback to DB', { region, price: data.price });
      }
      // Sync auctions
      for (const [realmId, data] of Object.entries(fallbackCache.auctions)) {
        await Auction.findOneAndUpdate(
          { realmId: Number(realmId) },
          { auctions: data.auctions || [], updatedAt: data.updatedAt || new Date() },
          { upsert: true }
        );
        info('Synced auctions from fallback to DB', { realmId: Number(realmId), count: (data.auctions || []).length });
      }
    } catch (syncErr) {
      error('Fallback sync to DB failed', { message: syncErr.message });
    }
  });

  // Cron jobs
  registerAuctionCron();
  registerTokenCron();
  registerAiScanCron();
  registerAlertsCron();

  app.listen(PORT, () => {
    info(`[Server] Listening on http://localhost:${PORT}`);
  });
})();

// Graceful shutdown
const mongoose = require('mongoose');
function shutdown() {
  warn('Shutting down...');
  try {
    if (mongoose.connection?.readyState === 1) {
      mongoose.connection.close();
      info('Mongo connection closed');
    }
  } catch (e) {
    error('Error during shutdown', { message: e.message });
  } finally {
    process.exit(0);
  }
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);