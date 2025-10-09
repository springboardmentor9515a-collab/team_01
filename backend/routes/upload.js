const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../services/uploadService');

// POST /upload/image - Upload single image
router.post('/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, 'civix/complaints');
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;