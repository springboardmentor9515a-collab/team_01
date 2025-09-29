const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// POST /civix/auth/signup - User signup
router.post('/signup', async (req, res) => {
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

// POST /civix/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
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