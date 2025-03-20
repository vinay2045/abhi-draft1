const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new admin user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    return res.status(400).json({
      success: false,
      message: 'Registration is disabled'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email); // Debug log

    // For development/testing purposes only
    // In production, you would validate against your database
    if (email === 'admin@example.com' && password === 'admin123') {
      const token = 'mock-jwt-token';
      
      // Set cookie with proper options
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only secure in production
        sameSite: 'Lax', // Less strict same-site policy
        path: '/', // Apply to all paths
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      console.log('Login successful, setting cookie'); // Debug log

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  } catch (err) {
    console.error('Login error:', err); // Debug log
    next(err);
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    path: '/'
  });

  console.log('User logged out, clearing cookie'); // Debug log

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  console.log('getMe accessed, cookies:', req.cookies); // Debug log
  console.log('getMe accessed, user:', req.user); // Debug log

  // For development/testing, we'll return a mock user
  // In production, you would get the user from authenticated request
  return res.status(200).json({
    success: true,
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    }
  });
}; 