import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    jobTitle: { type: String, required: true },
    resume: { type: String, required: true },
    coverLetter: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Application", ApplicationSchema);
