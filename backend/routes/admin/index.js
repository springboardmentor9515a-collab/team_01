const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const User = require('../../models/User');
const { authenticateToken } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/roleAuth');
const notificationService = require('../../services/notificationService');

// GET /admin/complaints - Admin fetches all complaints
router.get('/complaints', authenticateToken, requireAdmin, async (req, res) => {
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
      .populate('createdBy', 'name email')
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

// PUT /admin/complaints/assign - Admin assigns complaint to volunteer
router.put('/complaints/assign', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { complaintId, volunteerId } = req.body;
    
    if (!complaintId || !volunteerId) {
      return res.status(400).json({ error: 'Complaint ID and Volunteer ID are required' });
    }
    
    const volunteer = await User.findById(volunteerId);
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    complaint.assigned_to = volunteerId;
    complaint.status = 'in_review';
    await complaint.save();
    
    await complaint.populate(['createdBy', 'assigned_to'], 'name email');
    
    notificationService.sendComplaintAssigned(volunteer.email, complaint.title);
    
    res.json({
      message: 'Complaint assigned successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;