const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const authLimiter = require("../middleware/rateLimiter"); // 👈 rate limiter

// ================== JWT Helpers ==================
const generateAccessToken = (user) =>
  jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

const generateRefreshToken = (user) =>
  jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

// ================== REGISTER ==================
router.post(
  "/register",
  authLimiter, // 👈 Apply rate limiting
  [
    body("name").notEmpty().withMessage("Name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, location, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        location,
        role: role || "citizen",
      });

      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ================== LOGIN ==================
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== USERINFO ==================
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -refreshToken");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================== REFRESH TOKEN ==================
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
});

// ================== LOGOUT ==================
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.refreshToken = null;
    await user.save();
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
