const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// POST /civix/auth/login - User login
router.post('/', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Input validation
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }
    
    if (!['citizen', 'official'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either "citizen" or "official"' });
    }
    
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input format' });
    }
    
    const user = await User.findOne({ email: String(email) });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    console.log('User from DB:', { email: user.email, role: user.role, requestedRole: role });
    
    // Check if user role matches requested role
    if (user.role !== role) {
      return res.status(400).json({ error: 'Invalid credentials for this role' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
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