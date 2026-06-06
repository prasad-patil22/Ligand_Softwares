import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Upload, Trash2, Edit3, AlertCircle } from "lucide-react";

const GALLERY_API_URL = "https://ligand-softwares-328p.onrender.com/api/gallery";

export default function ManageGallery() {
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");

  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState(null); // null if adding
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryDesc, setGalleryDesc] = useState("");
  const [galleryDate, setGalleryDate] = useState("");
  const [galleryCoverImage, setGalleryCoverImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [isUploadingGalleryCover, setIsUploadingGalleryCover] = useState(false);
  const [isUploadingGalleryImages, setIsUploadingGalleryImages] = useState(false);

  const fetchGallery = async () => {
    setGalleryLoading(true);
    setGalleryError("");
    try {
      const response = await fetch(GALLERY_API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load gallery");
      setGallery(data.gallery || []);
    } catch (err) {
      setGalleryError(err.message);
    } finally {
      setGalleryLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleOpenAddGalleryForm = () => {
    setEditingGalleryId(null);
    setGalleryTitle("");
    setGalleryDesc("");
    setGalleryDate("");
    setGalleryCoverImage("");
    setGalleryImages([]);
    setShowGalleryForm(true);
  };

  const handleEditGalleryClick = (item) => {
    setEditingGalleryId(item._id);
    setGalleryTitle(item.title);
    setGalleryDesc(item.desc);
    setGalleryDate(item.date);
    setGalleryCoverImage(item.coverImage);
    setGalleryImages(item.images || []);
    setShowGalleryForm(true);
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Are you sure you want to delete this gallery album?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${GALLERY_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete gallery album");

      fetchGallery();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGalleryCoverImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setIsUploadingGalleryCover(true);
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${GALLERY_API_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ image: reader.result })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setGalleryCoverImage(data.url);
      } catch (err) {
        alert(err.message);
      } finally {
        setIsUploadingGalleryCover(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryImagesSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploadingGalleryImages(true);
    const uploadedUrls = [];
    const token = localStorage.getItem("adminToken");

    try {
      for (const file of files) {
        const url = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const res = await fetch(`${GALLERY_API_URL}/upload`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ image: reader.result })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Image upload failed");
              resolve(data.url);
            } catch (err) {
              reject(err);
            }
          };
          reader.readAsDataURL(file);
        });
        uploadedUrls.push(url);
      }
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploadingGalleryImages(false);
    }
  };

  const handleRemoveGalleryImage = (idxToRemove) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();

    if (!galleryTitle.trim() || !galleryDate.trim() || !galleryCoverImage.trim() || !galleryDesc.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingGalleryId 
        ? `${GALLERY_API_URL}/${editingGalleryId}`
        : GALLERY_API_URL;
      
      const method = editingGalleryId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: galleryTitle,
          desc: galleryDesc,
          date: galleryDate,
          coverImage: galleryCoverImage,
          images: galleryImages
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save gallery album");

      setGalleryTitle("");
      setGalleryDesc("");
      setGalleryDate("");
      setGalleryCoverImage("");
      setGalleryImages([]);
      setEditingGalleryId(null);
      setShowGalleryForm(false);

      fetchGallery();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      key="gallery"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-xl font-bold text-white uppercase tracking-wider">Dynamic Media Gallery</h2>
          <p className="text-slate-400 text-xs">Create, update, and manage photo albums that populate the Media Gallery page.</p>
        </div>
        {!showGalleryForm && (
          <button
            onClick={handleOpenAddGalleryForm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/20 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Album Category</span>
          </button>
        )}
      </div>

      {/* Gallery Form Card */}
      {showGalleryForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-panel rounded-2xl p-6 border border-white/5 bg-dark-800/90 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">
              {editingGalleryId ? "Edit Gallery Category Details" : "Create New Gallery Album Category"}
            </h3>
            <button
              onClick={() => setShowGalleryForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleSaveGalleryItem} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Album Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Company Events"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Date / Month Tag *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Dec 2025"
                  value={galleryDate}
                  onChange={(e) => setGalleryDate(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Image Upload Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cover image */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-slate-400 block uppercase">Upload Cover Photo *</label>
                <div className="border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.03] transition-all relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryCoverImageSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploadingGalleryCover}
                  />
                  <Upload className="w-6 h-6 text-primary-cyan mb-2" />
                  <span className="text-xs text-slate-300 font-medium">
                    {isUploadingGalleryCover ? "Uploading cover..." : "Click to select cover"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Image size max 5MB</span>
                </div>
                {galleryCoverImage && (
                  <div className="relative w-full h-28 rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                    <img src={galleryCoverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setGalleryCoverImage("")}
                      className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white hover:bg-black/85 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Multiple Album Images */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-slate-400 block uppercase">Add Album Images</label>
                <div className="border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.03] transition-all relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryImagesSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploadingGalleryImages}
                  />
                  <Upload className="w-6 h-6 text-primary-cyan mb-2" />
                  <span className="text-xs text-slate-300 font-medium">
                    {isUploadingGalleryImages ? "Uploading images..." : "Select multiple photo files"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Select and add to album gallery</span>
                </div>
              </div>
            </div>

            {/* Display Album Grid preview with delete button */}
            {galleryImages.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 block uppercase">Album Images Preview ({galleryImages.length})</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-48 overflow-y-auto p-2 bg-dark-900/60 border border-white/5 rounded-xl">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-slate-950 group">
                      <img src={img} alt="album item" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Album Description *</label>
              <textarea
                required
                rows="3"
                placeholder="Describe the milestone or activity..."
                value={galleryDesc}
                onChange={(e) => setGalleryDesc(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowGalleryForm(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploadingGalleryCover || isUploadingGalleryImages}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {editingGalleryId ? "Save Changes" : "Create Album"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Gallery List */}
      {galleryLoading ? (
        <div className="py-12 flex justify-center items-center">
          <span className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : galleryError ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{galleryError}</span>
        </div>
      ) : gallery.length === 0 ? (
        <div className="p-8 text-center glass-panel rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm">No gallery albums found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {gallery.map((item) => (
            <div
              key={item._id}
              className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-800/40 relative overflow-hidden group hover:border-primary-cyan/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Cover Image Preview */}
                <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white mb-0.5 tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-mono text-primary-cyan mb-2 flex items-center gap-2">
                    <span>Date: {item.date}</span>
                    <span className="text-slate-400">•</span>
                    <span>{item.images?.length || 0} Images</span>
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed truncate-2-lines max-w-xl">{item.desc}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0 shrink-0">
                <button
                  onClick={() => handleEditGalleryClick(item)}
                  className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-primary-cyan hover:text-white transition-colors cursor-pointer"
                  title="Edit Album"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteGallery(item._id)}
                  className="p-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                  title="Delete Album"
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
