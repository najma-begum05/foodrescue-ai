import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from '../routes/authRoutes.js';
import listingRoutes from '../routes/listingRoutes.js';
import requestRoutes from '../routes/requestRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodrescue_ai';

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Base Route
app.get('/', (req, res) => {
  res.json({
    project: 'FoodRescue AI – Surplus Management Platform',
    version: '1.0.0',
    status: 'Backend API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// System Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString(),
    service: 'FoodRescue AI Core API'
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);

// Database connection helper (graceful connection)
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    console.log('✅ MongoDB connected successfully to:', MONGODB_URI);
  } catch (err) {
    console.warn('ℹ️  MongoDB connection notice:', err.message);
    console.warn('ℹ️  Tip: Running with active in-memory store for instant zero-dependency testing. You can configure a MongoDB Atlas URI in server/.env anytime.');
  }
};

// Start Server
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`🚀 FoodRescue AI Server listening on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
  console.log(`🍲 Listings API: http://localhost:${PORT}/api/listings`);
  console.log(`🤝 Requests API: http://localhost:${PORT}/api/requests`);
  console.log(`===============================================`);
  await connectDB();
});
