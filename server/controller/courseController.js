import Course from "../model/Course.js";
import cloudinary from "../cloudinary.js";

const DEFAULT_COURSES = [
  {
    name: "Full Stack Development",
    duration: "6 Months",
    level: "Beginner to Advanced",
    language: "HTML, CSS, JavaScript, React, Node.js, MongoDB",
    syllabus: [
      "Web Architecture & Git Foundations",
      "Semantic HTML & Tailwind CSS layouts",
      "ES6 Javascript Fundamentals & DOM",
      "React.js hooks, routing, and context API",
      "Node.js & Express RESTful API Engineering",
      "MongoDB database structure and aggregation pipelines",
      "Testing, CI/CD, and Cloud deployment on AWS"
    ],
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    popular: true,
    certBadge: "NSDC Approved"
  },
  {
    name: "Python Programming",
    duration: "3 Months",
    level: "Beginner",
    language: "Python 3.x, Django, MySQL",
    syllabus: [
      "Python Basics, Data structures & functions",
      "Object-Oriented Programming (OOP) in Python",
      "File I/O and Standard Libraries",
      "Database operations with MySQL and SQLite",
      "Django Web Framework basics & REST Framework",
      "Web Scraping and automation with Selenium"
    ],
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    popular: false,
    certBadge: "Ligand certified"
  },
  {
    name: "Java Development",
    duration: "4 Months",
    level: "Intermediate",
    language: "Java Core, Spring Boot, Hibernate, SQL",
    syllabus: [
      "Java Virtual Machine (JVM) internals",
      "Advanced Java Collections and Concurrency",
      "Relational Databases and Hibernate ORM",
      "Spring Boot core principles & Spring Security",
      "Building Microservices and RESTful backends",
      "Dockerization and unit testing with JUnit"
    ],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
    popular: true,
    certBadge: "Corporate Incubation"
  },
  {
    name: "Data Structures & Algorithms",
    duration: "4 Months",
    level: "Intermediate",
    language: "C++ or Java",
    syllabus: [
      "Time and Space Complexity (Big O notation)",
      "Arrays, Linked Lists, Stacks & Queues",
      "Trees (Binary, BST, AVL) & Graphs (BFS, DFS)",
      "Sorting, Searching and Hashing techniques",
      "Greedy Algorithms and Divide & Conquer",
      "Dynamic Programming and Graph Algorithms"
    ],
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=600",
    popular: false,
    certBadge: "Competitive Programming"
  }
];

// Helper to seed courses if empty
const seedCoursesIfEmpty = async () => {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      console.log("Seeding default courses into database...");
      await Course.insertMany(DEFAULT_COURSES);
      console.log("Default courses seeded successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding courses error:", error);
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    await seedCoursesIfEmpty();
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Get Courses Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private (Admin only)
export const createCourse = async (req, res) => {
  try {
    const { name, duration, level, language, syllabus, image, popular, certBadge } = req.body;

    if (!name || !duration || !level || !language || !syllabus || !image || !certBadge) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const course = await Course.create({
      name,
      duration,
      level,
      language,
      syllabus: Array.isArray(syllabus) ? syllabus : [],
      image,
      popular: !!popular,
      certBadge
    });

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin only)
export const updateCourse = async (req, res) => {
  try {
    const { name, duration, level, language, syllabus, image, popular, certBadge } = req.body;
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (name !== undefined) course.name = name;
    if (duration !== undefined) course.duration = duration;
    if (level !== undefined) course.level = level;
    if (language !== undefined) course.language = language;
    if (syllabus !== undefined) course.syllabus = Array.isArray(syllabus) ? syllabus : [];
    if (image !== undefined) course.image = image;
    if (popular !== undefined) course.popular = !!popular;
    if (certBadge !== undefined) course.certBadge = certBadge;

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course
    });
  } catch (error) {
    console.error("Update Course Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete Course Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Upload course image to Cloudinary
// @route   POST /api/courses/upload
// @access  Private (Admin only)
export const uploadCourseImage = async (req, res) => {
  try {
    const { image } = req.body; // Base64 data string
    if (!image) {
      return res.status(400).json({ error: "No image data provided" });
    }

    console.log("Uploading course image to Cloudinary...");
    const uploadRes = await cloudinary.v2.uploader.upload(image, {
      folder: "courses"
    });

    res.status(200).json({
      message: "Course image uploaded successfully",
      url: uploadRes.secure_url
    });
  } catch (error) {
    console.error("Cloudinary Course Upload Error:", error);
    res.status(500).json({ error: error.message || "Upload Failed" });
  }
};
