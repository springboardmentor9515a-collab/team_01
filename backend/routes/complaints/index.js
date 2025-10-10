const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { authenticateToken } = require('../../middleware/auth');
const { requireCitizen } = require('../../middleware/roleAuth');
const notificationService = require('../../services/notificationService');

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
    
    notificationService.sendComplaintSubmitted(req.user.email, title);
    
    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;