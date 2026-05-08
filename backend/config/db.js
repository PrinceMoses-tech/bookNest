import mongoose from 'mongoose';

// Fail immediately on any query when not connected — no silent buffering.
// This turns the cryptic "buffering timed out" error into a clear 503 response
// caught by the ensureDatabaseConnected() guard in each controller.
mongoose.set('bufferCommands', false);

const getMongoUri = () => process.env.MONGO_URI || process.env.MONGODB_URI;

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error(
      '[DB] Missing MongoDB URI. Set MONGO_URI in Replit Secrets or a .env file.'
    );
  }

  if (mongoose.connection.readyState === 1) {
    console.log('[DB] Already connected, reusing existing connection.');
    return mongoose.connection;
  }

  console.log('[DB] Connecting to MongoDB Atlas...');

  try {
    const conn = await mongoose.connect(mongoUri, {
      // How long the driver waits to find an available server before erroring
      serverSelectionTimeoutMS: 10000,
      // How long a send/receive on a socket can take before timing out
      socketTimeoutMS: 45000,
      // Heartbeat — detects dropped Atlas connections quickly
      heartbeatFrequencyMS: 10000,
      // Connection pool size
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log(`[DB] ✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`[DB]    Database: ${conn.connection.name}`);
    console.log(`[DB]    Ready state: ${conn.connection.readyState}`);

    return conn.connection;
  } catch (error) {
    console.error('[DB] ❌ MongoDB connection failed:', error.message);

    if (
      error.message.includes('querySrv') ||
      error.message.includes('ENOTFOUND')
    ) {
      console.error(
        '[DB]    DNS resolution failed. Check your MONGO_URI cluster hostname.'
      );
    }
    if (error.message.includes('Authentication failed')) {
      console.error(
        '[DB]    Authentication failed. Check your MongoDB username and password in MONGO_URI.'
      );
    }
    if (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('connect ETIMEDOUT')
    ) {
      console.error(
        '[DB]    Connection refused or timed out. Make sure 0.0.0.0/0 is in your MongoDB Atlas Network Access IP Allow List.'
      );
    }

    throw error;
  }
};

export const isDatabaseReady = () => mongoose.connection.readyState === 1;

export default connectDB;
