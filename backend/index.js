// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Debug: Check if environment variables are loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Not found');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Not found');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Routes
app.use('/civix/auth', require('./routes/auth'));//For Authentication

try {
  const petitionRoutes = require('./routes/petitions');
  app.use('/civix/petitions', petitionRoutes);
  console.log('Petition routes loaded successfully');
} catch (error) {
  console.error('Error loading petition routes:', error.message);
}

try {
  const complaintRoutes = require('./routes/complaints');
  app.use('/civix/complaints', complaintRoutes);
  console.log('Complaint routes loaded successfully');
} catch (error) {
  console.error('Error loading complaint routes:', error.message);
}

try {
  const adminRoutes = require('./routes/admin');
  app.use('/civix/admin', adminRoutes);
  console.log('Admin routes loaded successfully');
} catch (error) {
  console.error('Error loading admin routes:', error.message);
}

try {
  const volunteerRoutes = require('./routes/volunteer');
  app.use('/civix/volunteer', volunteerRoutes);
  console.log('Volunteer routes loaded successfully');
} catch (error) {
  console.error('Error loading volunteer routes:', error.message);
}



try {
  const passwordResetRoutes = require('./routes/passwordReset');
  app.use('/civix/auth', passwordResetRoutes);
  console.log('Password reset routes loaded successfully');
} catch (error) {
  console.error('Error loading password reset routes:', error.message);
}

try {
  const tempDeleteRoutes = require('./routes/tempDelete');
  app.use('/temp', tempDeleteRoutes);
  console.log('Temp delete routes loaded successfully');
} catch (error) {
  console.error('Error loading temp delete routes:', error.message);
}





// For the database Connection -  @thesushpatil

const connectDB = require('./config/database');
const User = require('./models/User');

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log('✅ Database connection established');
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️ Server will continue without database connection');
    // Don't exit, let server run without DB for debugging
  });




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
