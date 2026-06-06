import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Briefcase, Edit3, Trash2, AlertCircle } from "lucide-react";

const CAREERS_API_URL = "https://ligand-softwares-328p.onrender.com/api/careers";

export default function ManageCareers() {
  const [careers, setCareers] = useState([]);
  const [careersLoading, setCareersLoading] = useState(true);
  const [careersError, setCareersError] = useState("");
  const [showCareerForm, setShowCareerForm] = useState(false);
  const [editingCareerId, setEditingCareerId] = useState(null);
  const [careerTitle, setCareerTitle] = useState("");
  const [careerLocation, setCareerLocation] = useState("");
  const [careerType, setCareerType] = useState("");
  const [careerExperience, setCareerExperience] = useState("");
  const [careerDesc, setCareerDesc] = useState("");
  const [careerCategory, setCareerCategory] = useState("JOBS");

  const fetchCareers = async () => {
    setCareersLoading(true);
    setCareersError("");
    try {
      const response = await fetch(CAREERS_API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load careers");
      setCareers(data.careers || []);
    } catch (err) {
      setCareersError(err.message);
    } finally {
      setCareersLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    if (!careerTitle || !careerLocation || !careerType || !careerExperience || !careerDesc || !careerCategory) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const url = editingCareerId
        ? `${CAREERS_API_URL}/${editingCareerId}`
        : CAREERS_API_URL;
      
      const method = editingCareerId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: careerTitle,
          location: careerLocation,
          type: careerType,
          experience: careerExperience,
          desc: careerDesc,
          category: careerCategory
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save career listing");

      setCareerTitle("");
      setCareerLocation("");
      setCareerType("");
      setCareerExperience("");
      setCareerDesc("");
      setCareerCategory("JOBS");
      setEditingCareerId(null);
      setShowCareerForm(false);
      
      fetchCareers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCareerDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this career listing?")) return;
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await fetch(`${CAREERS_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete career listing");

      fetchCareers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditCareer = (career) => {
    setCareerTitle(career.title);
    setCareerLocation(career.location);
    setCareerType(career.type);
    setCareerExperience(career.experience);
    setCareerDesc(career.desc);
    setCareerCategory(career.category);
    setEditingCareerId(career._id);
    setShowCareerForm(true);
  };

  const handleOpenAddCareerForm = () => {
    setEditingCareerId(null);
    setCareerTitle("");
    setCareerLocation("");
    setCareerType("");
    setCareerExperience("");
    setCareerDesc("");
    setCareerCategory("JOBS");
    setShowCareerForm(true);
  };

  return (
    <motion.div
      key="careers"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Tab Header / Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-2xl font-bold text-white uppercase tracking-wider">Manage Careers</h2>
          <p className="text-slate-400 text-xs">
            Create, update, and manage your job listings and student internship programs.
          </p>
        </div>
        {!showCareerForm && (
          <button
            onClick={handleOpenAddCareerForm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold text-xs uppercase tracking-wider hover:shadow-glow-cyan/20 hover:scale-[1.02] transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add Listing</span>
          </button>
        )}
      </div>

      {/* Career Edit/Create Form */}
      {showCareerForm ? (
        <form onSubmit={handleCareerSubmit} className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 bg-dark-800/80 space-y-6">
          <h3 className="font-outfit text-lg font-bold text-white tracking-wide">
            {editingCareerId ? "Edit Career Detail" : "Post New Position / Program"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Title / Role *</label>
                <input
                  type="text"
                  required
                  value={careerTitle}
                  onChange={(e) => setCareerTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Category *</label>
                  <select
                    value={careerCategory}
                    onChange={(e) => setCareerCategory(e.target.value)}
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm bg-dark-850"
                  >
                    <option value="JOBS">Job Position</option>
                    <option value="INTERNSHIPS">Student Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Location *</label>
                  <input
                    type="text"
                    required
                    value={careerLocation}
                    onChange={(e) => setCareerLocation(e.target.value)}
                    placeholder="e.g. Sankeshwar (On-site)"
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Job Type *</label>
                  <input
                    type="text"
                    required
                    value={careerType}
                    onChange={(e) => setCareerType(e.target.value)}
                    placeholder="e.g. Full-Time or Internship (3 Months)"
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Experience / Eligibility *</label>
                  <input
                    type="text"
                    required
                    value={careerExperience}
                    onChange={(e) => setCareerExperience(e.target.value)}
                    placeholder="e.g. 2-5 Years or Basics of HTML/JS"
                    className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Job Description / Requirements *</label>
              <textarea
                required
                rows="6"
                value={careerDesc}
                onChange={(e) => setCareerDesc(e.target.value)}
                placeholder="Provide listing details, responsibilities, and qualifications..."
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowCareerForm(false)}
              className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold text-xs uppercase tracking-wider hover:shadow-glow-cyan/20 transition-all cursor-pointer"
            >
              {editingCareerId ? "Save Changes" : "Post Listing"}
            </button>
          </div>
        </form>
      ) : (
        /* Careers Overview Cards List */
        <div className="space-y-4">
          {careersLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mb-4" />
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Loading listings...</span>
            </div>
          ) : careersError ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4.5 h-4.5" />
              <span>Error loading listings: {careersError}</span>
            </div>
          ) : careers.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-3xl border border-white/5">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">No Active Listings</h4>
              <p className="text-xs text-slate-400">Click the 'Add Listing' button to post your first position.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {careers.map((item) => (
                <div
                  key={item._id}
                  className="glass-panel rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h4 className="text-sm font-bold text-white tracking-wide truncate">
                        {item.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold border uppercase ${
                        item.category === "JOBS"
                          ? "bg-primary-violet/10 border-primary-violet/30 text-primary-violet"
                          : "bg-primary-emerald/10 border-primary-emerald/30 text-primary-emerald"
                      }`}>
                        {item.category === "JOBS" ? "JOB" : "INTERNSHIP"}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-primary-cyan mb-1 flex items-center gap-1.5 flex-wrap">
                      <span>{item.type}</span>
                      <span className="text-slate-400">•</span>
                      <span>{item.location}</span>
                      <span className="text-slate-400">•</span>
                      <span>Experience/Eligibility: {item.experience}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-2 max-w-3xl leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0 shrink-0">
                    <button
                      onClick={() => handleEditCareer(item)}
                      className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-primary-cyan hover:text-white transition-colors cursor-pointer"
                      title="Edit Listing"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCareerDelete(item._id)}
                      className="p-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                      title="Delete Listing"
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
