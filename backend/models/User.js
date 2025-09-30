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
    maxlength: 150,
    index: true   // ✅ email index
  },
  password: {
    type: String,
    required: true,
    maxlength: 255
  },
  role: {
    type: String,
    enum: ['citizen', 'official', 'admin'], // ✅ added admin
    default: 'citizen',
    index: true   // ✅ role index
  },
  location: {
    type: String,
    maxlength: 100
  },
  refreshToken: { // ✅ store refresh token
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
