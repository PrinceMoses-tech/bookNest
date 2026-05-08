import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import connectDB, { isDatabaseReady } from './config/db.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Return fast when database is unavailable instead of buffering queries.
app.use('/api', (req, res, next) => {
  if (isDatabaseReady()) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: 'Database unavailable. Please try again shortly.',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'BookNext API Server',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      orders: '/api/orders',
      users: '/api/users',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const startServer = async () => {
  try {
    await connectDB();

    mongoose.connection.on('error', (error) => {
      console.error(`MongoDB Connection Failed: ${error.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.error('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    app.listen(port, () => {
      console.log(`Server Running on port ${port}`);
    });
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
