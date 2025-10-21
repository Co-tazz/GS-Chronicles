const Auction = require('../models/Auction');
const { getAuctionData } = require('./blizzard');
const { info, error } = require('../utils/logger');
const { setAuctions, getAuctions } = require('../utils/cache');

async function fetchAndCacheAuctions(realmId) {
  try {
    const data = await getAuctionData(realmId);
    const list = data.auctions || [];
    const now = new Date();
    setAuctions(realmId, list, now);
    try {
      const doc = await Auction.findOneAndUpdate(
        { realmId },
        { auctions: list, lastModified: now, updatedAt: now },
        { upsert: true, new: true }
      );
      info('Auctions cached', { realmId, count: (doc.auctions || []).length });
      return doc;
    } catch (dbErr) {
      error('Auctions DB write failed, using fallback', { realmId, message: dbErr.message });
      return { realmId, auctions: list, updatedAt: now };
    }
  } catch (e) {
    error('fetchAndCacheAuctions failed', { realmId, message: e.message });
    throw e;
  }
}

async function getLatestAuctions(realmId) {
  try {
    const doc = await Auction.findOne({ realmId }).sort({ updatedAt: -1 });
    if (doc) return doc;
  } catch (e) {
    error('Auctions DB read failed, using fallback', { realmId, message: e.message });
  }
  const fb = getAuctions(realmId);
  return { realmId, auctions: fb.auctions, updatedAt: fb.updatedAt };
}

module.exports = { fetchAndCacheAuctions, getLatestAuctions };