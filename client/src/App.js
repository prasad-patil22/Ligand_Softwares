import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Upload, CheckCircle2, AlertCircle } from 'lucide-react';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import BackgroundParticles from './components/BackgroundParticles';
import ScrollProgressBar from './components/ScrollProgressBar';
import Loader from './components/Loader';
import BackToTop from './components/BackToTop';
import Modal from './components/Modal';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import Courses from './pages/Courses';
import Career from './pages/Career';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminLayout from './components/admin/AdminLayout';
import Overview from './pages/admin/Overview';
import ManageServices from './pages/admin/ManageServices';
import ManageProjects from './pages/admin/ManageProjects';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ManageTeam from './pages/admin/ManageTeam';
import ManageGallery from './pages/admin/ManageGallery';
import ManageCourses from './pages/admin/ManageCourses';
import ManageCareers from './pages/admin/ManageCareers';
import ManageApplications from './pages/admin/ManageApplications';
import ManageMessages from './pages/admin/ManageMessages';
import ChangePassword from './pages/admin/ChangePassword';
import ConsoleSettings from './pages/admin/ConsoleSettings';
import axios from "axios";


// Scroll to Top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Page Transition wrapper
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.35, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const isAdminOrLogin = location.pathname.startsWith('/admin') || location.pathname === '/login';

  // Modal States
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isJoinTrainingOpen, setIsJoinTrainingOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // Form Pre-fills
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [coursesList, setCoursesList] = useState([]);

  // Submit Feedback States
  const [submitStatus, setSubmitStatus] = useState(null); // 'SUCCESS', 'ERROR'
  const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axios.get(
          `https://ligand-softwares-328p.onrender.com/api/health`
        );

        if (response.data === "ok") {
          console.log("Server is running");
        }
      } catch (error) {
        console.error("Server is not reachable", error);
      }
    };

    checkServer();
  }, []);
  useEffect(() => {
    const fetchCoursesList = async () => {
      try {
        const response = await fetch("https://ligand-softwares-328p.onrender.com/api/courses");
        const data = await response.json();
        if (response.ok && data.courses && data.courses.length > 0) {
          setCoursesList(data.courses);
        } else {
          setCoursesList([
            { name: "Full Stack Development" },
            { name: "Python Programming" },
            { name: "Java Development" },
            { name: "Data Structures & Algorithms" },
            { name: "Cyber Security" },
            { name: "Cloud Computing" },
            { name: "Embedded Systems" },
            { name: "Mobile App Development" }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch course list inside App.js:", err);
        setCoursesList([
          { name: "Full Stack Development" },
          { name: "Python Programming" },
          { name: "Java Development" },
          { name: "Data Structures & Algorithms" },
          { name: "Cyber Security" },
          { name: "Cloud Computing" },
          { name: "Embedded Systems" },
          { name: "Mobile App Development" }
        ]);
      }
    };
    fetchCoursesList();
  }, []);

  const handleOpenJoinTraining = (courseName = '') => {
    setSelectedCourse(courseName || (coursesList[0]?.name || 'Full Stack Development'));
    setIsJoinTrainingOpen(true);
  };

  const handleOpenApply = (jobTitle = '') => {
    setSelectedJob(jobTitle || 'React Developer');
    setSelectedFile(null);
    setIsApplyOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitStatus('SUCCESS');
    setTimeout(() => {
      setSubmitStatus(null);
      setIsEnquiryOpen(false);
      setIsJoinTrainingOpen(false);
      setIsApplyOpen(false);
    }, 2000);
  };

  const handleJoinTrainingSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('userName');
    const email = formData.get('userEmail');
    const phone = formData.get('userPhone');
    const course = selectedCourse;
    const message = formData.get('userMessage') || 'N/A';

    // Format WhatsApp Message
    const waText = `*New Training Registration*\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Phone:* ${phone}\n` +
      `*Course:* ${course}\n` +
      `*Message:* ${message}`;

    const encodedText = encodeURIComponent(waText);
    const waUrl = `https://wa.me/919110413455?text=${encodedText}`;

    // Open WhatsApp in a new tab
    window.open(waUrl, '_blank');

    // Show visual success response
    setSubmitStatus('SUCCESS');
    setTimeout(() => {
      setSubmitStatus(null);
      setIsJoinTrainingOpen(false);
    }, 2000);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('LOADING');
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const jobTitle = selectedJob;
    const coverLetter = formData.get('coverLetter');

    if (!selectedFile) {
      alert("Please upload your resume.");
      setSubmitStatus(null);
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64Resume = reader.result;

        const response = await fetch("https://ligand-softwares-328p.onrender.com/api/applications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            jobTitle,
            coverLetter,
            resumeFile: base64Resume
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to submit application");
        }

        setSubmitStatus('SUCCESS');
        setTimeout(() => {
          setSubmitStatus(null);
          setIsApplyOpen(false);
          setSelectedFile(null);
        }, 2000);
      };
    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong.");
      setSubmitStatus('ERROR');
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    }
  };

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden relative">
      
      {/* Global Aesthetics */}
      <CustomCursor />
      <ScrollProgressBar />
      <BackgroundParticles />
      <BackToTop />

      {/* Navigation */}
      {!isAdminOrLogin && (
        <Navbar 
          onEnquiryClick={() => setIsEnquiryOpen(true)} 
          onJoinTrainingClick={() => handleOpenJoinTraining()} 
        />
      )}

      {/* Page Routing */}
      <main className="flex-grow z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname.startsWith('/admin') ? '/admin' : location.pathname}>
            <Route 
              path="/" 
              element={
                <AnimatedPage>
                  <Home 
                    onEnquiryClick={() => setIsEnquiryOpen(true)} 
                    onJoinTrainingClick={handleOpenJoinTraining}
                    onApplyClick={handleOpenApply}
                  />
                </AnimatedPage>
              } 
            />
            <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
            <Route path="/team" element={<AnimatedPage><Team /></AnimatedPage>} />
            <Route path="/gallery" element={<AnimatedPage><Gallery /></AnimatedPage>} />
            <Route path="/courses" element={<AnimatedPage><Courses onEnrollClick={handleOpenJoinTraining} /></AnimatedPage>} />
            <Route path="/career" element={<AnimatedPage><Career onApplyClick={handleOpenApply} /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Overview />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="testimonials" element={<ManageTestimonials />} />
              <Route path="team" element={<ManageTeam />} />
              <Route path="gallery" element={<ManageGallery />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="careers" element={<ManageCareers />} />
              <Route path="applications" element={<ManageApplications />} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="password" element={<ChangePassword />} />
              <Route path="settings" element={<ConsoleSettings />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!isAdminOrLogin && <Footer />}

      {/* ==========================================
          MODALS
          ========================================== */}

      {/* 1. General Enquiry Modal */}
      <Modal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} title="Send Enquiry">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Your Name *</label>
            <input type="text" required placeholder="Enter your name" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Email Address *</label>
            <input type="email" required placeholder="Enter your email" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Phone Number</label>
            <input type="tel" placeholder="Enter contact number" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Message *</label>
            <textarea required rows="4" placeholder="How can Ligand help you?" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 transition-all">
            Send Enquiry
          </button>
          {submitStatus === 'SUCCESS' && (
            <div className="p-3 rounded-xl bg-primary-emerald/10 border border-primary-emerald/20 text-primary-emerald text-xs font-semibold flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>Enquiry Submitted Successfully!</span>
            </div>
          )}
        </form>
      </Modal>

      {/* 2. Join Training Modal */}
      <Modal isOpen={isJoinTrainingOpen} onClose={() => setIsJoinTrainingOpen(false)} title="Join Training Program">
        <form onSubmit={handleJoinTrainingSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Your Name *</label>
            <input type="text" required name="userName" placeholder="Enter your name" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Email *</label>
              <input type="email" required name="userEmail" placeholder="Email address" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Phone *</label>
              <input type="tel" required name="userPhone" placeholder="Phone number" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Select Course *</label>
            <select 
              value={selectedCourse} 
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-xl text-sm bg-dark-800"
            >
              {coursesList.map((course, idx) => (
                <option key={course._id || idx} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Message / Pre-requisite notes</label>
            <textarea name="userMessage" rows="3" placeholder="Briefly specify details (student/professional, prior experience etc.)" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 transition-all">
            Submit Application
          </button>
          {submitStatus === 'SUCCESS' && (
            <div className="p-3 rounded-xl bg-primary-emerald/10 border border-primary-emerald/20 text-primary-emerald text-xs font-semibold flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>Training Application Registered!</span>
            </div>
          )}
        </form>
      </Modal>

      {/* 3. Career Application Modal */}
      <Modal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} title={`Apply: ${selectedJob}`}>
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Your Name *</label>
            <input type="text" required name="name" placeholder="Enter full name" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Email *</label>
              <input type="email" required name="email" placeholder="Email address" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Phone *</label>
              <input type="tel" required name="phone" placeholder="Phone number" className="glass-input w-full px-4 py-2.5 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Job Title / Role</label>
            <input type="text" readOnly value={selectedJob} className="glass-input w-full px-4 py-2.5 rounded-xl text-sm opacity-65 bg-dark-800" />
          </div>
          
          {/* Resume Upload Simulator */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Upload Resume *</label>
            <div className="border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.03] transition-colors cursor-pointer relative">
              <input 
                type="file" 
                required 
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <Upload className="w-6 h-6 text-primary-cyan mb-2" />
              <span className="text-xs text-slate-300 font-medium">
                {selectedFile ? selectedFile.name : "Click to select Resume Image (PNG, JPG)"}
              </span>
              <span className="text-[10px] text-slate-500 mt-1">Max size 5MB</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Cover Letter / Note</label>
            <textarea name="coverLetter" rows="3" placeholder="Briefly introduce yourself and why you're a great fit..." className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none" />
          </div>
          <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 transition-all">
            Submit Application
          </button>
          {submitStatus === 'LOADING' && (
            <div className="p-3 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan text-xs font-semibold flex items-center gap-2 animate-pulse">
              <span className="w-4 h-4 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
              <span>Uploading Resume & Sending Confirmation...</span>
            </div>
          )}
          {submitStatus === 'SUCCESS' && (
            <div className="p-3 rounded-xl bg-primary-emerald/10 border border-primary-emerald/20 text-primary-emerald text-xs font-semibold flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>Application Submitted Successfully! Email Sent.</span>
            </div>
          )}
          {submitStatus === 'ERROR' && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5" />
              <span>Failed to submit. Please try again.</span>
            </div>
          )}
        </form>
      </Modal>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
