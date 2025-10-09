const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['infrastructure', 'sanitation', 'water_supply', 'electricity', 'roads', 'public_safety', 'other']
  },
  photo_url: {
    type: String,
    default: null
  },
  location: {
    type: String,
    required: true,
    maxlength: 200
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['received', 'in_review', 'resolved'],
    default: 'received'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better performance
complaintSchema.index({ category: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ assigned_to: 1 });
complaintSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);