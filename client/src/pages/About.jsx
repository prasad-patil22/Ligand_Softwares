import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Award, CheckCircle2, ExternalLink } from 'lucide-react';
import { companyCapabilities, companyDetails, timelineData, companyProjects, testimonialsData } from '../data/mockData';
import Modal from '../components/Modal';

export default function About() {
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);

  // Fetch dynamic projects
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://ligand-softwares-328p.onrender.com/api/projects");
        const data = await response.json();
        if (response.ok && data.projects && data.projects.length > 0) {
          setProjects(data.projects);
        } else {
          setProjects(companyProjects);
        }
      } catch (err) {
        console.error("Failed to load projects, using mock fallback data:", err);
        setProjects(companyProjects);
      }
    };
    fetchProjects();
  }, []);

  // Fetch dynamic testimonials
  const [testimonials, setTestimonials] = useState(testimonialsData);
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("https://ligand-softwares-328p.onrender.com/api/testimonials");
        const data = await response.json();
        if (response.ok && data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials);
        }
      } catch (err) {
        console.error("Failed to load testimonials, using mock fallback data:", err);
      }
    };
    fetchTestimonials();
  }, []);

  const handleOpenTestimonial = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsTestimonialOpen(true);
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24">
      {/* Decorative background glows */}
      <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] bg-primary-violet/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[450px] h-[450px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* ==========================================
            HEADER TITLE SECTION
            ========================================== */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.span
            className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Corporate Profile
          </motion.span>
          <motion.h1 
            className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            About Ligand Software Solutions
          </motion.h1>
          <motion.p 
            className="text-slate-400 text-base md:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We combine technical expertise with business acumen to deliver solutions that drive results. Maintaining the highest quality standards and on-time delivery.
          </motion.p>
        </div>

        {/* ==========================================
            OUR STORY SECTION
            ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <motion.div 
            className="lg:col-span-7 glass-panel rounded-2xl p-8 md:p-10 border border-white/10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-outfit text-2xl font-bold text-white mb-6">
              Our Story & Foundation
            </h2>
            <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed font-outfit">
              <p>
                Ligand Software Solutions, established in 2011, is a company headquartered at Sankeshwar, Karnataka, India. We are promoted by a group of highly passionate Engineers and Technocrats having rich experience in the software development and consulting sector.
              </p>
              <p>
                Our combined core expertise along with a tireless dedication to customer success has enabled our business to rapidly expand global outreach, supporting clients across North America, the UK, Europe, and Asia-Pacific.
              </p>
              <p>
                We maintain active security certifications and strictly enforce on-time deliveries, utilizing modern agile methodologies to deploy software products seamlessly.
              </p>
            </div>

            {/* Core commitments badges */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-cyan" />
                <span className="text-xs font-mono font-medium text-white">ISO 9001 Standards</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-violet" />
                <span className="text-xs font-mono font-medium text-white">On-Time Execution</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-5 glass-panel rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-outfit text-lg font-bold text-white mb-6">
              Offered Scope & Capabilities
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {companyCapabilities.map((capability, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 text-xs font-mono font-medium rounded-full bg-white/[0.03] border border-white/5 text-slate-300 hover:border-primary-cyan/40 hover:text-white transition-all cursor-default"
                >
                  {capability}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ==========================================
            KEY DETAILS CARDS
            ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-28">
          {companyDetails.map((detail, idx) => {
            const icons = [MapPin, Briefcase, Award];
            const Icon = icons[idx] || Award;
            return (
              <motion.div
                key={idx}
                className="glass-panel rounded-2xl p-8 border border-white/10 relative overflow-hidden group hover:border-primary-cyan/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-cyan mb-6 group-hover:text-primary-violet transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-outfit text-sm font-bold text-primary-cyan tracking-wider uppercase mb-2">
                  {detail.title}
                </h3>
                <h4 className="font-outfit text-lg font-bold text-white mb-3 leading-snug">
                  {detail.value}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {detail.desc}
                </p>
                
                {detail.title.includes("Government") && (
                  <div className="mt-4 flex gap-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-primary-violet/10 border border-primary-violet/20 text-primary-violet">UID Active</span>
                    <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-primary-emerald/10 border border-primary-emerald/20 text-primary-emerald">NSDC Approved</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ==========================================
            TIMELINE MILESTONES (ANIMATED)
            ========================================== */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-20">
            <h2 className="font-outfit text-3xl font-extrabold text-white mb-4">
              Historical Timeline
            </h2>
            <p className="text-slate-400 text-sm">
              Tracing our evolution from a regional training group to a global software solutions and government-partnered agency.
            </p>
          </div>

          <div className="relative border-l border-white/10 max-w-4xl mx-auto pl-6 md:pl-10 space-y-12">
            {timelineData.map((milestone, idx) => (
              <motion.div
                key={idx}
                className="relative group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6 }}
              >
                {/* Timeline node dot */}
                <div className="absolute left-[-31px] md:left-[-47px] top-1.5 w-4 h-4 rounded-full bg-dark-900 border-2 border-primary-cyan group-hover:border-primary-violet transition-colors z-10" />
                
                {/* Timeline Card */}
                <div className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/15 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="text-xl font-outfit font-extrabold bg-gradient-to-r from-primary-violet to-primary-cyan bg-clip-text text-transparent">
                      {milestone.year}
                    </span>
                    <h3 className="font-outfit text-base font-bold text-white tracking-wide">
                      {milestone.title}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ==========================================
            OUR CLIENT PROJECTS SECTION
            ========================================== */}
        <div className="mt-28">
          <div className="text-center max-w-xl mx-auto mb-16">
            <motion.span
              className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Portfolio
            </motion.span>
            <motion.h2 
              className="font-outfit text-3xl font-extrabold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Client Projects
            </motion.h2>
            <motion.p 
              className="text-slate-400 text-sm leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Explore some of the high-impact software systems, web applications, and institutional portals designed and deployed by our team.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project._id || project.id}
                className="glass-panel rounded-2xl border border-white/5 overflow-hidden group hover:border-primary-cyan/30 hover:shadow-glow-cyan/5 transition-all duration-300 flex flex-col h-full bg-dark-900/40"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                {/* Image Thumbnail Container */}
                <div className="relative overflow-hidden aspect-video border-b border-white/5 bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Neon overlay grid glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-60 transition-opacity duration-300" />
                </div>

                {/* Info Content */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-outfit text-lg font-bold text-white mb-2.5 group-hover:text-primary-cyan transition-colors duration-200">
                      {project.name}
                    </h3>
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6">
                      {project.desc}
                    </p>
                  </div>

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-primary-cyan hover:text-white group/btn mt-auto"
                  >
                    <span>VISIT PROJECT</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ==========================================
            CLIENT TESTIMONIALS SECTION (AUTO SCROLLING MARQUEE)
            ========================================== */}
        <div className="mt-28">
          <div className="text-center max-w-xl mx-auto mb-16">
            <motion.span
              className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Testimonials
            </motion.span>
            <motion.h2 
              className="font-outfit text-3xl font-extrabold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              What Our Clients Say
            </motion.h2>
            <motion.p 
              className="text-slate-400 text-sm leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Real success stories and feedback from academic institutions, tech startups, and students who have grown with us.
            </motion.p>
          </div>

          {/* Marquee Wrapper */}
          <div className="relative overflow-hidden w-full py-4 mask-gradient-x">
            {/* Left and Right blur covers for soft edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dark-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dark-900 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-scroll flex gap-6">
              {/* Render twice for seamless looping */}
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div
                  key={`${testimonial._id || testimonial.id}-${idx}`}
                  className="w-[350px] shrink-0 glass-panel rounded-2xl p-6 border border-white/5 bg-dark-900/40 flex flex-col justify-between hover:border-primary-cyan/20 transition-all duration-300 group"
                >
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-4 text-amber-400">
                      {[...Array(5)].map((_, i) => {
                        const isFilled = i < (testimonial.rating || 5);
                        return (
                          <svg key={i} className={`w-4 h-4 ${isFilled ? "fill-current" : "stroke-current fill-none stroke-[1.5]"}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        );
                      })}
                    </div>

                    {/* Truncated description */}
                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-6 font-outfit line-clamp-3">
                      "{testimonial.desc}"
                    </p>
                  </div>

                  {/* Client Info and Read More */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <img
                        src={testimonial.image}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";
                        }}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/10 bg-slate-950"
                      />
                      <div className="flex flex-col">
                        <span className="font-outfit text-sm font-bold text-white leading-tight">
                          {testimonial.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {testimonial.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenTestimonial(testimonial)}
                      className="text-xs font-mono font-bold tracking-wider text-primary-cyan hover:text-white transition-colors cursor-pointer"
                    >
                      READ MORE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            TESTIMONIAL MODAL DETAIL VIEW
            ========================================== */}
        <Modal
          isOpen={isTestimonialOpen}
          onClose={() => setIsTestimonialOpen(false)}
          title="Client Testimonial"
        >
          {selectedTestimonial && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                <img
                  src={selectedTestimonial.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150";
                  }}
                  alt={selectedTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-cyan shadow-glow-cyan/10"
                />
                <div>
                  <h4 className="font-outfit text-xl font-bold text-white leading-tight">
                    {selectedTestimonial.name}
                  </h4>
                  <p className="text-sm font-mono text-primary-cyan mt-1">
                    {selectedTestimonial.role}
                  </p>
                  
                  {/* Testimonial Stars */}
                  <div className="flex gap-1 mt-2 text-amber-400">
                    {[...Array(5)].map((_, i) => {
                      const isFilled = i < (selectedTestimonial.rating || 5);
                      return (
                        <svg key={i} className={`w-4 h-4 ${isFilled ? "fill-current" : "stroke-current fill-none stroke-[1.5]"}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                  Detailed Feedback
                </span>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed font-outfit italic">
                  "{selectedTestimonial.desc}"
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsTestimonialOpen(false)}
                className="w-full py-2.5 mt-4 rounded-xl border border-white/10 hover:border-white/20 text-slate-400 hover:text-white font-mono font-bold tracking-wide text-xs uppercase cursor-pointer hover:bg-white/5 transition-all text-center"
              >
                Close View
              </button>
            </div>
          )}
        </Modal>

      </div>
    </div>
  );
}
