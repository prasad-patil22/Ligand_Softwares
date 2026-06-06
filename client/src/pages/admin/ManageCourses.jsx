import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Upload, X, Edit3, Trash2, AlertCircle, BookOpen } from "lucide-react";

const COURSES_API_URL = "http://localhost:8000/api/courses";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null); // null if adding
  const [courseName, setCourseName] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseLevel, setCourseLevel] = useState("Beginner");
  const [courseLanguage, setCourseLanguage] = useState("");
  const [courseSyllabus, setCourseSyllabus] = useState([]);
  const [courseImage, setCourseImage] = useState("");
  const [coursePopular, setCoursePopular] = useState(false);
  const [courseCertBadge, setCourseCertBadge] = useState("NSDC Approved");
  const [newSyllabusItem, setNewSyllabusItem] = useState("");
  const [isUploadingCourseImage, setIsUploadingCourseImage] = useState(false);

  const fetchCourses = async () => {
    setCoursesLoading(true);
    setCoursesError("");
    try {
      const response = await fetch(COURSES_API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load courses");
      setCourses(data.courses || []);
    } catch (err) {
      setCoursesError(err.message);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCourseImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("adminToken");
    setIsUploadingCourseImage(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const res = await fetch(`${COURSES_API_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ image: reader.result })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setCourseImage(data.url);
      } catch (err) {
        alert(err.message);
      } finally {
        setIsUploadingCourseImage(false);
      }
    };
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    if (!courseName || !courseDuration || !courseLevel || !courseLanguage || !courseImage || !courseCertBadge) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }

    try {
      const url = editingCourseId
        ? `${COURSES_API_URL}/${editingCourseId}`
        : COURSES_API_URL;
      
      const method = editingCourseId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: courseName,
          duration: courseDuration,
          level: courseLevel,
          language: courseLanguage,
          syllabus: courseSyllabus,
          image: courseImage,
          popular: coursePopular,
          certBadge: courseCertBadge
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save course");

      setCourseName("");
      setCourseDuration("");
      setCourseLevel("Beginner");
      setCourseLanguage("");
      setCourseSyllabus([]);
      setCourseImage("");
      setCoursePopular(false);
      setCourseCertBadge("NSDC Approved");
      setEditingCourseId(null);
      setShowCourseForm(false);
      
      fetchCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCourseDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`${COURSES_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete course");

      fetchCourses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditCourse = (course) => {
    setCourseName(course.name);
    setCourseDuration(course.duration);
    setCourseLevel(course.level);
    setCourseLanguage(course.language);
    setCourseSyllabus(course.syllabus || []);
    setCourseImage(course.image);
    setCoursePopular(course.popular);
    setCourseCertBadge(course.certBadge);
    setEditingCourseId(course._id);
    setShowCourseForm(true);
  };

  const handleOpenAddCourseForm = () => {
    setEditingCourseId(null);
    setCourseName("");
    setCourseDuration("");
    setCourseLevel("Beginner");
    setCourseLanguage("");
    setCourseSyllabus([]);
    setCourseImage("");
    setCoursePopular(false);
    setCourseCertBadge("NSDC Approved");
    setNewSyllabusItem("");
    setShowCourseForm(true);
  };

  const addSyllabusItem = () => {
    if (!newSyllabusItem.trim()) return;
    setCourseSyllabus([...courseSyllabus, newSyllabusItem.trim()]);
    setNewSyllabusItem("");
  };

  const removeSyllabusItem = (index) => {
    setCourseSyllabus(courseSyllabus.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      key="courses"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Tab Header / Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-2xl font-bold text-white uppercase tracking-wider">Manage Courses</h2>
          <p className="text-slate-400 text-xs">
            Create, update, and manage your training modules, levels, syllabus and Cloudinary banner images.
          </p>
        </div>
        {!showCourseForm && (
          <button
            onClick={handleOpenAddCourseForm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold text-xs uppercase tracking-wider hover:shadow-glow-cyan/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Course</span>
          </button>
        )}
      </div>

      {/* Course Edit/Create Form */}
      {showCourseForm ? (
        <form onSubmit={handleCourseSubmit} className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 bg-dark-800/80 space-y-6">
          <h3 className="font-outfit text-lg font-bold text-white tracking-wide">
            {editingCourseId ? "Edit Course Detail" : "Register New Training Program"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g. Full Stack Development"
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Duration *</label>
                  <input
                    type="text"
                    required
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    placeholder="e.g. 6 Months"
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Level *</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm bg-dark-850"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Beginner to Advanced">Beginner to Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Technologies / Stack *</label>
                <input
                  type="text"
                  required
                  value={courseLanguage}
                  onChange={(e) => setCourseLanguage(e.target.value)}
                  placeholder="e.g. HTML, CSS, JavaScript, React, Node.js"
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Certification Badge *</label>
                  <input
                    type="text"
                    required
                    value={courseCertBadge}
                    onChange={(e) => setCourseCertBadge(e.target.value)}
                    placeholder="e.g. NSDC Approved"
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center gap-3 cursor-pointer text-slate-300 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={coursePopular}
                      onChange={(e) => setCoursePopular(e.target.checked)}
                      className="w-5 h-5 rounded border-white/10 bg-dark-850 accent-primary-cyan cursor-pointer"
                    />
                    <span className="text-xs font-mono uppercase tracking-wider">Highlight as Popular</span>
                  </label>
                </div>
              </div>

              {/* Banner Image Uploader */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-2 uppercase">Course Banner Image *</label>
                <div className="flex items-center gap-6">
                  <div className="flex-grow border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCourseImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-primary-cyan mb-2" />
                    <span className="text-xs text-slate-300 font-medium">
                      {isUploadingCourseImage ? "Uploading to Cloudinary..." : "Select Local Image"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">Recommended: 16:9 ratio</span>
                  </div>
                  
                  {courseImage && (
                    <div className="w-24 h-24 rounded-xl border border-white/10 overflow-hidden shrink-0 bg-dark-850 flex items-center justify-center">
                      <img src={courseImage} alt="banner-preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Course Syllabus Editor (Right side on md screens) */}
            <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-6">
              <label className="text-xs font-mono text-slate-400 block uppercase">Course Syllabus & Modules *</label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSyllabusItem}
                  onChange={(e) => setNewSyllabusItem(e.target.value)}
                  placeholder="e.g. Web Architecture & Git Foundations"
                  className="glass-input flex-grow px-4 py-2 rounded-xl text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSyllabusItem();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addSyllabusItem}
                  className="px-4 py-2 rounded-xl bg-primary-cyan/20 border border-primary-cyan/40 text-primary-cyan font-bold text-xs uppercase hover:bg-primary-cyan hover:text-dark-900 transition-all cursor-pointer"
                >
                  Add
                </button>
              </div>

              {/* Modules list preview */}
              <div className="border border-white/5 rounded-xl bg-white/[0.01] p-3 max-h-[280px] overflow-y-auto space-y-2 scrollbar-thin">
                {courseSyllabus.length > 0 ? (
                  courseSyllabus.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-2 rounded-lg gap-3">
                      <span className="text-xs text-slate-300 font-outfit truncate flex items-center gap-1.5">
                        <span className="text-primary-cyan font-bold">0{idx + 1}.</span>
                        {item}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSyllabusItem(idx)}
                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-white/5"
                        title="Remove Module"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-6">No syllabus modules added yet. Add at least one module above.</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowCourseForm(false)}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold text-xs uppercase tracking-wider hover:shadow-glow-cyan/20 transition-all cursor-pointer"
            >
              {editingCourseId ? "Save Changes" : "Register Course"}
            </button>
          </div>
        </form>
      ) : (
        /* Course Overview Cards List */
        <div className="space-y-4">
          {coursesLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mb-4" />
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Loading courses...</span>
            </div>
          ) : coursesError ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5" />
              <span>Error loading courses: {coursesError}</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-white/5">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">No Courses Active</h4>
              <p className="text-xs text-slate-400">Click the 'Add Course' button to create your first training program.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((item) => (
                <div
                  key={item._id}
                  className="glass-panel rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Course Banner Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-dark-850 border border-white/10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-sm font-bold text-white tracking-wide truncate">
                          {item.name}
                        </h4>
                        {item.popular && (
                          <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-primary-violet/20 to-primary-cyan/20 border border-primary-cyan/35 text-[8px] font-mono font-bold text-primary-cyan uppercase">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-primary-cyan mb-1 flex items-center gap-1.5 flex-wrap">
                        <span>{item.duration}</span>
                        <span className="text-slate-400">•</span>
                        <span>Level: {item.level}</span>
                        <span className="text-slate-400">•</span>
                        <span>Badge: {item.certBadge}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-md">
                        <strong>Stack:</strong> {item.language}
                      </p>
                      <p className="text-[9px] text-slate-500 mt-1">
                        {item.syllabus?.length || 0} Modules inside syllabus
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0 shrink-0">
                    <button
                      onClick={() => handleEditCourse(item)}
                      className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-primary-cyan hover:text-white transition-colors cursor-pointer"
                      title="Edit Course"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCourseDelete(item._id)}
                      className="p-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
