function extractUnitPrice(auction) {
  // Blizzard auctions may use unit_price (modern) or buyout (legacy)
  if (typeof auction?.unit_price === 'number') return auction.unit_price;
  if (typeof auction?.buyout === 'number' && typeof auction?.quantity === 'number' && auction.quantity > 0) {
    return Math.round(auction.buyout / auction.quantity);
  }
  if (typeof auction?.buyout === 'number') return auction.buyout; // fallback
  return null;
}

function computeStats(prices) {
  if (!prices.length) {
    return { mean: 0, median: 0, stdev: 0 };
  }
  const sorted = [...prices].sort((a, b) => a - b);
  const mean = sorted.reduce((s, v) => s + v, 0) / sorted.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const variance = sorted.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / sorted.length;
  const stdev = Math.sqrt(variance);
  return { mean, median, stdev };
}

function currentItemPriceFromAuctions(auctions = [], itemId) {
  const prices = [];
  for (const a of auctions) {
    const id = a?.item?.id || a?.item?.item?.id || a?.itemId;
    if (id === itemId) {
      const p = extractUnitPrice(a);
      if (typeof p === 'number') prices.push(p);
    }
  }
  const stats = computeStats(prices);
  return { price: stats.median || stats.mean || 0, stats };
}

module.exports = {
  extractUnitPrice,
  computeStats,
  currentItemPriceFromAuctions,
};