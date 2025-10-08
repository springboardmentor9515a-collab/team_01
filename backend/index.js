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
app.use('/civix/complaints', require('./routes/complaint_route/getAllComplaints'));//For Admin Getting All Complaints



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
