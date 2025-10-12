const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { adminAuth } = require('../../middleware/adminAuth');
const { queryValidation, handleValidationErrors } = require('../../middleware/complaintValidation');

// GET /admin/complaints - Admin fetches all complaints
router.get('/', adminAuth, queryValidation, handleValidationErrors, async (req, res) => {
  try {
    const { status, category, assigned_to, location, page, limit } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (assigned_to) filter.assigned_to = assigned_to;
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
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