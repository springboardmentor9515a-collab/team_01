const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { adminAuth } = require('../../middleware/adminAuth');
const { queryValidation, handleValidationErrors } = require('../../middleware/complaintValidation');

// GET /admin/complaints/all - Get all complaints with filters (existing API compatibility)
router.get('/', adminAuth, queryValidation, handleValidationErrors, async (req, res) => {
  try {
    const { 
      location, 
      title, 
      category, 
      status, 
      startDate, 
      endDate, 
      limit = 10, 
      skip = 0 
    } = req.query;

    const filter = {};

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (title) filter.title = { $regex: title, $options: 'i' };
    if (category) filter.category = category;
    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const limitNum = Math.min(parseInt(limit) || 10, 100);
    const skipNum = Math.max(parseInt(skip) || 0, 0);

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('created_by', 'name email role')
      .populate('assigned_to', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skipNum);

    res.json({
      complaints,
      pagination: {
        total,
        page: Math.floor(skipNum / limitNum) + 1,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;