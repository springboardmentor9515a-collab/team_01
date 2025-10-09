const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// DELETE /civix/auth/delete - Delete current user
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;