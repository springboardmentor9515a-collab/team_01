// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Routes
app.use('/civix/auth', require('./routes/auth'));//For Authentication
app.use('/civix/complaints', require('./routes/complaint_route/createComplaint'));//For Creating Complaints
app.use('/civix/complaints/my-complaints', require('./routes/complaint_route/getMyComplaints'));//For Citizens to View Own Complaints
app.use('/civix/upload', require('./routes/upload'));//For File Uploads

// Admin Routes - Separated
app.use('/civix/admin/complaints', require('./routes/admin/getAllComplaints'));//Get All Complaints Basic
app.use('/civix/admin/complaints/all', require('./routes/admin/getAllComplaintsAdvanced'));//Get All Complaints Advanced
app.use('/civix/admin/complaints/assign', require('./routes/admin/assignComplaint'));//Assign Complaint

// Volunteer Routes - Separated
app.use('/civix/volunteer/complaints', require('./routes/volunteer/getAssignedComplaints'));//Get Assigned Complaints
app.use('/civix/volunteer/complaints/update-status', require('./routes/volunteer/updateComplaintStatus'));//Update Complaint Status



// For the database Connection -  @thesushpatil

const connectDB = require('./config/database');
const User = require('./models/User');

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
