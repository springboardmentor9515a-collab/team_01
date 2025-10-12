const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const { authenticateToken } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/uploadValidation');

// GET /upload/signature - Generate secure upload signature
router.get('/signature', authenticateToken, (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const params = {
      timestamp: timestamp,
      folder: 'civix/complaints',
      resource_type: 'image',
      allowed_formats: 'jpg,png,jpeg'
    };
    
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
    
    res.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      folder: 'civix/complaints'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /upload/image - Direct upload with validation
router.post('/image', authenticateToken, upload, handleUploadError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const result = await cloudinary.uploader.upload_stream(
      {
        folder: 'civix/complaints',
        resource_type: 'image',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json({
          message: 'Image uploaded successfully',
          imageUrl: result.secure_url
        });
      }
    );
    
    result.end(req.file.buffer);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;