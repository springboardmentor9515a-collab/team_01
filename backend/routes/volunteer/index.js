const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { authenticateToken } = require('../../middleware/auth');
const { requireVolunteer } = require('../../middleware/roleAuth');
const notificationService = require('../../services/notificationService');

// GET /volunteer/complaints - Volunteer fetches assigned complaints
router.get('/complaints', authenticateToken, requireVolunteer, async (req, res) => {
  try {
    const { status, category, page, limit } = req.query;
    const filter = { assigned_to: req.user._id };
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const complaints = await Complaint.find(filter)
      .populate('createdBy', 'name email')
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

// PUT /volunteer/complaints/update-status - Volunteer updates complaint status
router.put('/complaints/update-status', authenticateToken, requireVolunteer, async (req, res) => {
  try {
    const { complaintId, status } = req.body;
    
    if (!complaintId || !status) {
      return res.status(400).json({ error: 'Complaint ID and status are required' });
    }
    
    if (!['in_review', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "in_review" or "resolved"' });
    }
    
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    if (!complaint.assigned_to || complaint.assigned_to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update complaints assigned to you' });
    }
    
    complaint.status = status;
    await complaint.save();
    
    await complaint.populate(['createdBy', 'assigned_to'], 'name email');
    
    notificationService.sendComplaintStatusUpdate(complaint.createdBy.email, complaint.title, status);
    
    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;