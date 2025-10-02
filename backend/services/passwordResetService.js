const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Generate secure reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Create Gmail transporter with App Password
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // This should be 16-character App Password
    }
  });
};

// Send password reset email via Gmail
const sendResetEmail = async (email, token) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Gmail configuration missing. Please set EMAIL_USER and EMAIL_PASS in .env file');
  }

  if (process.env.EMAIL_PASS.length !== 16) {
    throw new Error('Gmail App Password must be exactly 16 characters. Please generate App Password from Google Account settings.');
  }

  const transporter = createGmailTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - Team 01',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>You requested a password reset for your Team 01 account.</p>
        
        <div style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #495057;">Your Reset Token:</h3>
          <div style="background-color: #e9ecef; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 16px; font-weight: bold; word-break: break-all; color: #212529;">
            ${token}
          </div>
        </div>
        
        <p><strong>Instructions:</strong></p>
        <ol>
          <li>Copy the token above</li>
          <li>Use it with the reset-password API</li>
          <li>Enter your new password</li>
        </ol>
        
        <p style="color: #dc3545;"><strong>⚠️ This token expires in 1 hour</strong></p>
        <p style="color: #6c757d; font-size: 14px;">If you didn't request this reset, please ignore this email and your password will remain unchanged.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Validate reset token
const validateResetToken = (user, token) => {
  if (!user.passwordResetToken || !user.passwordResetExpires) {
    return false;
  }
  
  if (user.passwordResetToken !== token) {
    return false;
  }
  
  if (user.passwordResetExpires < new Date()) {
    return false;
  }
  
  return true;
};

module.exports = {
  generateResetToken,
  sendResetEmail,
  validateResetToken
};