import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    trim: true
  },
  syllabus: {
    type: [String],
    required: true,
    default: []
  },
  image: {
    type: String,
    required: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  certBadge: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
