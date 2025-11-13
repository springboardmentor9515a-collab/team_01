const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/check-user', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ exists: false, error: 'Server error' });
  }
});

module.exports = router;