const { Schema, model } = require('mongoose');

const AuctionSchema = new Schema({
  realmId: { type: Number, index: true, required: true },
  lastModified: { type: Date },
  auctions: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model('Auction', AuctionSchema);