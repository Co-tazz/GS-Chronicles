require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/db');

const User = require('../src/models/User');
const Watchlist = require('../src/models/Watchlist');
const TokenHistory = require('../src/models/TokenHistory');
const Recommendation = require('../src/models/Recommendation');
const Auction = require('../src/models/Auction');
const TokenPrice = require('../src/models/TokenPrice');

async function run() {
  try {
    await connectDB();
    const report = {};

    // 1) Users: find admin by email
    const adminEmail = process.env.ADMIN_EMAIL || 'fransver25@gmail.com';
    const adminUser = await User.findOne({ email: adminEmail });
    report.user = adminUser ? {
      id: String(adminUser._id),
      email: adminUser.email,
      isAdmin: !!adminUser.isAdmin,
    } : null;

    // 2) Token histories: count docs
    const tokenHistCount = await TokenHistory.countDocuments();
    report.tokenhistories = { exists: tokenHistCount > 0, count: tokenHistCount };

    // 3) Watchlist: entries for admin user
    const adminId = adminUser ? String(adminUser._id) : null;
    const wlQuery = adminId ? { userId: adminId } : {};
    const wlItems = await Watchlist.find(wlQuery).sort({ createdAt: -1 }).limit(5);
    report.watchlist = { count: wlItems.length, sample: wlItems.map(i => ({ id: String(i._id), itemId: i.itemId, alertEnabled: i.alertEnabled })) };

    // 4) Recommendations: count docs
    const recCount = await Recommendation.countDocuments();
    report.recommendations = { exists: recCount > 0, count: recCount };

    // 5) Auctions: count docs
    const aucCount = await Auction.countDocuments();
    report.auctions = { exists: aucCount > 0, count: aucCount };

    // 6) TokenPrice: count docs (current price collection)
    const priceCount = await TokenPrice.countDocuments();
    report.tokenPrices = { exists: priceCount > 0, count: priceCount };

    console.log(JSON.stringify(report, null, 2));
  } catch (e) {
    console.error('Verification failed:', e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();