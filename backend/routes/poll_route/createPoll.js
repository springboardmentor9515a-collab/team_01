const express = require('express');
const router = express.Router();
const Poll = require('../../models/Poll');
const { authenticateToken } = require('../../middleware/auth');

// POST /polls - Create new poll (Officials/Admins only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (only admins can create polls)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create polls' });
    }

    const { title, options, target_location } = req.body;

    // Basic validation
    if (!title || !options || !target_location) {
      return res.status(400).json({ error: 'Title, options, and target_location are required' });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Poll must have at least 2 options' });
    }

    const poll = new Poll({
      title,
      options,
      created_by: req.user._id,
      target_location
    });

    await poll.save();

    res.status(201).json({
      message: 'Poll created successfully',
      poll: {
        _id: poll._id,
        title: poll.title,
        options: poll.options,
        created_by: poll.created_by,
        target_location: poll.target_location,
        createdAt: poll.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;