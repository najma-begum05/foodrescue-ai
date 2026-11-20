import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';

// Pre-seeded demo users for development and fallback mode
export const inMemoryUsers = [
  {
    _id: 'usr-provider-01',
    name: 'Chef Rajesh Varma',
    email: 'provider@foodrescue.org',
    password: '', // will be hashed below
    role: 'provider',
    organizationName: 'Grand Horizon Convention & Hotels',
    phone: '+91 98765 43210',
    address: 'Banjara Hills Road #2, Hyderabad',
    location: { type: 'Point', coordinates: [78.4482, 17.4156] },
    verificationStatus: 'verified',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'usr-ngo-01',
    name: 'Sister Mary Teresa',
    email: 'ngo@foodrescue.org',
    password: '', // will be hashed below
    role: 'ngo',
    organizationName: 'Hope Haven Community Kitchen & Shelter',
    phone: '+91 98480 12345',
    address: 'Lakdikapul, Hyderabad',
    location: { type: 'Point', coordinates: [78.4636, 17.4042] },
    verificationStatus: 'verified',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'usr-logistics-01',
    name: 'Vikram Malhotra',
    email: 'driver@foodrescue.org',
    password: '', // will be hashed below
    role: 'logistics',
    organizationName: 'Urban Food Rescue Volunteer Fleet',
    phone: '+91 91234 56789',
    address: 'Ameerpet Hub, Hyderabad',
    location: { type: 'Point', coordinates: [78.4485, 17.4375] },
    verificationStatus: 'verified',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'usr-admin-01',
    name: 'Antigravity Administrator',
    email: 'admin@foodrescue.org',
    password: '', // will be hashed below
    role: 'admin',
    organizationName: 'FoodRescue AI Platform Oversight HQ',
    phone: '+91 1800 200 400',
    address: 'HITEC City Cyber Towers, Hyderabad',
    location: { type: 'Point', coordinates: [78.3814, 17.4504] },
    verificationStatus: 'verified',
    createdAt: new Date().toISOString()
  }
];

// Hash initial passwords for in-memory seed users
(async () => {
  const hash = await bcrypt.hash('Password123!', 10);
  inMemoryUsers.forEach(u => { u.password = hash; });
})();

// Helper to generate signed JWT Token
const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_foodrescue_ai_2026',
    { expiresIn: '30d' }
  );
};

// Helper to sanitize user object (strip password)
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  return obj;
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Provider, NGO, Logistics, Admin)
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role, organizationName, phone, address, coordinates } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const assignedRole = ['provider', 'ngo', 'logistics', 'admin'].includes(role) ? role : 'provider';
    // By default, NGOs require admin verification. Providers and Drivers start verified for smooth onboarding.
    const verificationStatus = assignedRole === 'ngo' ? 'pending' : 'verified';

    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        role: assignedRole,
        organizationName: organizationName || `${name}'s Organization`,
        phone: phone || '',
        address: address || '',
        location: {
          type: 'Point',
          coordinates: coordinates || [78.4867, 17.3850]
        },
        verificationStatus
      });

      const token = generateToken(user._id, user.email, user.role);

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        token,
        user: sanitizeUser(user)
      });
    }

    // 2. Fallback to in-memory store
    const existingInMem = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingInMem) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: assignedRole,
      organizationName: organizationName || `${name}'s Organization`,
      phone: phone || '',
      address: address || '',
      location: {
        type: 'Point',
        coordinates: coordinates || [78.4867, 17.3850]
      },
      verificationStatus,
      createdAt: new Date().toISOString()
    };

    inMemoryUsers.push(newUser);
    const token = generateToken(newUser._id, newUser.email, newUser.role);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! (Development in-memory session)',
      token,
      user: sanitizeUser(newUser)
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error during registration.'
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get JWT token
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // 1. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. No account found with this email.'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Password does not match.'
        });
      }

      const token = generateToken(user._id, user.email, user.role);

      return res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: sanitizeUser(user)
      });
    }

    // 2. Fallback to in-memory store
    const user = inMemoryUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.'
      });
    }

    const token = generateToken(user._id, user.email, user.role);

    return res.json({
      success: true,
      message: 'Login successful! (Development session)',
      token,
      user: sanitizeUser(user)
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error during login.'
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: sanitizeUser(req.user)
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving user profile.'
    });
  }
};

/**
 * @route   PUT /api/auth/profile
 * @desc    Update organization profile details
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, organizationName, phone, address, coordinates } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name;
      if (organizationName) user.organizationName = organizationName;
      if (phone) user.phone = phone;
      if (address) user.address = address;
      if (coordinates) user.location.coordinates = coordinates;

      await user.save();
      return res.json({ success: true, message: 'Profile updated successfully!', user: sanitizeUser(user) });
    }

    // In-memory update
    const user = inMemoryUsers.find(u => u._id === req.user._id || u.email === req.user.email);
    if (user) {
      if (name) user.name = name;
      if (organizationName) user.organizationName = organizationName;
      if (phone) user.phone = phone;
      if (address) user.address = address;
      if (coordinates) user.location.coordinates = coordinates;
      return res.json({ success: true, message: 'Profile updated successfully!', user: sanitizeUser(user) });
    }

    return res.status(404).json({ success: false, message: 'User not found in session.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Initiate password reset
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Please provide email.' });

  return res.json({
    success: true,
    message: `Password reset instructions dispatched to ${email}. For development testing, you can log in with password 'Password123!' or register a new account.`
  });
};

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
export const getAllUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json({ success: true, count: users.length, users });
    }

    const users = inMemoryUsers.map(sanitizeUser);
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving users.' });
  }
};

/**
 * @route   PUT /api/auth/verify-user/:id
 * @desc    Toggle NGO/Provider verification status (Admin only)
 * @access  Private (Admin)
 */
export const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'verified', 'pending', 'rejected'

    if (!['verified', 'pending', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findByIdAndUpdate(id, { verificationStatus: status }, { new: true }).select('-password');
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      return res.json({ success: true, message: `User status changed to ${status}`, user });
    }

    const user = inMemoryUsers.find(u => u._id === id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found in session' });
    user.verificationStatus = status;

    return res.json({ success: true, message: `User status changed to ${status}`, user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating user verification.' });
  }
};
