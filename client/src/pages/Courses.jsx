import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search,  Clock, BarChart, Code2, ChevronDown, ChevronUp, Award, Zap } from 'lucide-react';
import { coursesData } from '../data/mockData';

export default function Courses({ onEnrollClick }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [expandedSyllabusId, setExpandedSyllabusId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://ligand-softwares-328p.onrender.com/api/courses");
        const data = await response.json();
        if (response.ok && data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        } else {
          setCourses(coursesData);
        }
      } catch (err) {
        console.error("Failed to load courses, using mock fallback:", err);
        setCourses(coursesData);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter Levels: ALL, BEGINNER, INTERMEDIATE, ADVANCED
  const levels = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.language.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = 
      levelFilter === 'ALL' || 
      course.level.toUpperCase().includes(levelFilter);

    return matchesSearch && matchesLevel;
  });

  const toggleSyllabus = (id) => {
    setExpandedSyllabusId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center font-inter">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">Loading Training Modules...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 pb-24">
      {/* Background glow spots */}
      <div className="absolute top-[15%] right-[-10%] w-[450px] h-[450px] bg-primary-violet/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[450px] h-[450px] bg-primary-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block">
            Software Training Institute
          </span>
          <h1 className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-6">
            Industry Ready Skill Development
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Ligand training modules are designed by engineers, focusing on active lab work, real-world APIs, and placement assistance under global standards.
          </p>
        </div>

        {/* Search and Filters panel */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Search bar */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses (e.g. React, Python)..."
              className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-sm"
            />
          </div>

          {/* Level Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
            <span className="text-xs font-mono text-slate-400 mr-2 uppercase tracking-wider hidden sm:block">
              Filter Level:
            </span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-4 py-2 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-primary-cyan text-dark-900 shadow-glow-cyan/20'
                    : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredCourses.map((course) => (
              <motion.div
                key={course._id || course.id}
                className={`glass-panel rounded-2xl border overflow-hidden relative flex flex-col justify-between group transition-all duration-300 ${
                  course.popular 
                    ? 'border-primary-cyan/40 shadow-glow-cyan/5' 
                    : 'border-white/5 hover:border-primary-cyan/35'
                }`}
                layout
              >
                {/* Image & Badge Row */}
                <div className="relative h-56 overflow-hidden bg-dark-800">
                  <img
                    src={course.image}
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  {/* Neon Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark-900/80 backdrop-blur-md text-[10px] font-mono font-extrabold text-primary-cyan border border-primary-cyan/20">
                      <Award className="w-3.5 h-3.5" />
                      {course.certBadge}
                    </span>
                    {course.popular && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 text-[10px] font-mono font-extrabold shadow-glow-violet/20">
                        <Zap className="w-3.5 h-3.5 animate-pulse" />
                        POPULAR
                      </span>
                    )}
                  </div>
                  
                  {/* Course Title inside banner */}
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="font-outfit font-extrabold text-2xl text-white tracking-wide leading-tight">
                      {course.name}
                    </h3>
                  </div>
                </div>

                {/* Course Details Block */}
                <div className="p-6 md:p-8 flex-grow">
                  
                  {/* Specifications pills */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
                      <Clock className="w-4 h-4 text-primary-cyan mb-1.5" />
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Duration</span>
                      <span className="text-xs font-semibold text-white mt-0.5">{course.duration}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
                      <BarChart className="w-4 h-4 text-primary-violet mb-1.5" />
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Level</span>
                      <span className="text-xs font-semibold text-white mt-0.5 truncate max-w-full">{course.level.split(" ")[0]}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
                      <Code2 className="w-4 h-4 text-primary-emerald mb-1.5" />
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Language</span>
                      <span className="text-xs font-semibold text-white mt-0.5 truncate max-w-full">{course.language.split(",")[0]}</span>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-slate-400 leading-normal mb-6">
                    <strong className="text-slate-300">Stack:</strong> {course.language}
                  </p>

                  {/* Collapsible Syllabus Accordion */}
                  <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01] mb-6">
                    <button
                      onClick={() => toggleSyllabus(course._id || course.id)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left font-outfit font-semibold text-xs text-slate-300 hover:text-white hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <span>COURSE SYLLABUS & MODULES</span>
                      {expandedSyllabusId === (course._id || course.id) ? (
                        <ChevronUp className="w-4 h-4 text-primary-cyan" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {expandedSyllabusId === (course._id || course.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <ul className="px-4 pb-4 pt-1 space-y-2 border-t border-white/5">
                            {course.syllabus.map((item, idx) => (
                              <li key={idx} className="flex gap-2 text-xs text-slate-400 font-outfit">
                                <span className="text-primary-cyan font-semibold">0{idx + 1}.</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Enroll button CTA */}
                  <button
                    onClick={() => onEnrollClick(course.name)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold font-outfit tracking-wider text-xs uppercase hover:shadow-glow-violet/20 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Enroll & Join Training</span>
                  </button>

                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty search search state */
          <div className="text-center py-16 glass-panel rounded-2xl border border-white/5 max-w-lg mx-auto">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-outfit font-bold text-lg mb-2">No Courses Found</h3>
            <p className="text-slate-400 text-sm">
              We couldn't find any courses matching "{searchQuery}". Please verify spelling or clear level filters.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
