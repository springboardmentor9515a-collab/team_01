const { body, validationResult } = require('express-validator');

// Poll creation validation
const createPollValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('options')
    .isArray({ min: 2 })
    .withMessage('Poll must have at least 2 options')
    .custom((options) => {
      if (options.some(option => typeof option !== 'string' || option.trim().length === 0)) {
        throw new Error('All options must be non-empty strings');
      }
      return true;
    }),
  
  body('target_location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Target location must be between 2 and 100 characters')
];

// Vote submission validation
const submitVoteValidation = [
  body('selected_option')
    .trim()
    .notEmpty()
    .withMessage('Selected option is required')
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
  createPollValidation,
  submitVoteValidation,
  handleValidationErrors
};