import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controller/serviceController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getServices);

// Private routes
router.post("/", adminAuth, createService);
router.put("/:id", adminAuth, updateService);
router.delete("/:id", adminAuth, deleteService);

export default router;
