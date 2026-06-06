import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Gallery item title is required"],
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Gallery item description is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Gallery item date/month is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, "Gallery item cover image is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
export default GalleryItem;
