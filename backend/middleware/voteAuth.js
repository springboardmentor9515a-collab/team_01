const Vote = require('../models/Vote');
const Poll = require('../models/Poll');

// Check if user already voted on this poll
const checkDuplicateVote = async (req, res, next) => {
  try {
    const { id: poll_id } = req.params;
    const user_id = req.user._id;

    // Check if user already voted
    const existingVote = await Vote.findOne({ poll_id, user_id });
    if (existingVote) {
      return res.status(400).json({ 
        error: 'You have already voted on this poll',
        votedAt: existingVote.createdAt
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Validate poll exists and option is valid
const validatePollAndOption = async (req, res, next) => {
  try {
    const { id: poll_id } = req.params;
    const { selected_option } = req.body;

    // Check if poll exists
    const poll = await Poll.findById(poll_id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Check if selected option is valid
    if (!poll.options.includes(selected_option)) {
      return res.status(400).json({ 
        error: 'Invalid option selected',
        validOptions: poll.options
      });
    }

    // Attach poll to request for use in next middleware
    req.poll = poll;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  checkDuplicateVote,
  validatePollAndOption
};