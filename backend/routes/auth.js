const express = require('express');
const router = express.Router();

// Import separate route files
router.use('/signup', require('./signup'));
router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/me', require('./me'));
router.use('/delete', require('./deleteUser'));
router.use('/', require('./checkUser'));
router.use('/', require('./locationVerification'));
router.use('/', require('./passwordReset'));

module.exports = router;