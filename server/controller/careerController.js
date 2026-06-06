import Career from "../model/Career.js";

const DEFAULT_CAREERS = [
  // Jobs
  {
    title: "Full Stack Developer",
    location: "Sankeshwar (On-site)",
    type: "Full-Time",
    experience: "2-5 Years",
    desc: "We are seeking a developer expert in React and Node.js to design corporate software modules. Should understand MySQL/MongoDB and REST design.",
    category: "JOBS"
  },
  {
    title: "React Developer",
    location: "Sankeshwar (Hybrid)",
    type: "Full-Time",
    experience: "1-3 Years",
    desc: "Seeking a frontend developer expert in React, Tailwind, and State Management. You will construct modular interfaces with smooth transitions.",
    category: "JOBS"
  },
  {
    title: "PHP Developer",
    location: "Sankeshwar (On-site)",
    type: "Full-Time",
    experience: "2-4 Years",
    desc: "Requires strong backend experience with Laravel/CodeIgniter and MySQL. You will maintain existing portals and build features for client accounts.",
    category: "JOBS"
  },
  {
    title: "UI/UX Designer",
    location: "Remote / Hybrid",
    type: "Full-Time / Part-Time",
    experience: "1-3 Years",
    desc: "Creative thinker with a killer portfolio in Figma. You will prototype websites, mobile apps, and design our product marketing visuals.",
    category: "JOBS"
  },
  {
    title: "Software Tester",
    location: "Sankeshwar (On-site)",
    type: "Full-Time",
    experience: "1-2 Years",
    desc: "Perform manual & automated testing. Experience in writing unit test cases, regression flows, and API testing with Postman is ideal.",
    category: "JOBS"
  },
  // Internships
  {
    title: "Web Development Intern",
    location: "Sankeshwar (On-site)",
    type: "Internship (3-6 Months)",
    experience: "No experience / College students",
    desc: "Learn HTML, CSS, JavaScript, and construct responsive layouts under the guidance of our lead developers. High performers receive PPO.",
    category: "INTERNSHIPS"
  },
  {
    title: "React Intern",
    location: "Sankeshwar (On-site)",
    type: "Internship (3 Months)",
    experience: "Basics of HTML/JS",
    desc: "Work on real client components. Learn React hooks, styling systems, state architectures, and Tailwind CSS configuration.",
    category: "INTERNSHIPS"
  },
  {
    title: "Python Intern",
    location: "Sankeshwar (On-site)",
    type: "Internship (3-6 Months)",
    experience: "Knowledge of Python basics",
    desc: "Learn server automation, database scripting, and building web REST APIs using Django framework. Hands-on coding exercises.",
    category: "INTERNSHIPS"
  },
  {
    title: "Digital Marketing Intern",
    location: "Hybrid",
    type: "Internship (3 Months)",
    experience: "Strong written communication",
    desc: "Execute SEO strategies, run content campaigns, social media management, logo promotion campaigns, and learn online advertising tools.",
    category: "INTERNSHIPS"
  },
  {
    title: "Cyber Security Intern",
    location: "Sankeshwar (On-site)",
    type: "Internship (6 Months)",
    experience: "Understanding of OS / Networking",
    desc: "Work alongside our security specialists. Learn vulnerability assessments, network packet audits, and writing compliance reports.",
    category: "INTERNSHIPS"
  }
];

// Helper to seed careers if empty
const seedCareersIfEmpty = async () => {
  try {
    const count = await Career.countDocuments();
    if (count === 0) {
      console.log("Seeding default careers into database...");
      await Career.insertMany(DEFAULT_CAREERS);
      console.log("Default careers seeded successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding careers error:", error);
  }
};

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
export const getCareers = async (req, res) => {
  try {
    await seedCareersIfEmpty();
    const careers = await Career.find().sort({ createdAt: -1 });
    res.status(200).json({ careers });
  } catch (error) {
    console.error("Get Careers Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Create a career listing
// @route   POST /api/careers
// @access  Private (Admin only)
export const createCareer = async (req, res) => {
  try {
    const { title, location, type, experience, desc, category } = req.body;

    if (!title || !location || !type || !experience || !desc || !category) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    if (!["JOBS", "INTERNSHIPS"].includes(category)) {
      return res.status(400).json({ error: "Category must be JOBS or INTERNSHIPS" });
    }

    const career = await Career.create({
      title,
      location,
      type,
      experience,
      desc,
      category
    });

    res.status(201).json({
      message: "Career listing created successfully",
      career
    });
  } catch (error) {
    console.error("Create Career Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Update a career listing
// @route   PUT /api/careers/:id
// @access  Private (Admin only)
export const updateCareer = async (req, res) => {
  try {
    const { title, location, type, experience, desc, category } = req.body;
    const { id } = req.params;

    const career = await Career.findById(id);
    if (!career) {
      return res.status(404).json({ error: "Career listing not found" });
    }

    if (title !== undefined) career.title = title;
    if (location !== undefined) career.location = location;
    if (type !== undefined) career.type = type;
    if (experience !== undefined) career.experience = experience;
    if (desc !== undefined) career.desc = desc;
    if (category !== undefined) {
      if (!["JOBS", "INTERNSHIPS"].includes(category)) {
        return res.status(400).json({ error: "Category must be JOBS or INTERNSHIPS" });
      }
      career.category = category;
    }

    await career.save();

    res.status(200).json({
      message: "Career listing updated successfully",
      career
    });
  } catch (error) {
    console.error("Update Career Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a career listing
// @route   DELETE /api/careers/:id
// @access  Private (Admin only)
export const deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;

    const career = await Career.findByIdAndDelete(id);
    if (!career) {
      return res.status(404).json({ error: "Career listing not found" });
    }

    res.status(200).json({ message: "Career listing deleted successfully" });
  } catch (error) {
    console.error("Delete Career Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};
