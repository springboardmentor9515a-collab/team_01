const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// GET /civix/auth/me - Get current user profile (protected)
router.get('/', authenticateToken, (req, res) => {
  const { _id, name, email, role, location, createdAt, updatedAt } = req.user;
  
  res.json({
    success: true,
    message: 'User profile retrieved successfully',
    profile: {
      id: _id,
      name,
      email,
      role,
      location: location || 'Not specified',
      memberSince: createdAt,
      lastUpdated: updatedAt
    }
  });
});

module.exports = router;