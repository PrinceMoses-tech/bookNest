import mongoose from 'mongoose';

let isConnecting = false;

const getMongoUri = () => process.env.MONGO_URI || process.env.MONGODB_URI;

const connectDB = async () => {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error(
      'Missing MongoDB URI. Set MONGO_URI (or MONGODB_URI for backward compatibility).'
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return mongoose.connection;
  }

  try {
    isConnecting = true;
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    if (
      error.message.includes('querySrv') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('ECONNREFUSED')
    ) {
      console.error(
        'MongoDB URI/Atlas DNS issue detected. Verify cluster hostname, IP whitelist, and try Atlas non-SRV URI if DNS blocks SRV lookups.'
      );
    }
    throw error;
  } finally {
    isConnecting = false;
  }
};

export const isDatabaseReady = () => mongoose.connection.readyState === 1;

export default connectDB;