import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, "Service number/index is required (e.g., 01, 02)"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Service icon identifier is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
