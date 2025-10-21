const { Schema, model } = require('mongoose');

const TokenPriceSchema = new Schema({
  region: { type: String, index: true, default: 'eu' },
  price: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = model('TokenPrice', TokenPriceSchema);