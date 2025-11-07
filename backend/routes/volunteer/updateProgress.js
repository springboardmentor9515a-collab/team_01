const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { authenticateToken } = require('../../middleware/auth');
const { requireVolunteer } = require('../../middleware/roleAuth');

// PUT /volunteer/complaints/update - Volunteer adds progress notes
router.put('/', authenticateToken, requireVolunteer, async (req, res) => {
  try {
    const { complaintId, notes, status } = req.body;
    
    if (!complaintId || !notes) {
      return res.status(400).json({ error: 'Complaint ID and notes are required' });
    }
    
    const complaint = await Complaint.findOne({ complaint_id: complaintId });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    if (!complaint.assigned_to || complaint.assigned_to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update complaints assigned to you' });
    }
    
    // Add to status history
    complaint.status_history.push({
      status: status || complaint.status,
      updated_by: req.user._id,
      notes: notes
    });
    
    if (status) {
      complaint.status = status;
    }
    
    await complaint.save();
    await complaint.populate(['created_by', 'assigned_to'], 'name email');
    
    res.json({
      message: 'Progress notes added successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;