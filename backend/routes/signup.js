const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// POST /civix/auth/signup - User signup
router.post('/', async (req, res) => {
  try {
    const { name, email, password, location, role } = req.body;
    
    // Input validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }
    
    if (!['citizen', 'official'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either "citizen" or "official"' });
    }
    
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input format' });
    }
    
    const existingUser = await User.findOne({ email: String(email) });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      location,
      role
    });
    
    await user.save();
    
    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;