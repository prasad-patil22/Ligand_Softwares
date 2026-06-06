import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team member name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Team member role is required"],
      trim: true,
    },
    experience: {
      type: String,
      required: [true, "Team member experience is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Team member image URL is required"],
      trim: true,
    },
    socials: {
      linkedin: {
        type: String,
        trim: true,
        default: "",
      },
      twitter: {
        type: String,
        trim: true,
        default: "",
      },
      github: {
        type: String,
        trim: true,
        default: "",
      },
    },
    isExecutive: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
export default TeamMember;
