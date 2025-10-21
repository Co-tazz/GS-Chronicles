const cron = require('node-cron');
const { info, error } = require('../utils/logger');
const Watchlist = require('../models/Watchlist');
const Alert = require('../models/Alert');
const { getLatestAuctions } = require('../services/auctionService');
const { currentItemPriceFromAuctions } = require('../utils/market');

function registerAlertsCron() {
  // Every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    info('Cron: evaluating alerts');
    try {
      const wl = await Watchlist.find({ alertEnabled: true });
      let created = 0;
      const users = new Set();
      for (const item of wl) {
        const realmId = Number(item.realmId);
        const snapshot = await getLatestAuctions(realmId);
        const auctions = snapshot?.auctions || [];
        const { price } = currentItemPriceFromAuctions(auctions, item.itemId);
        if (!(price > 0)) continue;
        // BUY alert
        if (item.targetBuy != null && price <= item.targetBuy) {
          const exists = await Alert.findOne({
            userId: String(item.userId),
            itemId: item.itemId,
            realmId,
            type: 'BUY',
            state: 'active',
          });
          if (!exists) {
            await Alert.create({
              userId: String(item.userId),
              itemId: item.itemId,
              realmId,
              type: 'BUY',
              price,
              threshold: item.targetBuy,
            });
            created += 1;
            users.add(String(item.userId));
          }
        }
        // SELL alert
        if (item.targetSell != null && price >= item.targetSell) {
          const exists = await Alert.findOne({
            userId: String(item.userId),
            itemId: item.itemId,
            realmId,
            type: 'SELL',
            state: 'active',
          });
          if (!exists) {
            await Alert.create({
              userId: String(item.userId),
              itemId: item.itemId,
              realmId,
              type: 'SELL',
              price,
              threshold: item.targetSell,
            });
            created += 1;
            users.add(String(item.userId));
          }
        }
      }
      info(`${created} alerts triggered for ${users.size} users`);
      info(`✔ cron executed at ${new Date().toISOString()}`);
    } catch (e) {
      error('Cron alerts failed', { message: e.message });
    }
  });
}

module.exports = { registerAlertsCron };