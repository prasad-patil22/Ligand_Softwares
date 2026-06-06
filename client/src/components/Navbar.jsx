import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onEnquiryClick, onJoinTrainingClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'About Us' | 'Courses' | null
  const [mobileExpanded, setMobileExpanded] = useState({ 'About Us': false, 'Courses': false });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleNavLinkClick = (e, path) => {
    if (path.startsWith('http')) return;
    
    if (location.pathname === '/') {
      if (path === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsOpen(false);
      } else if (path.startsWith('/')) {
        const sectionId = path.substring(1); // 'about', 'team', etc.
        const element = document.getElementById(`${sectionId}-section`);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: 'smooth' });
          setIsOpen(false);
        }
      }
    }
  };

  // Dropdown Link configurations
  const navLinks = [
    { name: 'Home', path: '/' },
    { 
      name: 'About Us', 
      dropdown: [
        { name: 'About Us', path: '/about' },
        { name: 'Our Team', path: '/team' }
      ]
    },
    { name: 'Gallery', path: '/gallery' },
    { 
      name: 'Courses', 
      dropdown: [
        { name: 'Courses', path: '/courses' },
        { name: 'Careers', path: '/career' }
      ]
    },
    { name: 'Contact Us', path: '/contact' }
  ];

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-[40] transition-all duration-300 px-4 md:px-8 py-4 pointer-events-none ${
        scrolled ? 'pt-2' : 'pt-4'
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto transition-all duration-300 rounded-full border border-white/5 pointer-events-auto ${
          scrolled 
            ? 'glass-panel bg-dark-900/75 py-2.5 px-6 shadow-glow-violet/10' 
            : 'bg-transparent py-4 px-4'
        }`}
      >
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative">
              <svg className="w-full h-full text-transparent" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <polygon
                  points="50,8 88,30 88,70 50,92 12,70 12,30"
                  stroke="url(#navLogoGrad)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle cx="50" cy="50" r="3" fill="#06B6D4" />
                <path d="M32 38 V62 H44" stroke="url(#navLogoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M54 38 H46 V47 H54 V59 H46" stroke="url(#navLogoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
                <path d="M68 38 H60 V47 H68 V59 H60" stroke="url(#navLogoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-outfit text-lg md:text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-slate-100 to-primary-cyan bg-clip-text text-transparent group-hover:to-primary-violet transition-all duration-300">
                LIGAND SOFTWARE
              </span>
              <span className="text-[8px] font-mono tracking-wider text-slate-400 uppercase hidden sm:block">
                Exclusive Softwares for Innovative Minds
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links with Hover Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              if (link.dropdown) {
                const isDropdownActive = activeDropdown === link.name;
                const isSubLinkActive = link.dropdown.some(sub => location.pathname === sub.path);
                
                return (
                  <div
                    key={link.name}
                    className="relative py-2"
                    onMouseEnter={() => setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={`px-4 py-1.5 text-sm font-medium font-outfit tracking-wide transition-colors duration-200 hover:text-white flex items-center gap-1.5 cursor-pointer rounded-full ${
                        isSubLinkActive ? 'text-primary-cyan' : 'text-slate-300'
                      }`}
                    >
                      {link.name}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isDropdownActive ? 'rotate-180 text-primary-cyan' : 'text-slate-400'
                      }`} />
                    </button>

                    <AnimatePresence>
                      {isDropdownActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-2.5 w-44 glass-panel rounded-2xl p-2 border border-white/10 shadow-glass-md flex flex-col gap-1 z-50 bg-dark-900/95"
                        >
                          {link.dropdown.map((sub) => (
                            <NavLink
                              key={sub.name}
                              to={sub.path}
                              onClick={(e) => handleNavLinkClick(e, sub.path)}
                              className={({ isActive }) => 
                                `px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-200 text-left cursor-pointer ${
                                  isActive 
                                    ? 'bg-gradient-to-r from-primary-violet/20 to-primary-cyan/20 border border-primary-cyan/30 text-primary-cyan shadow-glow-cyan/5' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`
                              }
                            >
                              {sub.name}
                            </NavLink>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Normal nav link
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={(e) => handleNavLinkClick(e, link.path)}
                  className={({ isActive }) => 
                    `relative px-4 py-2 text-sm font-medium font-outfit tracking-wide transition-colors duration-200 hover:text-white rounded-full ${
                      isActive ? 'text-primary-cyan' : 'text-slate-300'
                    }`
                  }
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-white/[0.04] border border-white/10 rounded-full -z-10 shadow-glass-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Call to Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://liganddevelopers.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-wider text-primary-cyan hover:text-white px-4 py-2 border border-primary-cyan/30 rounded-full hover:bg-primary-cyan/10 transition-all cursor-pointer"
            >
              LSM Platform
            </a>
            <button
              onClick={onJoinTrainingClick}
              className="group text-xs font-semibold uppercase tracking-wider text-dark-900 bg-gradient-to-r from-primary-violet to-primary-cyan px-5 py-2.5 rounded-full hover:shadow-glow-violet/30 transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              Join Training
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-slate-300 hover:text-white p-2 rounded-xl border border-white/5 hover:border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Slide-over with Accordion Toggles */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden flex flex-col justify-between bg-dark-900/98 backdrop-blur-xl px-6 pt-24 pb-10 overflow-y-auto pointer-events-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.76, 0, 0.24, 1], duration: 0.5 }}
          >
            {/* Custom glowing design inside mobile menu */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-violet/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary-cyan/10 rounded-full blur-[100px] pointer-events-none" />

            <nav className="flex flex-col gap-4 items-center text-center mt-6">
              {navLinks.map((link, idx) => {
                if (link.dropdown) {
                  const isExpanded = mobileExpanded[link.name];
                  const isSubActive = link.dropdown.some(sub => location.pathname === sub.path);
                  
                  return (
                    <motion.div 
                      key={link.name} 
                      className="flex flex-col items-center w-full"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                    >
                      <button
                        onClick={() => setMobileExpanded({
                          ...mobileExpanded,
                          [link.name]: !isExpanded
                        })}
                        className={`flex items-center gap-2 font-outfit text-2xl font-bold py-2 cursor-pointer ${
                          isSubActive
                            ? 'bg-gradient-to-r from-primary-violet to-primary-cyan bg-clip-text text-transparent'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {link.name}
                        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-primary-cyan' : 'text-slate-400'
                        }`} />
                      </button>

                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden flex flex-col gap-2 bg-white/[0.02] border border-white/5 rounded-2xl py-2.5 px-6 mt-1.5 w-64"
                          >
                            {link.dropdown.map((sub) => {
                              const isSubActive = location.pathname === sub.path;
                              return (
                                <Link
                                  key={sub.name}
                                  to={sub.path}
                                  onClick={(e) => {
                                    setIsOpen(false);
                                    handleNavLinkClick(e, sub.path);
                                  }}
                                  className={`font-outfit text-base py-1.5 transition-colors cursor-pointer ${
                                    isSubActive ? 'text-primary-cyan font-semibold' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }

                // Normal mobile link
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.name}
                    className="w-full"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={(e) => {
                        setIsOpen(false);
                        handleNavLinkClick(e, link.path);
                      }}
                      className={`block font-outfit text-2xl font-bold py-2 cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary-violet to-primary-cyan bg-clip-text text-transparent' 
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div 
              className="flex flex-col gap-4 mt-8 w-full max-w-xs mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <a
                href="https://liganddevelopers.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-3 rounded-full border border-primary-cyan/30 text-primary-cyan hover:text-white hover:bg-primary-cyan/10 font-semibold font-outfit tracking-wide cursor-pointer block text-sm"
              >
                LSM Platform
              </a>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onJoinTrainingClick();
                }}
                className="w-full text-center py-3 rounded-full bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-bold font-outfit tracking-wide flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                Join Training
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
