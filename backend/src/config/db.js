const mongoose = require('mongoose');
const { info, warn, error } = require('../utils/logger');

async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) {
    error('MONGO_URI is not set');
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    info('✅ Mongo connected');
  } catch (err) {
    error('[DB] Connection error', { message: err.message });
    throw err;
  }
}

function connectWithRetry(uri) {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) {
    error('MONGO_URI is not set');
    return;
  }
  const attempt = async () => {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      info('✅ Mongo connected');
    } catch (err) {
      warn(`Mongo reconnect in 30s: ${err.message}`);
      setTimeout(attempt, 30000);
    }
  };
  attempt();
}

module.exports = { connectDB, connectWithRetry };