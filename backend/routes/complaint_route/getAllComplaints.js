const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { adminAuth } = require('../../middleware/adminAuth');

// GET /complaints - Admin fetches all complaints with filters
router.get('/', adminAuth, async (req, res) => {
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

    // Build filter object
    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          return res.status(400).json({ error: 'Invalid startDate format' });
        }
        filter.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          return res.status(400).json({ error: 'Invalid endDate format' });
        }
        filter.createdAt.$lte = end;
      }
    }

    // Validate pagination parameters
    const limitNum = parseInt(limit);
    const skipNum = parseInt(skip);
    
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Limit must be between 1 and 100' });
    }
    
    if (isNaN(skipNum) || skipNum < 0) {
      return res.status(400).json({ error: 'Skip must be 0 or greater' });
    }

    // Get total count for pagination
    const total = await Complaint.countDocuments(filter);

    // Fetch complaints with filters
    const complaints = await Complaint.find(filter)
      .populate('created_by', 'name email role')
      .populate('assigned_to', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skipNum);

    // Build response
    const response = {
      complaints,
      pagination: {
        total,
        page: Math.floor(skipNum / limitNum) + 1,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };

    // Add applied filters to response
    const appliedFilters = {};
    if (location) appliedFilters.location = location;
    if (title) appliedFilters.title = title;
    if (category) appliedFilters.category = category;
    if (status) appliedFilters.status = status;
    if (startDate) appliedFilters.startDate = startDate;
    if (endDate) appliedFilters.endDate = endDate;

    if (Object.keys(appliedFilters).length > 0) {
      response.filters_applied = appliedFilters;
    }

    res.json(response);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;