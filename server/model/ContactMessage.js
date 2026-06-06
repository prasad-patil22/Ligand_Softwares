import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    replyMessage: { type: String, default: "" },
    isReplied: { type: Boolean, default: false },
    repliedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("ContactMessage", ContactMessageSchema);
