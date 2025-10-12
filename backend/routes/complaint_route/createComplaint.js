const express = require('express');
const router = express.Router();
const cloudinary = require('../../config/cloudinary');
const Complaint = require('../../models/Complaint');
const { authenticateToken } = require('../../middleware/auth');
const { requireCitizen } = require('../../middleware/roleAuth');
const { createComplaintValidation, handleValidationErrors } = require('../../middleware/complaintValidation');
const { createComplaintFormValidation, handleFormValidationErrors } = require('../../middleware/complaintFormValidation');
const { upload, handleUploadError } = require('../../middleware/uploadValidation');
const notificationService = require('../../services/notificationService');

// POST /complaints - Citizen submits new complaint (JSON)
router.post('/', authenticateToken, requireCitizen, createComplaintValidation, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, category, photo_url, location } = req.body;

    const complaint = new Complaint({
      title,
      description,
      category,
      photo_url,
      location,
      created_by: req.user._id
    });

    await complaint.save();

    // Send email notification
    notificationService.sendComplaintSubmitted(req.user.email, complaint.title).catch(err => 
      console.error('Notification failed:', err.message)
    );

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: {
        complaint_id: complaint.complaint_id,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        photo_url: complaint.photo_url,
        location: complaint.location,
        status: complaint.status,
        created_by: complaint.created_by,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /complaints/upload - Citizen submits complaint with image (Form-data)
router.post('/upload', authenticateToken, requireCitizen, upload, handleUploadError, createComplaintFormValidation, handleFormValidationErrors, async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    let photo_url = null;

    // Upload image to Cloudinary if file provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'civix/complaints',
            resource_type: 'image',
            allowed_formats: ['jpg', 'png', 'jpeg'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      
      photo_url = result.secure_url;
    }

    // Create complaint
    const complaint = new Complaint({
      title,
      description,
      category,
      photo_url,
      location,
      created_by: req.user._id
    });

    await complaint.save();

    // Send email notification
    notificationService.sendComplaintSubmitted(req.user.email, complaint.title).catch(err => 
      console.error('Notification failed:', err.message)
    );

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: {
        complaint_id: complaint.complaint_id,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        photo_url: complaint.photo_url,
        location: complaint.location,
        status: complaint.status,
        created_by: complaint.created_by,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;