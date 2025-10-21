const { Schema, model } = require('mongoose');

const AlertSchema = new Schema({
  type: { type: String, enum: ['BUY', 'SELL'], required: true, index: true },
  itemId: { type: Number, required: true, index: true },
  realmId: { type: Number, required: true, index: true },
  userId: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  threshold: { type: Number, required: true },
  time: { type: Date, default: Date.now },
  state: { type: String, enum: ['active', 'acknowledged', 'dismissed'], default: 'active', index: true },
});

// Useful index for state checks and dedupe
AlertSchema.index({ userId: 1, realmId: 1, itemId: 1, type: 1, state: 1 });

module.exports = model('Alert', AlertSchema);