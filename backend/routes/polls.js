const express = require('express');
const router = express.Router();

// Import poll route handlers
const createPoll = require('./poll_route/createPoll');
const getPolls = require('./poll_route/getPolls');
const submitVote = require('./poll_route/submitVote');
const getPollResults = require('./poll_route/getPollResults');

// Poll routes
router.use('/', createPoll);      // POST /polls
router.use('/', getPolls);        // GET /polls
router.use('/', submitVote);      // POST /polls/:id/vote
router.use('/', getPollResults);  // GET /polls/:id/results


module.exports = router;