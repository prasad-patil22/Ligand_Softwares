import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { galleryData } from '../data/mockData';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const scrollToGalleryTop = () => {
    const element = document.getElementById('gallery-section');
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'instant'
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/gallery");
        const data = await response.json();
        if (response.ok && data.gallery && data.gallery.length > 0) {
          setGallery(data.gallery);
        } else {
          setGallery(galleryData);
        }
      } catch (err) {
        console.error("Failed to load gallery, using mock fallback data:", err);
        setGallery(galleryData);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Filter Categories on main page (either ALL or specific subsets)
  const filteredCategories = activeFilter === 'ALL'
    ? gallery
    : gallery.filter(cat => cat.title.toUpperCase().includes(activeFilter));

  const filterTabs = ['ALL', 'EVENTS', 'TRAINING', 'WORKSHOPS', 'PROJECTS', 'HACKATHONS', 'ACTIVITIES'];

  const openLightbox = (idx) => {
    setActiveImageIndex(idx);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
  };

  const showPrevImage = (e) => {
    e.stopPropagation();
    if (selectedCategory) {
      setActiveImageIndex((prev) => 
        prev === 0 ? selectedCategory.images.length - 1 : prev - 1
      );
    }
  };

  const showNextImage = (e) => {
    e.stopPropagation();
    if (selectedCategory) {
      setActiveImageIndex((prev) => 
        prev === selectedCategory.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center font-inter">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">Loading Media Gallery...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="gallery-section" className="relative min-h-screen pt-32 pb-24">
      {/* Background glow spots */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] bg-primary-violet/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[450px] h-[450px] bg-primary-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            
            // ==========================================
            // CATEGORIES OVERVIEW VIEW
            // ==========================================
            <motion.div
              key="categories-overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block">
                  Media Center
                </span>
                <h1 className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-6">
                  Ligand Media Gallery
                </h1>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  Browse photos and milestones of our corporate teams, hands-on workshops, hackathons, and placement training camps.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-2 rounded-full font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      activeFilter === tab
                        ? 'bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 shadow-glow-violet/20'
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Category Cards Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                layout
              >
                {filteredCategories.map((category) => (
                  <motion.div
                    key={category._id || category.id}
                    layout
                    className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-white/5 relative group flex flex-col justify-between"
                  >
                    <div>
                       {/* Cover Image */}
                      <div className="relative h-52 overflow-hidden bg-dark-800">
                        <img
                          src={category.coverImage}
                          alt={category.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600";
                          }}
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary-cyan/20 border border-primary-cyan/50 text-primary-cyan flex items-center justify-center shadow-glow-cyan/25">
                            <Eye className="w-5 h-5" />
                          </div>
                        </div>
                        {/* Date badge */}
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900/80 backdrop-blur-md text-[10px] font-mono font-medium text-primary-cyan border border-white/5">
                          <Calendar className="w-3 h-3" />
                          {category.date}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-6">
                        <h3 className="font-outfit font-bold text-xl text-white mb-2 tracking-wide group-hover:text-primary-cyan transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-3">
                          {category.desc}
                        </p>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="px-6 pb-6 pt-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          scrollToGalleryTop();
                        }}
                        className="w-full py-2.5 rounded-xl border border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.03] hover:border-primary-cyan/40 transition-all cursor-pointer text-center block"
                      >
                        View Gallery ({category.images.length} Images)
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            
            // ==========================================
            // DETAILED CATEGORY GRID VIEW
            // ==========================================
            <motion.div
              key="category-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Back Button */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  scrollToGalleryTop();
                }}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-8 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 cursor-pointer relative z-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-outfit font-medium text-sm">Back to Categories</span>
              </button>

              {/* Detail Header */}
              <div className="mb-12 border-b border-white/5 pb-8">
                <span className="font-mono text-xs font-bold text-primary-cyan uppercase tracking-wider block mb-2">
                  Category Archive • {selectedCategory.date}
                </span>
                <h1 className="font-outfit text-3xl md:text-4xl font-extrabold text-white mb-4">
                  {selectedCategory.title}
                </h1>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-3xl">
                  {selectedCategory.desc}
                </p>
              </div>

              {/* Masonry image grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedCategory.images.map((imgUrl, idx) => (
                  <motion.div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden glass-panel border border-white/5 h-64 md:h-72 cursor-pointer group"
                    onClick={() => openLightbox(idx)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={imgUrl}
                      alt={`${selectedCategory.title} - ${idx}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600";
                      }}
                    />
                    
                    {/* Hover graphic */}
                    <div className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 rounded-full bg-primary-violet/20 border border-primary-violet/50 text-white shadow-glow-violet/30">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==========================================
          LIGHTBOX VIEWER OVERLAY
          ========================================== */}
      <AnimatePresence>
        {activeImageIndex !== null && selectedCategory && createPortal(
          <div className="fixed inset-0 z-[99999] bg-dark-900/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8">
            
            {/* Lightbox Header */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto border-b border-white/5 pb-4">
              <div className="flex flex-col">
                <span className="text-white font-outfit font-bold text-lg leading-none">
                  {selectedCategory.title}
                </span>
                <span className="text-slate-400 text-xs mt-1">
                  Image {activeImageIndex + 1} of {selectedCategory.images.length}
                </span>
              </div>
              
              {/* Close */}
              <button
                onClick={closeLightbox}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Image Stage */}
            <div className="relative flex-grow flex items-center justify-center max-w-6xl mx-auto w-full my-4">
              {/* Prev Button */}
              <button
                onClick={showPrevImage}
                className="absolute left-2 md:left-4 z-10 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary-cyan/20 hover:border-primary-cyan transition-all cursor-pointer"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Active Image */}
              <motion.img
                key={activeImageIndex}
                src={selectedCategory.images[activeImageIndex]}
                alt="Active gallery preview"
                className="max-w-full max-h-[70vh] object-contain rounded-xl border border-white/10 shadow-glass-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600";
                }}
              />

              {/* Next Button */}
              <button
                onClick={showNextImage}
                className="absolute right-2 md:right-4 z-10 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-primary-cyan/20 hover:border-primary-cyan transition-all cursor-pointer"
                aria-label="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Footer (Thumbnails index) */}
            <div className="w-full max-w-4xl mx-auto overflow-x-auto py-2 scrollbar-none flex justify-center gap-2">
              {selectedCategory.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    idx === activeImageIndex 
                      ? 'border-primary-cyan scale-105 shadow-glow-cyan/20' 
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt="thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                </button>
              ))}
            </div>

          </div>,
          document.body
        )}
      </AnimatePresence>

    </div>
  );
}
