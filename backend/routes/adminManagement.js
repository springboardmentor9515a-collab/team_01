const express = require('express');
const router = express.Router();
const User = require('../models/User');

// DELETE /admin-management/delete-user/:email - Delete user by email (for testing only)
router.delete('/delete-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: `User ${email} deleted successfully`,
      deletedUser: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /admin-management/users - List all users (for testing only)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'name email role createdAt').sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;