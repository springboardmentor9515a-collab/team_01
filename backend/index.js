// backend/index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Routes
app.use("/civix/auth", require("./routes/auth"));              // Authentication (register, login, userinfo)
app.use("/civix/users", require("./routes/users"));            // Users Info (protected, role-based access)
app.use("/civix/forgot-password", require("./routes/forgotPassword")); // Reset password

// Connect DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
