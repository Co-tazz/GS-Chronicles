const { Schema, model } = require('mongoose');

const PricePointSchema = new Schema({
  timestamp: { type: Date, required: true },
  price: { type: Number, required: true },
});

const HistorySchema = new Schema({
  itemId: { type: Number, index: true, required: true },
  data: { type: [PricePointSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = model('History', HistorySchema);