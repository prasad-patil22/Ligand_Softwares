import GalleryItem from "../model/GalleryItem.js";
import cloudinary from "../cloudinary.js";

const DEFAULT_GALLERY_ITEMS = [
  {
    title: "Company Events",
    desc: "Celebrations, annual meetups, achievements, and milestone events of Ligand Softwares.",
    date: "Dec 2025",
    coverImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    title: "Training Sessions",
    desc: "Classroom and lab training, mentoring programs, and visual interactive lecture sessions.",
    date: "Jan 2026",
    coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    title: "Workshops",
    desc: "Hands-on tech workshops on cloud services, cyber security practices, and IoT prototyping.",
    date: "Feb 2026",
    coverImage: "https://images.unsplash.com/photo-1544928147-79a2bec1638f?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1544928147-79a2bec1638f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    title: "Projects",
    desc: "Showcasing final year student projects, hardware prototype demos, and industry setups.",
    date: "Mar 2026",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1553484771-047a44eee27f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    title: "Hackathons",
    desc: "24-hour coding marathons, bug bounty programs, and collaborative speed-programming contests.",
    date: "April 2026",
    coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    title: "Team Activities",
    desc: "Team outings, sports meets, dinners, and indoor games to foster innovation and connection.",
    date: "May 2026",
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1516062423079-7ca13cca7c5b?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=600"
    ]
  }
];

// Helper to seed gallery categories if empty
const seedGalleryIfEmpty = async () => {
  try {
    const count = await GalleryItem.countDocuments();
    if (count === 0) {
      console.log("Seeding default gallery categories into database...");
      await GalleryItem.insertMany(DEFAULT_GALLERY_ITEMS);
      console.log("Default gallery categories seeded successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding gallery error:", error);
  }
};

// @desc    Get all gallery categories
// @route   GET /api/gallery
// @access  Public
export const getGalleryItems = async (req, res) => {
  try {
    await seedGalleryIfEmpty();
    const gallery = await GalleryItem.find().sort({ createdAt: -1 });
    res.status(200).json({ gallery });
  } catch (error) {
    console.error("Get Gallery Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Create a gallery category
// @route   POST /api/gallery
// @access  Private (Admin only)
export const createGalleryItem = async (req, res) => {
  try {
    const { title, desc, date, coverImage, images } = req.body;

    if (!title || !desc || !date || !coverImage) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const galleryItem = await GalleryItem.create({
      title,
      desc,
      date,
      coverImage,
      images: images || [],
    });

    res.status(201).json({
      message: "Gallery category created successfully",
      galleryItem,
    });
  } catch (error) {
    console.error("Create Gallery Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Update a gallery category
// @route   PUT /api/gallery/:id
// @access  Private (Admin only)
export const updateGalleryItem = async (req, res) => {
  try {
    const { title, desc, date, coverImage, images } = req.body;
    const { id } = req.params;

    const galleryItem = await GalleryItem.findById(id);
    if (!galleryItem) {
      return res.status(404).json({ error: "Gallery category not found" });
    }

    if (title) galleryItem.title = title;
    if (desc) galleryItem.desc = desc;
    if (date) galleryItem.date = date;
    if (coverImage) galleryItem.coverImage = coverImage;
    if (images) galleryItem.images = images;

    await galleryItem.save();

    res.status(200).json({
      message: "Gallery category updated successfully",
      galleryItem,
    });
  } catch (error) {
    console.error("Update Gallery Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a gallery category
// @route   DELETE /api/gallery/:id
// @access  Private (Admin only)
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await GalleryItem.findByIdAndDelete(id);
    if (!galleryItem) {
      return res.status(404).json({ error: "Gallery category not found" });
    }

    res.status(200).json({ message: "Gallery category deleted successfully" });
  } catch (error) {
    console.error("Delete Gallery Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Upload gallery photo to Cloudinary
// @route   POST /api/gallery/upload
// @access  Private (Admin only)
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body; // Base64 data string
    if (!image) {
      return res.status(400).json({ error: "No image data provided" });
    }

    console.log("Uploading gallery photo to Cloudinary...");
    const uploadRes = await cloudinary.v2.uploader.upload(image, {
      folder: "gallery",
    });

    res.status(200).json({
      message: "Gallery photo uploaded successfully",
      url: uploadRes.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: error.message || "Upload Failed" });
  }
};
