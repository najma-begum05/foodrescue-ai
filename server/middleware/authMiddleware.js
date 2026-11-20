import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { inMemoryUsers } from '../controllers/authController.js';
import mongoose from 'mongoose';

/**
 * Authentication Middleware:
 * Verifies JWT token from 'Authorization: Bearer <token>' header and attaches user to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_foodrescue_ai_2026');

    // Check if connected to MongoDB
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
      }
      req.user = user;
    } else {
      // In-memory fallback
      const user = inMemoryUsers.find(u => u._id === decoded.id || u.email === decoded.email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists in session.' });
      }
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.'
    });
  }
};

/**
 * Role-Based Access Control (RBAC) Middleware:
 * Restricts access to specific user roles (e.g., 'provider', 'ngo', 'logistics', 'admin').
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role forbidden: '${req.user?.role || 'Guest'}' is not authorized to access this resource. Required role: ${roles.join(' or ')}.`
      });
    }
    next();
  };
};

/**
 * Verification Status Guard:
 * Ensures only verified users (e.g. approved NGOs or providers) can perform critical operations.
 */
export const requireVerified = (req, res, next) => {
  if (req.user && req.user.verificationStatus !== 'verified' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Account pending administrative verification. Please wait for platform approval.'
    });
  }
  next();
};
