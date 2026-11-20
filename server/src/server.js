import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

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

// Database connection helper (graceful connection)
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000 // fast timeout if local mongod is not yet running
    });
    console.log('✅ MongoDB connected successfully to:', MONGODB_URI);
  } catch (err) {
    console.warn('⚠️  MongoDB connection notice:', err.message);
    console.warn('ℹ️  Tip: You can use a free MongoDB Atlas cloud connection string in server/.env, or start your local MongoDB.');
  }
};

// Start Server
app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`🚀 FoodRescue AI Server listening on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
  await connectDB();
});
