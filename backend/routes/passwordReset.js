const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const { generateResetToken, sendResetEmail, validateResetToken } = require('../services/passwordResetService');

// POST /civix/auth/forgot-password - Send reset token to email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = await User.findOne({ email: String(email) });
    if (!user) {
      return res.status(404).json({ error: 'User not found with this email' });
    }
    
    // Generate reset token
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    
    // Save token to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetExpires;
    await user.save();
    
    // Send email via Gmail
    try {
      await sendResetEmail(email, resetToken);
      res.json({ 
        message: 'Password reset token sent to your email',
        tokenExpires: '1 hour'
      });
    } catch (emailError) {
      console.error('Gmail sending failed:', emailError.message);
      res.status(500).json({ 
        error: 'Failed to send email: ' + emailError.message
      });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /civix/auth/reset-password - Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Find user with this token
    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    // Validate token
    if (!validateResetToken(user, token)) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /civix/auth/verify-reset-token/:token - Check if token is valid
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const user = await User.findOne({ passwordResetToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    if (!validateResetToken(user, token)) {
      return res.status(400).json({ error: 'Token expired' });
    }
    
    res.json({ 
      message: 'Token is valid',
      expiresAt: user.passwordResetExpires
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;