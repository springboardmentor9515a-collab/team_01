const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { authenticateToken } = require('../../middleware/auth');

// POST /complaints - Citizen submits new complaint
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, photo_url, location } = req.body;

    // Validate required fields
    if (!title || !description || !category || !location) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, description, category, location' 
      });
    }

    // Create new complaint
    const complaint = new Complaint({
      title,
      description,
      category,
      photo_url,
      location,
      created_by: req.user.id
    });

    await complaint.save();

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