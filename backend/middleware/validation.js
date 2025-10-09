const { body, validationResult } = require('express-validator');

// Validation rules for signup
const signupValidation = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2-100 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  
  body('location')
    .optional()
    .isLength({ max: 100 })
<<<<<<< HEAD
    .withMessage('Location must not exceed 100 characters'),
  
  body('role')
    .optional()
    .isIn(['citizen', 'official'])
    .withMessage('Role must be one of: citizen, official')
=======
    .withMessage('Location must not exceed 100 characters')
>>>>>>> origin/main
];

// Validation rules for login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Middleware to handle validation errors
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
  signupValidation,
  loginValidation,
  handleValidationErrors
};