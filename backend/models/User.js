const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 150
  },
  password: {
    type: String,
    required: function() { return !this.googleId; },
    maxlength: 255
  },
  googleId: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['citizen', 'admin', 'volunteer'],
    required: true
  },
  location: {
    type: String,
    maxlength: 100,
    default: ''
  },
  verifiedLocation: {
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    address: {
      type: String,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: {
      type: Date,
      default: null
    }
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);