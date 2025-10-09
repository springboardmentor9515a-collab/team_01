const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// DELETE /temp/delete-user/:email - Temporary route to delete user
router.delete('/delete-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOneAndDelete({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      message: `User ${email} deleted successfully`,
      deletedUser: { name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /temp/create-admin - Create admin user
router.post('/create-admin', async (req, res) => {
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
      role: 'admin'
    });
    
    await user.save();
    const { password: _, ...userResponse } = user.toObject();
    
    res.status(201).json({ message: 'Admin user created successfully', user: userResponse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /temp/create-volunteer - Create volunteer user
router.post('/create-volunteer', async (req, res) => {
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
      role: 'volunteer'
    });
    
    await user.save();
    const { password: _, ...userResponse } = user.toObject();
    
    res.status(201).json({ message: 'Volunteer user created successfully', user: userResponse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;