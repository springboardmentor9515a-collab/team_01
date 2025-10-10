const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
<<<<<<< HEAD
  title: {
    type: String,
    required: true,
    maxlength: 200
=======
  complaint_id: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
>>>>>>> origin/main
  },
  description: {
    type: String,
    required: true,
<<<<<<< HEAD
    maxlength: 2000
=======
    trim: true
>>>>>>> origin/main
  },
  category: {
    type: String,
    required: true,
<<<<<<< HEAD
    enum: ['infrastructure', 'sanitation', 'water_supply', 'electricity', 'roads', 'public_safety', 'other']
  },
  photo_url: {
    type: String,
    default: null
=======
    trim: true
  },
  photo_url: {
    type: String,
    trim: true
>>>>>>> origin/main
  },
  location: {
    type: String,
    required: true,
<<<<<<< HEAD
    maxlength: 200
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
=======
    trim: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
>>>>>>> origin/main
  },
  status: {
    type: String,
    enum: ['received', 'in_review', 'resolved'],
    default: 'received'
<<<<<<< HEAD
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
=======
>>>>>>> origin/main
  }
}, {
  timestamps: true
});

<<<<<<< HEAD
// Create indexes for better performance
complaintSchema.index({ category: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ assigned_to: 1 });
complaintSchema.index({ createdBy: 1 });
=======
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

// Create indexes
complaintSchema.index({ category: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ assigned_to: 1 });
complaintSchema.index({ created_by: 1 });
>>>>>>> origin/main

module.exports = mongoose.model('Complaint', complaintSchema);