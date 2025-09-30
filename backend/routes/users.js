const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ================== GET ALL USERS (Admin only) ==================
router.get("/", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== GET USER BY ID (Protected) ==================
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    // Admins can view any user
    if (req.user.role === "admin") {
      const user = await User.findById(req.params.id).select("-password -refreshToken");
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.json(user);
    }

    // Non-admins can only view their own profile
    if (req.user.userId !== req.params.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findById(req.params.id).select("-password -refreshToken");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== UPDATE USER (Protected) ==================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, email, password, location, role } = req.body;

    // Find the user
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Non-admin users can only update their own profile
    if (req.user.role !== "admin" && req.user.userId !== req.params.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (location) user.location = location;

    // Only admins can change role
    if (role && req.user.role === "admin") {
      user.role = role;
    }

    // If password provided → hash it
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({
      message: "User updated successfully",
      user: { ...user.toObject(), password: undefined, refreshToken: undefined },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================== DELETE USER (Admin only) ==================
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
