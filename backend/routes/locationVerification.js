const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { getLocationFromIP } = require('../services/locationService');



// GET /civix/auth/location-status - Check location verification status
router.get('/location-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId).select('location verifiedLocation');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      registeredLocation: user.location,
      verifiedLocation: user.verifiedLocation,
      isLocationVerified: user.verifiedLocation ? user.verifiedLocation.isVerified : false
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /civix/auth/verify-location - Verify location using IP address
router.post('/verify-location', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip || '127.0.0.1';
    console.log('Detected IP for verification:', userIP);
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const ipLocation = await getLocationFromIP(userIP);
    
    // Update user's verified location
    user.verifiedLocation = {
      latitude: ipLocation.latitude,
      longitude: ipLocation.longitude,
      address: ipLocation.address,
      isVerified: true,
      verificationDate: new Date()
    };
    
    await user.save();
    
    res.json({
      message: 'Location verified via IP successfully',
      verifiedLocation: user.verifiedLocation,
      userIP: userIP
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;