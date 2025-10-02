const rateLimit = require('express-rate-limit');

// Rate limiter for auth endpoints (login/signup)
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many requests from this IP',
    message: 'Please try again after 10 minutes',
    retryAfter: '10 minutes'
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

module.exports = { authLimiter };