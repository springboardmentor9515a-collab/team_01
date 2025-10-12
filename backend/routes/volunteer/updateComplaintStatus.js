const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { authenticateToken } = require('../../middleware/auth');
const { requireVolunteer } = require('../../middleware/roleAuth');
const { updateStatusValidation, handleValidationErrors } = require('../../middleware/complaintValidation');
const notificationService = require('../../services/notificationService');

// PUT /volunteer/complaints/update-status - Volunteer updates complaint status
router.put('/', authenticateToken, requireVolunteer, updateStatusValidation, handleValidationErrors, async (req, res) => {
  try {
    const { complaintId, status } = req.body;
    
    const complaint = await Complaint.findOne({ complaint_id: complaintId });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    if (!complaint.assigned_to || complaint.assigned_to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update complaints assigned to you' });
    }
    
    complaint.status = status;
    await complaint.save();
    
    await complaint.populate(['created_by', 'assigned_to'], 'name email');
    
    // Send email notification to complaint creator
    notificationService.sendComplaintStatusUpdate(complaint.created_by.email, complaint.title, status).catch(err => 
      console.error('Notification failed:', err.message)
    );
    
    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;