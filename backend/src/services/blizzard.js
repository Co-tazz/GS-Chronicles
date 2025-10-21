const axios = require('axios');
const qs = require('querystring');
const { info, error } = require('../utils/logger');

let cachedToken = null;
let tokenExpiresAt = 0;

async function fetchOAuthToken() {
  const region = process.env.REGION || 'eu';
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('Blizzard CLIENT_ID/SECRET missing');
  const tokenUrl = `https://${region}.battle.net/oauth/token`;
  const resp = await axios.post(tokenUrl, qs.stringify({ grant_type: 'client_credentials' }), {
    auth: { username: clientId, password: clientSecret },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  cachedToken = resp.data.access_token;
  tokenExpiresAt = Date.now() + (resp.data.expires_in - 60) * 1000; // refresh 60s early
  info('Fetched Blizzard OAuth token');
}

async function getAuthToken() {
  if (!cachedToken || Date.now() > tokenExpiresAt) {
    await fetchOAuthToken();
  }
  return cachedToken;
}

async function requestWithRetry(endpoint, params = {}, attempt = 1) {
  const region = process.env.REGION || 'eu';
  const base = `https://${region}.api.blizzard.com`;
  const url = `${base}${endpoint}`;
  const token = await getAuthToken();
  try {
    const resp = await axios.get(url, {
      params: { locale: 'en_GB', ...params },
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  } catch (e) {
    const status = e?.response?.status;
    if (status === 401) {
      error('❌ Blizzard auth failed: check CLIENT_ID/SECRET', { status });
      // Try refreshing token once
      cachedToken = null;
      if (attempt <= 2) {
        await fetchOAuthToken();
        return requestWithRetry(endpoint, params, attempt + 1);
      }
    }
    if (status === 429 && attempt <= 3) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
      await new Promise((r) => setTimeout(r, delay));
      return requestWithRetry(endpoint, params, attempt + 1);
    }
    throw e;
  }
}

// High-level helpers (endpoints are illustrative; adjust to Blizzard APIs you use)
async function getConnectedRealms() {
  try {
    return await requestWithRetry('/data/wow/connected-realm/index');
  } catch (e) {
    error('getConnectedRealms failed', { message: e.message });
    throw e;
  }
}

async function getAuctionData(connectedRealmId) {
  try {
    return await requestWithRetry(`/data/wow/connected-realm/${connectedRealmId}/auctions`);
  } catch (e) {
    error('getAuctionData failed', { message: e.message });
    throw e;
  }
}

async function getTokenPrice() {
  try {
    return await requestWithRetry('/data/wow/token/index');
  } catch (e) {
    error('getTokenPrice failed', { message: e.message });
    throw e;
  }
}

module.exports = {
  getConnectedRealms,
  getAuctionData,
  getTokenPrice,
  getAuthToken,
};