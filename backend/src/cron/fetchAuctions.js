const cron = require('node-cron');
const { fetchAndCacheAuctions } = require('../services/auctionService');
const { info, error } = require('../utils/logger');

function registerAuctionCron() {
  // Every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    const realmId = Number(process.env.DEFAULT_REALM_ID || 1303); // Draenor by default
    info('Cron: fetching auctions', { realmId });
    try {
      await fetchAndCacheAuctions(realmId);
    } catch (e) {
      error('Cron auctions failed', { message: e.message });
    }
  });
}

module.exports = { registerAuctionCron };