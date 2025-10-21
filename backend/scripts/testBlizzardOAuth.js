require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { getAuthToken } = require('../src/services/blizzard');

(async () => {
  try {
    const token = await getAuthToken();
    console.log('OAuth token ok:', token ? token.slice(0, 16) + '...' : null);
    console.log('Region:', process.env.REGION || 'eu');
  } catch (e) {
    console.error('OAuth failed:', e.message);
    process.exit(1);
  }
})();