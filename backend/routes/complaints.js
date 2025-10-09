const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin, requireVolunteer, requireCitizen, requireAdminOrVolunteer } = require('../middleware/roleAuth');
const notificationService = require('../services/notificationService');

// Validation middleware
const complaintValidation = [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be 5-200 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('category').isIn(['infrastructure', 'sanitation', 'water_supply', 'electricity', 'roads', 'public_safety', 'other']).withMessage('Invalid category'),
  body('location').trim().isLength({ min: 3, max: 200 }).withMessage('Location must be 3-200 characters')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /complaints/volunteers/me/complaints - Volunteer fetches assigned complaints (MUST be before /:id route)
router.get('/volunteers/me/complaints', authenticateToken, requireVolunteer, async (req, res) => {
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



// POST /complaints - Citizen submits new complaint
router.post('/', authenticateToken, requireCitizen, complaintValidation, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, category, location, photo_url } = req.body;
    
    const complaint = new Complaint({
      title,
      description,
      category,
      location,
      photo_url,
      createdBy: req.user._id
    });
    
    await complaint.save();
    await complaint.populate('createdBy', 'name email');
    
    // Send confirmation email to user
    notificationService.sendComplaintSubmitted(req.user.email, title);
    
    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /complaints - Admin fetches all complaints with filters
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
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

// PUT /complaints/assign - Admin assigns complaint to volunteer
router.put('/assign', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { complaintId, volunteerId } = req.body;
    
    if (!complaintId || !volunteerId) {
      return res.status(400).json({ error: 'Complaint ID and Volunteer ID are required' });
    }
    
    // Check if volunteer exists and has volunteer role
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    
    if (volunteer.role !== 'volunteer') {
      return res.status(400).json({ error: 'User is not a volunteer' });
    }
    
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    complaint.assigned_to = volunteerId;
    complaint.status = 'in_review';
    await complaint.save();
    
    await complaint.populate(['createdBy', 'assigned_to'], 'name email');
    
    // Send notification to volunteer
    notificationService.sendComplaintAssigned(volunteer.email, complaint.title);
    
    res.json({
      message: 'Complaint assigned successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// PUT /complaints/update-status - Volunteer updates complaint status
router.put('/update-status', authenticateToken, requireVolunteer, async (req, res) => {
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
    
    // Check if complaint is assigned to this volunteer
    if (!complaint.assigned_to || complaint.assigned_to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update complaints assigned to you' });
    }
    
    complaint.status = status;
    await complaint.save();
    
    await complaint.populate(['createdBy', 'assigned_to'], 'name email');
    
    // Send notification to complaint creator
    notificationService.sendComplaintStatusUpdate(complaint.createdBy.email, complaint.title, status);
    
    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /complaints/:id - Get single complaint (Admin or assigned volunteer)
router.get('/:id', authenticateToken, requireAdminOrVolunteer, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assigned_to', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    // Volunteers can only see complaints assigned to them
    if (req.user.role === 'volunteer' && 
        (!complaint.assigned_to || complaint.assigned_to._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({ complaint });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;