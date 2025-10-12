const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// POST /civix/auth/verify-id - Submit ID for verification
router.post('/verify-id', authenticateToken, async (req, res) => {
  try {
    const { idNumber, idType } = req.body;
    
    if (!idNumber || !idType) {
      return res.status(400).json({ error: 'ID number and type are required' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.idVerification = {
      idNumber,
      idType,
      isVerified: false,
      verificationStatus: 'pending',
      verificationDate: null
    };
    
    await user.save();
    
    res.json({ 
      message: 'ID verification submitted successfully',
      status: 'pending'
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /civix/auth/verification-status - Get verification status
router.get('/verification-status', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('idVerification verifiedLocation');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      idVerification: {
        status: user.idVerification?.verificationStatus || 'not_submitted',
        isVerified: user.idVerification?.isVerified || false,
        idType: user.idVerification?.idType || null
      },
      locationVerification: {
        isVerified: user.verifiedLocation?.isVerified || false,
        address: user.verifiedLocation?.address || null
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;