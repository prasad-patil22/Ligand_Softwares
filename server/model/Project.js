import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Project image URL is required"],
      trim: true,
    },
    link: {
      type: String,
      required: [true, "Project link is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
