// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}` 
      });
    }
    
    next();
  };
};

// Specific role checkers
const requireAdmin = requireRole(['admin']);
const requireVolunteer = requireRole(['volunteer']);
const requireCitizen = requireRole(['citizen']);
const requireAdminOrVolunteer = requireRole(['admin', 'volunteer']);

module.exports = {
  requireRole,
  requireAdmin,
  requireVolunteer,
  requireCitizen,
  requireAdminOrVolunteer
};