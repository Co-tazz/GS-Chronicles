const { Schema, model } = require('mongoose');

const SettingsSchema = new Schema({
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
});

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, index: true },
  // Store hashed password in `password` field
  password: { type: String, required: true },
  // Admin flag derived at signup (ADMIN_EMAIL)
  isAdmin: { type: Boolean, default: false },
  settings: { type: SettingsSchema, default: () => ({}) },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('User', UserSchema);