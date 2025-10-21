const cron = require('node-cron');
const { fetchAndCacheToken } = require('../services/tokenService');
const { info, error } = require('../utils/logger');

function registerTokenCron() {
  // Every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    info('Cron: fetching token price');
    try {
      await fetchAndCacheToken();
    } catch (e) {
      error('Cron token failed', { message: e.message });
    }
  });
}

module.exports = { registerTokenCron };