const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.post('/google', async (req, res) => {
  try {
    const { googleToken } = req.body;
    
    // Decode Google JWT token
    const decoded = JSON.parse(Buffer.from(googleToken.split('.')[1], 'base64').toString());
    
    // Check if user exists in database
    let user = await User.findOne({ email: decoded.email });
    
    if (!user) {
      // Create new user with default citizen role
      user = new User({
        name: decoded.name,
        email: decoded.email,
        role: 'citizen',
        isVerified: true,
        googleId: decoded.sub
      });
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Google authentication failed' });
  }
});

module.exports = router;