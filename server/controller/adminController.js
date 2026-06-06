import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../model/Admin.js";

// Helper to generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN || "1d",
  });
};

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public (Initial setup, or from Dashboard)
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    // Check if email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    if (admin) {
      res.status(201).json({
        message: "Admin registered successfully",
        admin: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
        },
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ error: "Invalid admin data" });
    }
  } catch (error) {
    console.error("Register Admin Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter email and password" });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
      message: "Login successful",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
      },
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Change admin password
// @route   POST /api/admin/change-password
// @access  Private (Admin only)
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Please enter old and new passwords" });
    }

    // Since req.admin does not have password (due to select("-password") in auth middleware),
    // we fetch the full admin details.
    const admin = await Admin.findById(req.admin._id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin only)
export const getProfile = async (req, res) => {
  res.status(200).json({ admin: req.admin });
};
