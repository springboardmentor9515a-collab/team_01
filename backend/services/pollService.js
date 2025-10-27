const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

// Calculate poll results with vote counts and percentages
const calculatePollResults = async (pollId) => {
  try {
    // Get poll and all votes
    const poll = await Poll.findById(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    const votes = await Vote.find({ poll_id: pollId });
    
    // Initialize results object
    const results = {};
    poll.options.forEach(option => {
      results[option] = 0;
    });

    // Count votes for each option
    votes.forEach(vote => {
      if (results.hasOwnProperty(vote.selected_option)) {
        results[vote.selected_option]++;
      }
    });

    const totalVotes = votes.length;
    
    return {
      results,
      totalVotes,
      percentages: getVotePercentages(results, totalVotes),
      chartData: formatResultsForChart(results)
    };

  } catch (error) {
    throw new Error(`Failed to calculate poll results: ${error.message}`);
  }
};

// Calculate vote percentages
const getVotePercentages = (results, totalVotes) => {
  const percentages = {};
  Object.keys(results).forEach(option => {
    percentages[option] = totalVotes > 0 ? 
      Math.round((results[option] / totalVotes) * 100) : 0;
  });
  return percentages;
};

// Format results for chart libraries
const formatResultsForChart = (results) => {
  return Object.keys(results).map(option => ({
    name: option,
    value: results[option]
  }));
};

// Get poll summary with most voted option
const getPollSummary = (results, totalVotes) => {
  if (totalVotes === 0) {
    return { mostVoted: null, leastVoted: null };
  }

  const options = Object.keys(results);
  const mostVoted = options.reduce((a, b) => results[a] > results[b] ? a : b);
  const leastVoted = options.reduce((a, b) => results[a] < results[b] ? a : b);

  return { mostVoted, leastVoted };
};

module.exports = {
  calculatePollResults,
  getVotePercentages,
  formatResultsForChart,
  getPollSummary
};