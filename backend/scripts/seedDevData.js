require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');
const TokenPrice = require('../src/models/TokenPrice');
const TokenHistory = require('../src/models/TokenHistory');
const Auction = require('../src/models/Auction');
const { runAiScan } = require('../src/services/aiEngine');

async function seedToken(region = process.env.REGION || 'eu') {
  const now = new Date();
  const basePrice = 285000;
  // Upsert current price
  await TokenPrice.findOneAndUpdate(
    { region },
    { price: basePrice, lastUpdated: now },
    { upsert: true, new: true }
  );
  // Last 7 days history
  const points = [];
  for (let d = 6; d >= 0; d--) {
    const ts = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
    const jitter = Math.round((Math.random() - 0.5) * 10000);
    points.push({ timestamp: ts, price: basePrice + jitter });
  }
  await TokenHistory.findOneAndUpdate(
    { region },
    { data: points, updatedAt: now },
    { upsert: true, new: true }
  );
  return { region, points: points.length };
}

function makeAuction(id, prices) {
  // Build multiple entries for given item id
  return prices.map((p) => ({ item: { id: id }, unit_price: p, quantity: 1 }));
}

async function seedAuctions(realmId = Number(process.env.DEFAULT_REALM_ID || 1303)) {
  const now = new Date();
  const auctions = [];
  // More entries ensure AI scan generates signals
  auctions.push(...makeAuction(19019, [2400000, 2350000, 2500000, 2450000, 2550000, 2600000])); // Thunderfury - high price swings
  auctions.push(...makeAuction(11370, [1200, 1150, 1300, 1100, 1250, 1180])); // Dark Iron Ore
  auctions.push(...makeAuction(152513, [7500, 7800, 7300, 7100, 7600, 8000, 7900])); // Platinum Ore
  auctions.push(...makeAuction(168645, [42000, 41000, 43000, 40500, 44000, 45000])); // Zin'anthid
  auctions.push(...makeAuction(171828, [25000, 26000, 24000, 24500, 25500, 26500])); // Heavy Callous Hide

  const doc = await Auction.findOneAndUpdate(
    { realmId },
    { auctions, lastModified: now, updatedAt: now },
    { upsert: true, new: true }
  );
  return { realmId, count: (doc.auctions || []).length };
}

async function seedRecommendations(realmId) {
  await runAiScan({ realmId });
}

async function run() {
  try {
    await connectDB();
    const region = process.env.REGION || 'eu';
    const realmId = Number(process.env.DEFAULT_REALM_ID || 1303);
    const t = await seedToken(region);
    const a = await seedAuctions(realmId);
    await seedRecommendations(realmId);
    console.log(JSON.stringify({ token: t, auctions: a, recommendationsSeeded: true }, null, 2));
  } catch (e) {
    console.error('Seed failed:', e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();