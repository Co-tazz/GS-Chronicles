// One-off utility to ensure ADMIN_EMAIL exists and can log in
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

async function main() {
  const uri = process.env.MONGO_URI;
  const adminEmail = process.env.ADMIN_EMAIL;
  const newPassword = process.env.ADMIN_RESET_PASSWORD || 'Test12345!';
  if (!uri || !adminEmail) {
    console.error('Missing MONGO_URI or ADMIN_EMAIL');
    process.exit(1);
  }
  await mongoose.connect(uri, { dbName: (new URL(uri).pathname?.slice(1) || 'wowah') });
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    let user = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!user) {
      user = await User.create({ email: adminEmail.toLowerCase(), username: 'admin', password: hash, isAdmin: true });
      console.log(JSON.stringify({ ok: true, action: 'created', id: user._id.toString(), email: user.email }));
    } else {
      user.password = hash;
      user.isAdmin = true;
      await user.save();
      console.log(JSON.stringify({ ok: true, action: 'updated', id: user._id.toString(), email: user.email }));
    }
  } catch (e) {
    console.error(JSON.stringify({ ok: false, error: e.message }));
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();