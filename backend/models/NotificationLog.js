const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  recipient: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'sms'],
    required: true
  },
  event: {
    type: String,
    enum: ['complaint_submitted', 'complaint_assigned', 'complaint_status_updated', 'petition_created'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  errorMessage: {
    type: String
  }
});

module.exports = mongoose.model('NotificationLog', notificationLogSchema);