const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

router.post('/google', async (req, res) => {
  try {
    const { googleToken, role, location, password } = req.body;
    
    // Decode Google JWT token
    const decoded = JSON.parse(Buffer.from(googleToken.split('.')[1], 'base64').toString());
    
    // Check if user exists in database
    let user = await User.findOne({ email: decoded.email });
    
    if (!user) {
      if (!role || !password) {
        // New user without role/password, return message to show form
        return res.json({ 
          success: false, 
          message: 'Account not found. Please sign up first.', 
          needsSignup: true 
        });
      }
      // Create new user with provided role
      const userData = {
        name: decoded.name,
        email: decoded.email,
        role: role,
        location: location || '',
        isVerified: true,
        googleId: decoded.sub
      };
      
      // Hash password
      userData.password = await bcrypt.hash(password, 10);
      
      user = new User(userData);
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
    console.error('Error details:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Google authentication failed',
      error: error.message 
    });
  }
});

module.exports = router;