const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaint_id: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['infrastructure', 'sanitation', 'water_supply', 'electricity', 'roads', 'public_safety', 'education', 'healthcare', 'environment', 'transportation', 'safety', 'other'],
    trim: true
  },
  photo_url: {
    type: String,
    default: null,
    trim: true
  },
  location: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  }
}, {
  timestamps: true
});

// Generate complaint ID before saving
complaintSchema.pre('save', async function(next) {
  if (!this.complaint_id) {
    try {
      const count = await this.constructor.countDocuments();
      this.complaint_id = `CMP${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Create indexes for better performance
complaintSchema.index({ category: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ assigned_to: 1 });
complaintSchema.index({ created_by: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);