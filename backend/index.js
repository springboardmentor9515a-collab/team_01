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

app.use('/civix/users', require('./routes/users'));//For Users Info



// For the database Connection -  @thesushpatil

const connectDB = require('./config/database');
const User = require('./models/User');

// Connect to MongoDB

connectDB();






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
