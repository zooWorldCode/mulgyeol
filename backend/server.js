import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import oauthRoutes from './routes/oauth.js';
import couponRoutes from './routes/coupon.js';
import { checkNickname } from './routes/checkNickname.js';
import { listProducts, getProductById } from './routes/products.js';
import { createProductReview, listProductReviews } from './routes/reviews.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'shop';
const MONGODB_TIMEOUT_MS = Number(process.env.MONGODB_TIMEOUT_MS || 10000);

if (!MONGODB_URI) {
  console.error(
    'Set MONGODB_URI in .env to your MongoDB Atlas connection string (mongodb+srv://...)'
  );
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Set JWT_SECRET in .env (long random string for signing JWTs)');
  process.exit(1);
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || process.env.FRONTEND_PUBLIC_URL || true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/auth/check-nickname', checkNickname);
app.use('/api/auth', authRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/coupon', couponRoutes);

app.get('/api/products', listProducts);
app.get('/api/products/:id/reviews', listProductReviews);
app.post('/api/products/:id/reviews', createProductReview);
app.get('/api/products/:id', getProductById);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
      serverSelectionTimeoutMS: MONGODB_TIMEOUT_MS,
    });
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    console.error(
      'Check your MONGODB_URI and MongoDB Atlas Network Access IP allowlist.'
    );
    process.exit(1);
  }
}

start();
