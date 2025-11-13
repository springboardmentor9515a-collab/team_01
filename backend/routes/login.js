const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const { loginValidation, handleValidationErrors } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');

// POST /civix/auth/login - User login
router.post('/', authLimiter, loginValidation, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check if user signed up with Google OAuth
    if (user.googleId && !user.password) {
      return res.status(400).json({ 
        error: 'This account was created with Google. Please use Google Sign-In to login.' 
      });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    
    const { password: _, ...userResponse } = user.toObject();
    res.json({ 
      message: 'Login successful', 
      token, 
      user: userResponse 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;