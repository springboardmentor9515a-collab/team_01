const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { adminAuth } = require('../../middleware/adminAuth');

// GET /admin/complaints/local - Admin views petitions by locality
router.get('/', adminAuth, async (req, res) => {
  try {
    const { location, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    const complaints = await Complaint.find(filter)
      .populate('created_by', 'name email')
      .populate('assigned_to', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const total = await Complaint.countDocuments(filter);
    
    res.json({
      complaints,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: complaints.length,
        totalRecords: total
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;