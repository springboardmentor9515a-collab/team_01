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
    required: true,
    maxlength: 255
  },
  role: {
    type: String,
    enum: ['citizen', 'official'],
    required: true
  },
  location: {
    type: String,
    maxlength: 100,
    required:true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);