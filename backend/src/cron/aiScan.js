const cron = require('node-cron');
const { runAiScan } = require('../services/aiEngine');
const { info, error } = require('../utils/logger');

function registerAiScanCron() {
  // Every hour
  cron.schedule('0 * * * *', async () => {
    const realmId = Number(process.env.DEFAULT_REALM_ID || 1303);
    info('Cron: AI market scan', { realmId });
    try {
      await runAiScan({ realmId });
    } catch (e) {
      error('Cron aiScan failed', { message: e.message });
    }
  });
}

module.exports = { registerAiScanCron };