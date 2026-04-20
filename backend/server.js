import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import { checkNickname } from './routes/checkNickname.js';
import { listProducts, getProductById } from './routes/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

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

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/auth/check-nickname', checkNickname);
app.use('/api/auth', authRoutes);

app.get('/api/products', listProducts);
app.get('/api/products/:id', getProductById);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

start();
