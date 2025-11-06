const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { adminAuth } = require('../../middleware/adminAuth');

// GET /admin/reports/engagement - Generate monthly civic report
router.get('/', adminAuth, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Default to current month if not provided
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();
    
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    
    // Get all complaints for the month
    const complaints = await Complaint.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('assigned_to', 'name');
    
    // Calculate metrics
    const totalPetitions = complaints.length;
    const assignedCount = complaints.filter(c => c.assigned_to).length;
    const respondedCount = complaints.filter(c => c.status === 'responded' || c.status === 'closed' || c.official_response).length;
    
    // Calculate average response time
    const respondedComplaints = complaints.filter(c => c.official_response);
    const avgResponseTime = respondedComplaints.length > 0 
      ? respondedComplaints.reduce((sum, c) => {
          const responseTime = new Date(c.updatedAt) - new Date(c.createdAt);
          return sum + (responseTime / (1000 * 60 * 60 * 24)); // days
        }, 0) / respondedComplaints.length
      : 0;
    
    // Status breakdown
    const statusBreakdown = {
      active: complaints.filter(c => c.status === 'active').length,
      assigned: complaints.filter(c => c.status === 'assigned').length,
      under_review: complaints.filter(c => c.status === 'under_review').length,
      responded: complaints.filter(c => c.status === 'responded').length,
      closed: complaints.filter(c => c.status === 'closed').length
    };
    
    // Category breakdown
    const categoryBreakdown = {};
    complaints.forEach(c => {
      categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
    });
    
    res.json({
      period: {
        month: targetMonth + 1,
        year: targetYear,
        startDate,
        endDate
      },
      metrics: {
        totalPetitions,
        assignedCount,
        respondedCount,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100
      },
      statusBreakdown,
      categoryBreakdown
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;