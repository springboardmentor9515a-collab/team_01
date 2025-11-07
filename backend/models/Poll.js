const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length >= 2;
      },
      message: 'Poll must have at least 2 options'
    }
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  target_location: {
    type: String,
    required: true,
    maxlength: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Poll', pollSchema);