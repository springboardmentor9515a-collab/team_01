const express = require('express');
const router = express.Router();
const Complaint = require('../../models/Complaint');
const { adminAuth } = require('../../middleware/adminAuth');

// GET /admin/reports/export - Export reports as CSV/PDF
router.get('/', adminAuth, async (req, res) => {
  try {
    const { format = 'csv', month, year } = req.query;
    
    const currentDate = new Date();
    const targetMonth = month ? parseInt(month) - 1 : currentDate.getMonth();
    const targetYear = year ? parseInt(year) : currentDate.getFullYear();
    
    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0);
    
    const complaints = await Complaint.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate(['created_by', 'assigned_to'], 'name email');
    
    if (format === 'csv') {
      const csvHeader = 'ID,Title,Category,Status,Location,Created By,Assigned To,Created Date,Response\n';
      const csvData = complaints.map(c => 
        `${c.complaint_id},"${c.title}",${c.category},${c.status},"${c.location}","${c.created_by?.name || 'N/A'}","${c.assigned_to?.name || 'Unassigned'}",${c.createdAt.toISOString().split('T')[0]},"${c.official_response || 'No response'}"`
      ).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="complaints_${targetYear}_${targetMonth + 1}.csv"`);
      res.send(csvHeader + csvData);
    } else {
      // Simple JSON export for PDF generation on frontend
      res.json({
        reportData: complaints,
        summary: {
          total: complaints.length,
          assigned: complaints.filter(c => c.assigned_to).length,
          responded: complaints.filter(c => c.official_response).length,
          period: `${targetMonth + 1}/${targetYear}`
        }
      });
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;