const { Schema, model } = require('mongoose');

const PricePointSchema = new Schema({
  timestamp: { type: Date, required: true },
  price: { type: Number, required: true },
});

const TokenHistorySchema = new Schema({
  region: { type: String, index: true, default: 'eu' },
  data: { type: [PricePointSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model('TokenHistory', TokenHistorySchema);