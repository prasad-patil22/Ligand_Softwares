import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Upload, Edit3, Trash2, AlertCircle } from "lucide-react";

const TESTIMONIALS_API_URL = "http://localhost:8000/api/testimonials";

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState("");

  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null); // null if adding
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialRole, setTestimonialRole] = useState("");
  const [testimonialDesc, setTestimonialDesc] = useState("");
  const [testimonialImage, setTestimonialImage] = useState("");
  const [isUploadingTestimonial, setIsUploadingTestimonial] = useState(false);
  const [testimonialRating, setTestimonialRating] = useState(5);

  const fetchTestimonials = async () => {
    setTestimonialsLoading(true);
    setTestimonialsError("");
    try {
      const response = await fetch(TESTIMONIALS_API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load testimonials");
      setTestimonials(data.testimonials || []);
    } catch (err) {
      setTestimonialsError(err.message);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAddTestimonialForm = () => {
    setEditingTestimonialId(null);
    setTestimonialName("");
    setTestimonialRole("");
    setTestimonialDesc("");
    setTestimonialImage("");
    setTestimonialRating(5);
    setShowTestimonialForm(true);
  };

  const handleEditTestimonialClick = (testimonial) => {
    setEditingTestimonialId(testimonial._id);
    setTestimonialName(testimonial.name);
    setTestimonialRole(testimonial.role);
    setTestimonialDesc(testimonial.desc);
    setTestimonialImage(testimonial.image);
    setTestimonialRating(testimonial.rating || 5);
    setShowTestimonialForm(true);
  };

  const handleDeleteTestimonial = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${TESTIMONIALS_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete testimonial");

      fetchTestimonials();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTestimonialImageFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setIsUploadingTestimonial(true);
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${TESTIMONIALS_API_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ image: reader.result })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setTestimonialImage(data.url);
      } catch (err) {
        alert(err.message);
      } finally {
        setIsUploadingTestimonial(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();

    if (!testimonialName.trim() || !testimonialRole.trim() || !testimonialDesc.trim() || !testimonialImage.trim()) {
      alert("Please fill in all fields (upload an avatar or input an image URL).");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingTestimonialId 
        ? `${TESTIMONIALS_API_URL}/${editingTestimonialId}`
        : TESTIMONIALS_API_URL;
      
      const method = editingTestimonialId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: testimonialName,
          role: testimonialRole,
          desc: testimonialDesc,
          image: testimonialImage,
          rating: Number(testimonialRating)
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save testimonial");

      setTestimonialName("");
      setTestimonialRole("");
      setTestimonialDesc("");
      setTestimonialImage("");
      setTestimonialRating(5);
      setEditingTestimonialId(null);
      setShowTestimonialForm(false);

      fetchTestimonials();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      key="testimonials"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-xl font-bold text-white uppercase tracking-wider">Dynamic Client Testimonials</h2>
          <p className="text-slate-400 text-xs">Create, update, and manage testimonials that are displayed in the "What Our Clients Say" section on the About Us page.</p>
        </div>
        {!showTestimonialForm && (
          <button
            onClick={handleOpenAddTestimonialForm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/20 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        )}
      </div>

      {/* Testimonial Form card */}
      {showTestimonialForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-panel rounded-2xl p-6 border border-white/5 bg-dark-800/90 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">
              {editingTestimonialId ? "Edit Client Testimonial" : "Create New Client Testimonial"}
            </h3>
            <button
              onClick={() => setShowTestimonialForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleSaveTestimonial} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Client Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Pooja Kamble"
                  value={testimonialName}
                  onChange={(e) => setTestimonialName(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Client Role / Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Alumna (Software Engineer, Infosys)"
                  value={testimonialRole}
                  onChange={(e) => setTestimonialRole(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Rating Score *</label>
                <select
                  required
                  value={testimonialRating}
                  onChange={(e) => setTestimonialRating(Number(e.target.value))}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm bg-dark-800"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                  <option value="3">⭐⭐⭐ (3 Stars)</option>
                  <option value="2">⭐⭐ (2 Stars)</option>
                  <option value="1">⭐ (1 Star)</option>
                </select>
              </div>
            </div>

            {/* Image Upload Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Upload Client Photo (Avatar) *</label>
                <div className="border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.03] transition-all relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTestimonialImageFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploadingTestimonial}
                  />
                  <Upload className="w-6 h-6 text-primary-cyan mb-2" />
                  <span className="text-xs text-slate-300 font-medium">
                    {isUploadingTestimonial ? "Uploading avatar..." : "Click to select avatar image"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Image size max 5MB</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Or Paste Direct Image URL</label>
                <input
                  type="text"
                  placeholder="e.g., https://images.unsplash.com/..."
                  value={testimonialImage}
                  onChange={(e) => setTestimonialImage(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm mb-2"
                />
                {testimonialImage && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center">
                    <img src={testimonialImage} alt="Avatar Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setTestimonialImage("")}
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer rounded-full"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Testimonial Quote / Feedback *</label>
              <textarea
                required
                rows="4"
                placeholder="What did the client say about Ligand Software Solutions..."
                value={testimonialDesc}
                onChange={(e) => setTestimonialDesc(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowTestimonialForm(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploadingTestimonial}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {editingTestimonialId ? "Save Changes" : "Register Testimonial"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Testimonials Table List */}
      {testimonialsLoading ? (
        <div className="py-12 flex justify-center items-center">
          <span className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : testimonialsError ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{testimonialsError}</span>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-8 text-center glass-panel rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm">No testimonials found in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-800/40 relative overflow-hidden group hover:border-primary-cyan/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Avatar Preview */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                  <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white mb-0.5 tracking-wide">
                    {testimonial.name}
                  </h4>
                  <p className="text-[10px] font-mono text-primary-cyan mb-2 flex items-center gap-2">
                    <span>{testimonial.role}</span>
                    <span className="text-amber-400 font-sans tracking-tight">
                      {"★".repeat(testimonial.rating || 5)}{"☆".repeat(5 - (testimonial.rating || 5))}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed truncate-2-lines max-w-xl">"{testimonial.desc}"</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0 shrink-0">
                <button
                  onClick={() => handleEditTestimonialClick(testimonial)}
                  className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-primary-cyan hover:text-white transition-colors cursor-pointer"
                  title="Edit Testimonial"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTestimonial(testimonial._id)}
                  className="p-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                  title="Delete Testimonial"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
