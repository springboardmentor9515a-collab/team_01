const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const { signupValidation, handleValidationErrors } = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateLocation } = require('../middleware/locationValidator');

// POST /civix/auth/signup - User signup
router.post('/', authLimiter, signupValidation, handleValidationErrors, validateLocation, async (req, res) => {
  try {
    const { name, email, password, location } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      location,
      role: 'citizen'
    });
    
    await user.save();
    
    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;