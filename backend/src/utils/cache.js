// Simple in-memory fallback cache to keep API useful when DB is offline
// Structure:
// tokens: { [region]: { price, lastUpdated } }
// auctions: { [realmId]: { auctions: [], updatedAt } }

const fallbackCache = {
  tokens: {},
  auctions: {},
};

function setToken(region, price, lastUpdated = new Date()) {
  fallbackCache.tokens[region] = { price, lastUpdated };
}

function getToken(region) {
  return fallbackCache.tokens[region] || { price: 0, lastUpdated: null };
}

function setAuctions(realmId, auctions, updatedAt = new Date()) {
  const list = Array.isArray(auctions) ? auctions.slice(0, 50) : [];
  fallbackCache.auctions[realmId] = { auctions: list, updatedAt };
}

function getAuctions(realmId) {
  return fallbackCache.auctions[realmId] || { auctions: [], updatedAt: null };
}

module.exports = {
  fallbackCache,
  setToken,
  getToken,
  setAuctions,
  getAuctions,
};