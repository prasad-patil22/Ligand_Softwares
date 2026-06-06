import express from "express";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadImage,
} from "../controller/teamController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getTeamMembers);

// Private routes
router.post("/", adminAuth, createTeamMember);
router.put("/:id", adminAuth, updateTeamMember);
router.delete("/:id", adminAuth, deleteTeamMember);
router.post("/upload", adminAuth, uploadImage);

export default router;
