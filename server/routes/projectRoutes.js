import express from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  uploadImage,
} from "../controller/projectController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getProjects);

// Private routes
router.post("/", adminAuth, createProject);
router.put("/:id", adminAuth, updateProject);
router.delete("/:id", adminAuth, deleteProject);
router.post("/upload", adminAuth, uploadImage);

export default router;
