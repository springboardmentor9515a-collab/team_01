const { body, validationResult } = require('express-validator');

// Complaint creation validation for multipart form data
const createComplaintFormValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be 5-200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be 10-2000 characters'),
  body('category')
    .isIn(['infrastructure', 'sanitation', 'water_supply', 'electricity', 'roads', 'public_safety', 'education', 'healthcare', 'environment', 'transportation', 'safety', 'other'])
    .withMessage('Invalid category'),
  body('location')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Location must be 3-200 characters')
];

// Handle validation errors for form data
const handleFormValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  createComplaintFormValidation,
  handleFormValidationErrors
};