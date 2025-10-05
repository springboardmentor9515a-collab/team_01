const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { addToBlacklist } = require('../utils/tokenBlacklist');

// POST /civix/auth/logout - User logout
router.post('/', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token) {
    addToBlacklist(token);
  }
  
  res.json({ message: 'Logout successful' });
});

module.exports = router;