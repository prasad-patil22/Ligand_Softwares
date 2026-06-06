import express from "express";
import {
  getCareers,
  createCareer,
  updateCareer,
  deleteCareer
} from "../controller/careerController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getCareers);

// Private routes
router.post("/", adminAuth, createCareer);
router.put("/:id", adminAuth, updateCareer);
router.delete("/:id", adminAuth, deleteCareer);

export default router;
