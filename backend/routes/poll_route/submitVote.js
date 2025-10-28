const express = require('express');
const router = express.Router();
const Poll = require('../../models/Poll');
const Vote = require('../../models/Vote');
const { authenticateToken } = require('../../middleware/auth');

// POST /polls/:id/vote - Submit vote for a poll
router.post('/:id/vote', authenticateToken, async (req, res) => {
  try {
    const { id: poll_id } = req.params;
    const { selected_option } = req.body;
    const user_id = req.user._id;

    if (!selected_option) {
      return res.status(400).json({ error: 'Selected option is required' });
    }

    // Check if poll exists
    const poll = await Poll.findById(poll_id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if selected option is valid
    if (!poll.options.includes(selected_option)) {
      return res.status(400).json({ error: 'Invalid option selected' });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ poll_id, user_id });
    if (existingVote) {
      return res.status(400).json({ error: 'You have already voted on this poll' });
    }

    // Create new vote
    const vote = new Vote({
      poll_id,
      user_id,
      selected_option
    });

    await vote.save();

    res.status(201).json({
      message: 'Vote submitted successfully',
      vote: {
        poll_id: vote.poll_id,
        selected_option: vote.selected_option,
        createdAt: vote.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;