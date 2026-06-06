import express from "express";
import {
  submitMessage,
  getMessages,
  replyMessage,
  deleteMessage
} from "../controller/contactController.js";
import adminAuth from "../middleware/auth.js";

const router = express.Router();

// Public route to submit contact enquiry
router.post("/", submitMessage);

// Private admin-only routes to manage enquiries
router.get("/", adminAuth, getMessages);
router.post("/:id/reply", adminAuth, replyMessage);
router.delete("/:id", adminAuth, deleteMessage);

export default router;
