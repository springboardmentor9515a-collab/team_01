const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { adminAuth } = require('../../middleware/adminAuth');

// PUT /admin/complaints/respond - Admin gives final response
router.put('/', adminAuth, async (req, res) => {
  try {
    const { complaintId, official_response, status } = req.body;
    
    if (!complaintId || !official_response) {
      return res.status(400).json({ error: 'Complaint ID and response are required' });
    }
    
    const complaint = await Complaint.findOne({ complaint_id: complaintId });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    complaint.official_response = official_response;
    complaint.status = status || 'responded';
    
    // Add to status history
    complaint.status_history.push({
      status: complaint.status,
      updated_by: req.user._id,
      notes: `Official response: ${official_response}`
    });
    
    await complaint.save();
    await complaint.populate(['created_by', 'assigned_to'], 'name email');
    
    res.json({
      message: 'Official response added successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;