import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Client role is required"],
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Testimonial description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Client image URL is required"],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
