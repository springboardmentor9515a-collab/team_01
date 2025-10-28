const requireCitizen = (req, res, next) => {
  if (req.user.role !== 'citizen') {
    return res.status(403).json({ error: 'Access denied. Citizen role required.' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

const requireVolunteer = (req, res, next) => {
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ error: 'Access denied. Volunteer role required.' });
  }
  next();
};

module.exports = { requireCitizen, requireAdmin, requireVolunteer };
