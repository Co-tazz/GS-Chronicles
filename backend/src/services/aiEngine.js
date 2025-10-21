const Recommendation = require('../models/Recommendation');
const { info, error } = require('../utils/logger');
const { getLatestAuctions } = require('./auctionService');
const { computeStats, extractUnitPrice } = require('../utils/market');

// AI logic: compute per-item stats from latest auctions and signal BUY/SELL/WATCH
async function runAiScan({ realmId }) {
  try {
    const snapshot = await getLatestAuctions(realmId);
    const auctions = snapshot?.auctions || [];
    const byItem = new Map();
    for (const a of auctions) {
      const id = a?.item?.id || a?.item?.item?.id || a?.itemId;
      const unit = extractUnitPrice(a);
      if (!id || typeof unit !== 'number') continue;
      if (!byItem.has(id)) byItem.set(id, []);
      byItem.get(id).push(unit);
    }
    const now = new Date();
    let count = 0;
    for (const [itemId, prices] of byItem) {
      if (prices.length < 5) continue; // skip sparse items
      const { mean, median, stdev } = computeStats(prices);
      const current = median || mean;
      let signal = 'watch';
      if (current < mean - stdev) signal = 'buy';
      else if (current > mean + stdev) signal = 'sell';
      const confidence = stdev > 0 ? Math.min(1, Math.abs(current - mean) / (2 * stdev)) : 0.5;
      await Recommendation.findOneAndUpdate(
        { itemId, realmId },
        { itemId, itemName: `Item ${itemId}`, signal, confidence, lastUpdated: now },
        { upsert: true, new: true }
      );
      count++;
    }
    info('AI scan stored recommendations', { realmId, count });
  } catch (e) {
    error('AI scan failed', { realmId, message: e.message });
    throw e;
  }
}

async function getRecommendations({ realmId }) {
  return Recommendation.find({ realmId }).sort({ lastUpdated: -1 }).limit(50);
}

module.exports = { runAiScan, getRecommendations };