const { Schema, model } = require('mongoose');

const WatchlistSchema = new Schema({
  userId: { type: String, index: true, required: true },
  realmId: { type: Number, index: true, required: true, default: 1303 },
  itemId: { type: Number, index: true, required: true },
  targetBuy: { type: Number },
  targetSell: { type: Number },
  alertEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Enforce compound uniqueness: (userId, realmId, itemId)
WatchlistSchema.index({ userId: 1, realmId: 1, itemId: 1 }, { unique: true });

module.exports = model('Watchlist', WatchlistSchema);