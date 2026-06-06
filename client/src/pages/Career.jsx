import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, Calendar, GraduationCap, Building2, TrendingUp, Sparkles } from 'lucide-react';
import { careersData } from '../data/mockData';

export default function Career({ onApplyClick }) {
  const [activeTab, setActiveTab] = useState('JOBS'); // JOBS or INTERNSHIPS
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch("https://ligand-softwares-328p.onrender.com/api/careers");
        const data = await response.json();
        if (response.ok && data.careers && data.careers.length > 0) {
          setCareers(data.careers);
        } else {
          // Map mock data into the same schema structure
          const fallbackCareers = [
            ...careersData.positions.map(p => ({ ...p, category: 'JOBS' })),
            ...careersData.internships.map(i => ({ ...i, category: 'INTERNSHIPS' }))
          ];
          setCareers(fallbackCareers);
        }
      } catch (err) {
        console.error("Failed to load careers, using mock fallback:", err);
        const fallbackCareers = [
          ...careersData.positions.map(p => ({ ...p, category: 'JOBS' })),
          ...careersData.internships.map(i => ({ ...i, category: 'INTERNSHIPS' }))
        ];
        setCareers(fallbackCareers);
      } finally {
        setLoading(false);
      }
    };
    fetchCareers();
  }, []);

  const jobs = careers.filter(item => item.category === 'JOBS');
  const internships = careers.filter(item => item.category === 'INTERNSHIPS');

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center font-inter">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">Loading Open Listings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 pb-24">
      {/* Background glow spots */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary-violet/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-primary-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block">
            Join Our Team
          </span>
          <h1 className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-6">
            Build the Future of Tech With Us
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Ligand Softwares is looking for developers, designers, and testers to expand our development core. We also run paid internships for top student coders.
          </p>
        </div>

        {/* Career Stats / Placement Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary-cyan/5 rounded-full blur-xl" />
            <div className="p-3 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 text-primary-cyan">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Placements</span>
              <span className="text-lg font-outfit font-bold text-white">40+ Partner MNCs</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary-violet/5 rounded-full blur-xl" />
            <div className="p-3 rounded-xl bg-primary-violet/10 border border-primary-violet/20 text-primary-violet">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Placement Ratio</span>
              <span className="text-lg font-outfit font-bold text-white">85% Success Rate</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/5 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary-emerald/5 rounded-full blur-xl" />
            <div className="p-3 rounded-xl bg-primary-emerald/10 border border-primary-emerald/20 text-primary-emerald">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Incubation Support</span>
              <span className="text-lg font-outfit font-bold text-white">Student Startup Lab</span>
            </div>
          </div>
        </div>

        {/* Tab switch buttons */}
        <div className="flex justify-center mb-12">
          <div className="p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 flex gap-2">
            <button
              onClick={() => setActiveTab('JOBS')}
              className={`px-6 py-3 rounded-xl font-outfit font-bold text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                activeTab === 'JOBS'
                  ? 'bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 shadow-glow-violet/15'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Open Positions
            </button>
            <button
              onClick={() => setActiveTab('INTERNSHIPS')}
              className={`px-6 py-3 rounded-xl font-outfit font-bold text-sm tracking-wider uppercase transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                activeTab === 'INTERNSHIPS'
                  ? 'bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 shadow-glow-violet/15'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Internships
            </button>
          </div>
        </div>

        {/* Position Listing Stage */}
        <AnimatePresence mode="wait">
          {activeTab === 'JOBS' ? (
            <motion.div
              key="jobs-list"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {jobs.map((job) => (
                <div
                  key={job._id || job.id}
                  className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 hover:border-primary-cyan/35 transition-all duration-300 flex flex-col justify-between min-h-[250px] relative group"
                >
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-violet to-primary-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-violet/10 border border-primary-violet/20 text-[10px] font-mono font-bold text-primary-violet">
                        <Clock className="w-3.5 h-3.5" />
                        {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-cyan/10 border border-primary-cyan/20 text-[10px] font-mono font-bold text-primary-cyan">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                    </div>

                    <h3 className="font-outfit text-xl font-bold text-white mb-2 group-hover:text-primary-cyan transition-colors">
                      {job.title}
                    </h3>
                    
                    <span className="font-mono text-xs text-slate-400 block mb-4">
                      Experience: {job.experience}
                    </span>

                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6">
                      {job.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onApplyClick(job.title)}
                    className="w-full sm:w-auto py-2.5 px-6 rounded-xl border border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:border-primary-cyan/60 hover:bg-white/[0.03] transition-all cursor-pointer text-center"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="internships-list"
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {internships.map((internship) => (
                <div
                  key={internship._id || internship.id}
                  className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 hover:border-primary-cyan/35 transition-all duration-300 flex flex-col justify-between min-h-[250px] relative group"
                >
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-violet to-primary-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-emerald/10 border border-primary-emerald/20 text-[10px] font-mono font-bold text-primary-emerald">
                        <Calendar className="w-3.5 h-3.5" />
                        {internship.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-cyan/10 border border-primary-cyan/20 text-[10px] font-mono font-bold text-primary-cyan">
                        <MapPin className="w-3.5 h-3.5" />
                        {internship.location}
                      </span>
                    </div>

                    <h3 className="font-outfit text-xl font-bold text-white mb-2 group-hover:text-primary-cyan transition-colors">
                      {internship.title}
                    </h3>

                    <span className="font-mono text-xs text-slate-400 block mb-4">
                      Eligibility: {internship.experience}
                    </span>

                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6">
                      {internship.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => onApplyClick(internship.title)}
                    className="w-full sm:w-auto py-2.5 px-6 rounded-xl border border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white hover:border-primary-cyan/60 hover:bg-white/[0.03] transition-all cursor-pointer text-center"
                  >
                    Apply for Internship
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
