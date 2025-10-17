const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { authenticateToken } = require('../../middleware/auth');
const { requireCitizen } = require('../../middleware/roleAuth');
const { queryValidation, handleValidationErrors } = require('../../middleware/complaintValidation');

// GET /complaints/my-complaints - Citizen fetches own complaints
router.get('/', authenticateToken, requireCitizen, queryValidation, handleValidationErrors, async (req, res) => {
  try {
    const { status, category, page, limit } = req.query;
    const filter = { created_by: req.user._id };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const complaints = await Complaint.find(filter)
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