import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import connectDB, { isDatabaseReady } from './config/db.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

// ── Validate critical environment variables at startup ─────────────────────────
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `[Server] ❌ Missing required environment variables: ${missing.join(', ')}`
  );
  console.error(
    '[Server]    Set them in Replit Secrets or a backend/.env file.'
  );
  process.exit(1);
}

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'https://book.princedesigns.tech',
  'https://www.book.princedesigns.tech',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps/postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Handle preflight requests
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Database readiness guard ───────────────────────────────────────────────────
// Checked before every /api request. Because bufferCommands is disabled, any
// query that slips past this guard will throw immediately instead of buffering.
app.use('/api', (req, res, next) => {
  if (isDatabaseReady()) {
    return next();
  }
  return res.status(503).json({
    success: false,
    message: 'Database unavailable. Please try again in a moment.',
  });
});

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'BookNest API Server',
    version: '1.0.0',
    db: isDatabaseReady() ? 'connected' : 'disconnected',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      orders: '/api/orders',
      users: '/api/users',
    },
  });
});

// ── Global error handler ───────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode =
    err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  console.error(`[Server] ❌ ${req.method} ${req.url} — ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});

// ── Start server (MongoDB MUST connect before listening) ───────────────────────
const startServer = async () => {
  try {
    await connectDB();

    // Attach ongoing connection event listeners after initial connection
    mongoose.connection.on('error', (err) => {
      console.error('[DB] ⚠️  Connection error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn(
        '[DB] ⚠️  Disconnected from MongoDB. Queries will return 503 until reconnected.'
      );
    });
    mongoose.connection.on('reconnected', () => {
      console.log('[DB] ✅ Reconnected to MongoDB.');
    });

    const server = app.listen(PORT, () => {
      console.log(`[Server] ✅ Running on http://localhost:${PORT}`);
    });

    // Give long-running uploads/queries up to 30 s before the socket closes
    server.timeout = 30000;

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`[Server] ${signal} received — shutting down gracefully...`);
      server.close(async () => {
        await mongoose.connection.close();
        console.log('[Server] Closed. Goodbye.');
        process.exit(0);
      });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[Server] ❌ Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
