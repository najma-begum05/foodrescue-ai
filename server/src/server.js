import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import authRoutes from '../routes/authRoutes.js';
import listingRoutes from '../routes/listingRoutes.js';
import requestRoutes from '../routes/requestRoutes.js';
import aiRoutes from '../routes/aiRoutes.js';
import logisticsRoutes from '../routes/logisticsRoutes.js';

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodrescue_ai';

// Security Headers (XSS, Frameguard, NoSniff, ReferrerPolicy)
app.use(helmet({
  contentSecurityPolicy: false, // Allow Leaflet tile CDN in dev/production
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate Limiting (DoS and Brute-Force Mitigation)
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40, // 40 login/registration requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

app.use('/api', globalApiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Body Parser Middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// NoSQL Injection & Query Parameter Sanitization Middleware
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
});

// Base Route
app.get('/', (req, res) => {
  res.json({
    project: 'FoodRescue AI – Surplus Management Platform',
    version: '1.0.0',
    status: 'Backend API is running securely',
    timestamp: new Date().toISOString()
  });
});

// System Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'in-memory session active';
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString(),
    service: 'FoodRescue AI Core API'
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/logistics', logisticsRoutes);

// Global 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' does not exist.`
  });
});

// Global Centralized Error Handling Middleware (No Stack Trace Leakage)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Exception:', err.message);
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    ...(isProduction ? {} : { stack: err.stack })
  });
});

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

// Start Server if run directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`===============================================`);
    console.log(`🚀 FoodRescue AI Server listening on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`🩺 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
    console.log(`🍲 Listings API: http://localhost:${PORT}/api/listings`);
    console.log(`🤝 Requests API: http://localhost:${PORT}/api/requests`);
    console.log(`🧠 AI Engine API: http://localhost:${PORT}/api/ai`);
    console.log(`🗺️ Fleet Logistics: http://localhost:${PORT}/api/logistics`);
    console.log(`🛡️ Security: Helmet + Rate Limiter + NoSQL Sanitizer`);
    console.log(`===============================================`);
    await connectDB();
  });
}

export default app;
