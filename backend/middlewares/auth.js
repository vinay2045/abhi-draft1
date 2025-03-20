const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  // Debug logs
  console.log('Cookies:', req.cookies);
  
  let token;
  
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token found:', token);
  }
  
  // If token not found, add bypass for development to allow testing without MongoDB
  if (!token) {
    console.log('No token found - development bypass activated');
    // For development only - bypass authentication
    if (process.env.NODE_ENV === 'development') {
      req.user = { id: 'dev-user', name: 'Developer', role: 'admin' };
      return next();
    }
    
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  // For development/testing, we'll bypass actual token verification
  // In production, you would verify the token and get the user from database
  req.user = {
    id: 'admin123',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  };

  next();
};

// Grant access to specific roles
exports.authorize = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'User role not authorized to access this route'
    });
  }
  next();
}; 