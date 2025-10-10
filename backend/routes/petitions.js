const express = require('express');
const router = express.Router();
const Petition = require('../models/Petition');
const { authenticateToken } = require('../middleware/auth');
const notificationService = require('../services/notificationService');



// POST /civix/petitions - Create new petition
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, targetSignatures, location, expiryDate } = req.body;
    
    if (!title || !description || !category || !targetSignatures || !location || !expiryDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (targetSignatures < 1) {
      return res.status(400).json({ error: 'Target signatures must be at least 1' });
    }
    
    const expiry = new Date(expiryDate);
    if (expiry <= new Date()) {
      return res.status(400).json({ error: 'Expiry date must be in the future' });
    }
    
    const petition = new Petition({
      title,
      description,
      category,
      targetSignatures,
      location,
      expiryDate: expiry,
      createdBy: req.user._id
    });
    
    await petition.save();
    await petition.populate('createdBy', 'name email');
    
    // Send notification
    notificationService.sendPetitionCreated(req.user.email, title);
    
    res.status(201).json({
      message: 'Petition created successfully',
      petition
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /civix/petitions - Get all petitions with advanced filtering
router.get('/', async (req, res) => {
  try {
    const { status, category, location, createdBy, minSignatures, maxSignatures, sortBy, order, page, limit } = req.query;
    const filter = {};
    
    // Basic filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (createdBy) filter.createdBy = createdBy;
    
    // Signature range filters
    if (minSignatures || maxSignatures) {
      filter.currentSignatures = {};
      if (minSignatures) filter.currentSignatures.$gte = parseInt(minSignatures);
      if (maxSignatures) filter.currentSignatures.$lte = parseInt(maxSignatures);
    }
    
    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    // Sorting
    let sortOptions = { createdAt: -1 }; // default
    if (sortBy) {
      const sortOrder = order === 'asc' ? 1 : -1;
      sortOptions = { [sortBy]: sortOrder };
    }
    
    const petitions = await Petition.find(filter)
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);
    
    const total = await Petition.countDocuments(filter);
    
    res.json({ 
      petitions,
      pagination: {
        current: pageNum,
        total: Math.ceil(total / limitNum),
        count: petitions.length,
        totalRecords: total
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /civix/petitions/:id - Get single petition
router.get('/:id', async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!petition) {
      return res.status(404).json({ error: 'Petition not found' });
    }
    
    res.json({ petition });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /civix/petitions/:id - Update petition
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, targetSignatures, location, expiryDate } = req.body;
    
    const petition = await Petition.findById(req.params.id);
    if (!petition) {
      return res.status(404).json({ error: 'Petition not found' });
    }
    
    // Only creator can update their petition
    if (petition.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only update your own petitions' });
    }
    
    // Validate expiry date if provided
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      if (expiry <= new Date()) {
        return res.status(400).json({ error: 'Expiry date must be in the future' });
      }
    }
    
    // Validate target signatures if provided
    if (targetSignatures && targetSignatures < 1) {
      return res.status(400).json({ error: 'Target signatures must be at least 1' });
    }
    
    const updatedPetition = await Petition.findByIdAndUpdate(
      req.params.id,
      { title, description, category, targetSignatures, location, expiryDate },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.json({
      message: 'Petition updated successfully',
      petition: updatedPetition
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /civix/petitions/:id - Delete petition
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const petition = await Petition.findById(req.params.id);
    
    if (!petition) {
      return res.status(404).json({ error: 'Petition not found' });
    }
    
    // Only creator can delete their petition
    if (petition.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only delete your own petitions' });
    }
    
    await Petition.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Petition deleted successfully' });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /civix/petitions/user/my-petitions - Get user's petitions
router.get('/user/my-petitions', authenticateToken, async (req, res) => {
  try {
    const petitions = await Petition.find({ createdBy: req.user._id })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({ petitions });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;