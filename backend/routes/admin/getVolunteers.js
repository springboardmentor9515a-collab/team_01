const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { adminAuth } = require('../../middleware/adminAuth');

// GET /admin/volunteers - Admin fetches all volunteers
router.get('/', adminAuth, async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' }, 'name email location createdAt')
      .sort({ createdAt: -1 });
    
    res.json({
      volunteers,
      count: volunteers.length
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;