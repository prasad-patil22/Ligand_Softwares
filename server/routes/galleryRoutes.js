import express from "express";
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  uploadImage,
} from "../controller/galleryController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getGalleryItems);

// Private routes
router.post("/", adminAuth, createGalleryItem);
router.put("/:id", adminAuth, updateGalleryItem);
router.delete("/:id", adminAuth, deleteGalleryItem);
router.post("/upload", adminAuth, uploadImage);

export default router;
