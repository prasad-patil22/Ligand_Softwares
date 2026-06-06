import express from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadImage,
} from "../controller/testimonialController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getTestimonials);

// Private routes
router.post("/", adminAuth, createTestimonial);
router.put("/:id", adminAuth, updateTestimonial);
router.delete("/:id", adminAuth, deleteTestimonial);
router.post("/upload", adminAuth, uploadImage);

export default router;
