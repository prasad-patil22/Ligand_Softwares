import mongoose from "mongoose";

const CareerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, required: true },
    experience: { type: String, required: true },
    desc: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["JOBS", "INTERNSHIPS"]
    }
  },
  { timestamps: true }
);

export default mongoose.model("Career", CareerSchema);
