import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  getAllUsers,
  verifyUser
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Authentication Endpoints
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected User Profile Endpoints
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Admin-Only Governance & Verification Endpoints
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/verify-user/:id', protect, authorize('admin'), verifyUser);

export default router;
