const { Schema, model } = require('mongoose');

const AppConfigSchema = new Schema({
  _id: { type: String, default: 'global' },
  allowSignups: { type: Boolean, default: true },
});

module.exports = model('AppConfig', AppConfigSchema);