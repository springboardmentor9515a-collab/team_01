const express = require('express');
const router = express.Router();
const Poll = require('../../models/Poll');
const Vote = require('../../models/Vote');
const { authenticateToken } = require('../../middleware/auth');

// GET /polls/:id/results - Get poll results with vote counts
router.get('/:id/results', authenticateToken, async (req, res) => {
  try {
    const { id: poll_id } = req.params;

    // Check if poll exists
    const poll = await Poll.findById(poll_id).populate('created_by', 'name email');
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Get all votes for this poll
    const votes = await Vote.find({ poll_id });
    
    // Count votes for each option
    const results = {};
    poll.options.forEach(option => {
      results[option] = 0;
    });

    votes.forEach(vote => {
      if (results.hasOwnProperty(vote.selected_option)) {
        results[vote.selected_option]++;
      }
    });

    const totalVotes = votes.length;
    
    // Calculate percentages
    const percentages = {};
    Object.keys(results).forEach(option => {
      percentages[option] = totalVotes > 0 ? 
        Math.round((results[option] / totalVotes) * 100) : 0;
    });

    res.json({
      poll: {
        _id: poll._id,
        title: poll.title,
        options: poll.options,
        created_by: poll.created_by,
        target_location: poll.target_location,
        createdAt: poll.createdAt
      },
      results,
      percentages,
      totalVotes,
      summary: {
        mostVoted: totalVotes > 0 ? 
          Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b) : null
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;