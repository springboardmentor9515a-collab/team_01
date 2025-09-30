const rateLimit = require("express-rate-limit");

// Limit requests to 5 per minute per IP (you can adjust as needed)
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    error: "Too many attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = authLimiter;
