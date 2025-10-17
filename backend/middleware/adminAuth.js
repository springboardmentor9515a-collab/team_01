const { authenticateToken } = require('./auth');

const adminAuth = async (req, res, next) => {
  // First authenticate the token
  authenticateToken(req, res, (err) => {
    if (err) return next(err);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    next();
  });
};

module.exports = { adminAuth };