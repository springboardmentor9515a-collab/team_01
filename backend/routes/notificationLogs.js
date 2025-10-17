const express = require('express');
const NotificationLog = require('../models/NotificationLog');
const { authenticateToken } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

const router = express.Router();

// Get all notification logs (Admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const logs = await NotificationLog.find().sort({ sentAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's notification logs
router.get('/my-notifications', authenticateToken, async (req, res) => {
  try {
    const logs = await NotificationLog.find({ recipient: req.user.email }).sort({ sentAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notification stats (Admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await NotificationLog.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
