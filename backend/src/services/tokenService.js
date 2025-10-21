const TokenPrice = require('../models/TokenPrice');
const TokenHistory = require('../models/TokenHistory');
const { getTokenPrice } = require('./blizzard');
const { info, error } = require('../utils/logger');
const { setToken, getToken } = require('../utils/cache');

async function fetchAndCacheToken() {
  try {
    const region = process.env.REGION || 'eu';
    const data = await getTokenPrice();
    const price = data?.price || data?.value || 0;
    const now = new Date();
    setToken(region, price, now);
    try {
      const doc = await TokenPrice.findOneAndUpdate(
        { region },
        { price, lastUpdated: now },
        { upsert: true, new: true }
      );
      // Append to history and prune entries older than 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      await TokenHistory.findOneAndUpdate(
        { region },
        {
          $push: { data: { timestamp: now, price } },
          $set: { updatedAt: now },
          $pull: { data: { timestamp: { $lt: sevenDaysAgo } } },
        },
        { upsert: true, new: true }
      );
      info('Token cached', { region, price });
      return doc;
    } catch (dbErr) {
      error('Token DB write failed, using fallback', { message: dbErr.message });
      return { region, price, lastUpdated: now };
    }
  } catch (e) {
    error('fetchAndCacheToken failed', { message: e.message });
    throw e;
  }
}

async function getCurrentToken(region = process.env.REGION || 'eu') {
  try {
    const doc = await TokenPrice.findOne({ region }).sort({ lastUpdated: -1 });
    if (doc) return doc;
  } catch (e) {
    error('Token DB read failed, using fallback', { message: e.message });
  }
  const fb = getToken(region);
  return { region, price: fb.price, lastUpdated: fb.lastUpdated };
}

module.exports = { fetchAndCacheToken, getCurrentToken };