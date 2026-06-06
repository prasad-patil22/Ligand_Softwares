import Testimonial from "../model/Testimonial.js";
import cloudinary from "../cloudinary.js";

const DEFAULT_TESTIMONIALS = [
  {
    name: "Dr. M. S. Patil",
    role: "Principal, SDVS BCS College",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
    desc: "Ligand Softwares built our college portal from scratch, delivering an incredibly reliable web platform that manages student enrollment, departmental notifications, and class timetables. Their engineers were highly attentive, delivering training sessions for our administrative staff to ensure adoption. The portal has drastically optimized our operational workflows and improved communication with students. We are absolutely pleased with the quality of their work and their professionalism.",
    rating: 5
  },
  {
    name: "Karan Deshmukh",
    role: "Founder, AgriGrow Tech",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    desc: "The AgriTech Inventory System created by Ligand Software changed the way we track warehouse logistics. The custom IoT integration allows our managers to sync data from field devices to a centralized dashboard in real-time. Their database architects solved complex concurrency issues we had with our previous system, reducing latencies significantly. We highly recommend them for any embedded or database development project.",
    rating: 5
  },
  {
    name: "Pooja Kamble",
    role: "Alumna (Software Engineer, Infosys)",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400",
    desc: "Enrolling in Ligand's Full Stack Development incubation program was the best career decision I ever made. The trainers are active industry developers who guide you through real, production-ready codebases. I built several live widgets and got hand-on knowledge of React hooks, MongoDB pipelines, and AWS deployment. The mentorship prepared me for interviews, leading directly to my placement as a Software Engineer. Thank you, Ligand Softwares!",
    rating: 5
  },
  {
    name: "Robert Miller",
    role: "Operations Director, FinVantage (UK)",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    desc: "Outsourcing our native application development to Ligand Softwares was a seamless experience. They provided transparent project trackers, stayed on schedule, and delivered a high-performance cross-platform application that has received great reviews from our clients. Their engineering team is extremely skilled in modern frontend architectures and mobile state management.",
    rating: 5
  },
  {
    name: "Nitin Kulkarni",
    role: "Co-Founder, NetSecure Solutions",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400",
    desc: "We hired Ligand Softwares to audit and harden our cloud networks. Their cyber security specialists executed comprehensive vulnerability tests and security audits, patching several critical flaws in our firewall setup. They also provided training for our cloud operations team, helping us maintain compliance. Their execution speed and depth of security knowledge are truly impressive.",
    rating: 5
  }
];

// Helper to seed testimonials if empty
const seedTestimonialsIfEmpty = async () => {
  try {
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      console.log("Seeding default testimonials into database...");
      await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
      console.log("Default testimonials seeded successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding testimonials error:", error);
  }
};

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    await seedTestimonialsIfEmpty();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ testimonials });
  } catch (error) {
    console.error("Get Testimonials Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private (Admin only)
export const createTestimonial = async (req, res) => {
  try {
    const { name, role, desc, image, rating } = req.body;

    if (!name || !role || !desc || !image) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const parsedRating = rating !== undefined ? Number(rating) : 5;

    const testimonial = await Testimonial.create({
      name,
      role,
      desc,
      image,
      rating: parsedRating,
    });

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Create Testimonial Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin only)
export const updateTestimonial = async (req, res) => {
  try {
    const { name, role, desc, image, rating } = req.body;
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    if (name) testimonial.name = name;
    if (role) testimonial.role = role;
    if (desc) testimonial.desc = desc;
    if (image) testimonial.image = image;
    if (rating !== undefined) testimonial.rating = Number(rating);

    await testimonial.save();

    res.status(200).json({
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin only)
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Upload client avatar to Cloudinary
// @route   POST /api/testimonials/upload
// @access  Private (Admin only)
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body; // Base64 data string (data:image/png;base64,...)
    if (!image) {
      return res.status(400).json({ error: "No image data provided" });
    }

    console.log("Uploading avatar image to Cloudinary...");
    const uploadRes = await cloudinary.v2.uploader.upload(image, {
      folder: "testimonials",
    });

    res.status(200).json({
      message: "Avatar uploaded successfully",
      url: uploadRes.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: error.message || "Upload Failed" });
  }
};
