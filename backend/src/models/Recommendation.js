const { Schema, model } = require('mongoose');

const RecommendationSchema = new Schema({
  itemId: { type: Number, index: true },
  itemName: { type: String },
  signal: { type: String, index: true }, // 'buy' | 'sell' | 'watch'
  confidence: { type: Number },
  realmId: { type: Number, index: true },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = model('Recommendation', RecommendationSchema);