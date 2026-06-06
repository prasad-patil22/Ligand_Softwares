import express from "express";
import {
  submitApplication,
  getApplications,
  deleteApplication
} from "../controller/applicationController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public route to apply
router.post("/", submitApplication);

// Private admin-only routes
router.get("/", adminAuth, getApplications);
router.delete("/:id", adminAuth, deleteApplication);

export default router;
