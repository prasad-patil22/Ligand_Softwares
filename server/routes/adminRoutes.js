import express from "express";
import {
  registerAdmin,
  loginAdmin,
  changePassword,
  getProfile,
} from "../controller/adminController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Private routes
router.post("/change-password", adminAuth, changePassword);
router.get("/profile", adminAuth, getProfile);

export default router;
