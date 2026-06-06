import express from "express";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadCourseImage
} from "../controller/courseController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getCourses);

// Private routes
router.post("/", adminAuth, createCourse);
router.put("/:id", adminAuth, updateCourse);
router.delete("/:id", adminAuth, deleteCourse);
router.post("/upload", adminAuth, uploadCourseImage);

export default router;
