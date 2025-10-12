const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const User = require('../../models/User');
const { adminAuth } = require('../../middleware/adminAuth');
const { assignComplaintValidation, handleValidationErrors } = require('../../middleware/complaintValidation');
const notificationService = require('../../services/notificationService');

// PUT /admin/complaints/assign - Admin assigns complaint to official
router.put('/', adminAuth, assignComplaintValidation, handleValidationErrors, async (req, res) => {
  try {
    const { complaintId, officialId } = req.body;
    
    const assignee = await User.findById(officialId);
    if (!assignee || !['admin', 'volunteer'].includes(assignee.role)) {
      return res.status(404).json({ error: 'Admin or Volunteer not found' });
    }
    
    const complaint = await Complaint.findOne({ complaint_id: complaintId });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    complaint.assigned_to = officialId;
    complaint.status = 'in_review';
    await complaint.save();
    
    await complaint.populate(['created_by', 'assigned_to'], 'name email');
    
    // Send email notification to volunteer
    notificationService.sendComplaintAssigned(assignee.email, complaint.title).catch(err => 
      console.error('Notification failed:', err.message)
    );
    
    res.json({
      message: 'Complaint assigned successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;