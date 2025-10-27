const express = require('express');
const router = express.Router();
const Poll = require('../../models/Poll');
const { authenticateToken } = require('../../middleware/auth');

// GET /polls - Fetch all polls with optional location filter
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { target_location, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (target_location) {
      filter.target_location = target_location;
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const polls = await Poll.find(filter)
      .populate('created_by', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Poll.countDocuments(filter);
    
    res.json({
      polls,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: polls.length,
        totalRecords: total
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;