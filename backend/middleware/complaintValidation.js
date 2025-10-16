const { body, param, query, validationResult } = require('express-validator');

// Base complaint validation rules (shared between JSON and form-data)
const baseComplaintValidation = [
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

// JSON complaint validation (with photo_url)
const createComplaintValidation = [
  ...baseComplaintValidation,
  body('photo_url')
    .optional()
    .isURL()
    .withMessage('Photo URL must be valid')
];

// Form-data complaint validation (no photo_url - handled by file upload)
const createComplaintFormValidation = baseComplaintValidation;

// Complaint assignment validation
const assignComplaintValidation = [
  body('complaintId')
    .matches(/^CMP\d{6}$/)
    .withMessage('Invalid complaint ID'),
  body('officialId')
    .isMongoId()
    .withMessage('Invalid official ID')
];

// Status update validation
const updateStatusValidation = [
  body('complaintId')
    .matches(/^CMP\d{6}$/)
    .withMessage('Invalid complaint ID'),
  body('status')
    .isIn(['in_review', 'resolved'])
    .withMessage('Status must be "in_review" or "resolved"')
];

// Query parameter validation
const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['received', 'in_review', 'resolved'])
    .withMessage('Invalid status'),
  query('category')
    .optional()
    .isIn(['infrastructure', 'sanitation', 'water_supply', 'electricity', 'roads', 'public_safety', 'education', 'healthcare', 'environment', 'transportation', 'safety', 'other'])
    .withMessage('Invalid category')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
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
  createComplaintValidation,
  createComplaintFormValidation,
  assignComplaintValidation,
  updateStatusValidation,
  queryValidation,
  handleValidationErrors
};