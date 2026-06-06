import Service from "../model/Service.js";

const DEFAULT_SERVICES = [
  {
    number: "01",
    title: "Cloud Computing",
    description: "Scalable cloud infrastructure and services. Design, deployment, and management of AWS/Azure architectures.",
    icon: "Cloud"
  },
  {
    number: "02",
    title: "Cyber Security",
    description: "Protect your systems with advanced security measures, ethical hacking, regular vulnerability scans, and security audits.",
    icon: "ShieldAlert"
  },
  {
    number: "03",
    title: "Embedded Systems",
    description: "IoT and hardware integrated software solutions, firmware, RTOS, microcontroller coding, and smart device engineering.",
    icon: "Cpu"
  },
  {
    number: "04",
    title: "Native App Development",
    description: "High-performance native mobile applications for iOS & Android with buttery-smooth animations and off-line support.",
    icon: "Smartphone"
  },
  {
    number: "05",
    title: "Full Stack Development",
    description: "End-to-end application development solutions using MERN/LAMP stacks, designing scale-proof backends and snappy interfaces.",
    icon: "Layers"
  },
  {
    number: "06",
    title: "Web Development",
    description: "Modern, responsive websites and progressive web applications engineered with optimal performance and SEO practices.",
    icon: "Globe"
  }
];

// Helper to seed services if empty
const seedServicesIfEmpty = async () => {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      console.log("Seeding default services into database...");
      await Service.insertMany(DEFAULT_SERVICES);
      console.log("Default services seeded successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding services error:", error);
  }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
  try {
    await seedServicesIfEmpty();
    const services = await Service.find().sort({ number: 1 });
    res.status(200).json({ services });
  } catch (error) {
    console.error("Get Services Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private (Admin only)
export const createService = async (req, res) => {
  try {
    const { number, title, description, icon } = req.body;

    if (!number || !title || !description || !icon) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const service = await Service.create({
      number,
      title,
      description,
      icon,
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create Service Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Admin only)
export const updateService = async (req, res) => {
  try {
    const { number, title, description, icon } = req.body;
    const { id } = req.params;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    if (number) service.number = number;
    if (title) service.title = title;
    if (description) service.description = description;
    if (icon) service.icon = icon;

    await service.save();

    res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Admin only)
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};
