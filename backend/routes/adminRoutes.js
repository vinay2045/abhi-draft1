const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');

// Protect all routes
router.use(protect);
router.use(authorize);

// Admin routes
router.get('/dashboard', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Admin dashboard access granted',
    user: req.user
  });
});

module.exports = router; 