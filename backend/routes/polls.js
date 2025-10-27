const express = require('express');
const router = express.Router();

// Import poll route handlers
const createPoll = require('./poll_route/createPoll');
const getPolls = require('./poll_route/getPolls');


// Poll routes
router.use('/', createPoll);      // POST /polls
router.use('/', getPolls);        // GET /polls


module.exports = router;