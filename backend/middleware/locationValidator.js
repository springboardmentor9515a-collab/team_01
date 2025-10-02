const axios = require('axios');

const validateLocation = async (req, res, next) => {
  const { location } = req.body;
  
  // Skip validation if location is not provided (optional field)
  if (!location || location.trim() === '') {
    return next();
  }
  
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'CivixApp/1.0'
      },
      timeout: 5000 // 5 second timeout
    });
    
    if (response.data && response.data.length > 0) {
      // Location found, continue to next middleware
      next();
    } else {
      // Location not found
      return res.status(400).json({
        error: 'Invalid location',
        message: `Location '${location}' not found. Please provide a valid location.`
      });
    }
  } catch (error) {
    // API error - allow signup to continue (don't block user for API issues)
    console.error('Location validation API error:', error.message);
    next();
  }
};

module.exports = { validateLocation };