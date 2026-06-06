import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, ChevronRight, Zap, Code, Shield, Cpu, Globe, Database, Terminal } from 'lucide-react';
import { servicesData, statsData, whyChooseUsData } from '../data/mockData';
import StatCounter from '../components/StatCounter';
import * as Icons from 'lucide-react';

// Import subpages for a continuous single-page scrolling layout
import About from './About';
import Team from './Team';
import Gallery from './Gallery';
import Contact from './Contact';

// Dynamic Icon Renderer
const DynamicIcon = ({ name, className }) => {
  const IconComponent = Icons[name];
  if (!IconComponent) return <Code className={className} />;
  return <IconComponent className={className} />;
};

// 3D Tilt-On-Hover Service Card component
function ServiceCard({ service, idx, onEnquiryClick }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map mouse coordinate ratios to degrees of rotation
  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

  function handleMouseMove(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left - width / 2;
    const mouseY = event.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className="glass-panel rounded-2xl p-8 relative overflow-hidden group flex flex-col justify-between min-h-[300px] border border-white/5 cursor-default hover:border-primary-cyan/40 hover:shadow-glow-cyan/15 transition-shadow duration-300"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.08 }}
    >
      {/* Background card glow spot */}
      <div 
        className="absolute w-24 h-24 bg-primary-cyan/5 rounded-full blur-2xl group-hover:bg-primary-cyan/15 transition-colors duration-300 pointer-events-none"
        style={{
          transform: 'translateZ(10px)',
          top: '15%',
          right: '15%',
        }}
      />

      {/* Number Indicator */}
      <span 
        className="absolute top-4 right-6 font-mono text-5xl font-extrabold text-white/[0.02] select-none group-hover:text-white/[0.08] transition-colors duration-300"
        style={{ transform: 'translateZ(15px)' }}
      >
        {service.number}
      </span>

      {/* Card Top: Icon & Title */}
      <div style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-violet/10 to-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-primary-cyan mb-6 group-hover:shadow-glow-cyan/20 group-hover:border-primary-cyan/50 transition-all duration-300">
          <DynamicIcon name={service.icon} className="w-6 h-6" />
        </div>
        
        <h3 className="font-outfit text-xl font-bold text-white mb-3 tracking-wide group-hover:text-primary-cyan transition-colors duration-300">
          {service.title}
        </h3>
        
        <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-6">
          {service.description}
        </p>
      </div>

      {/* Card Bottom: Enquiry CTA */}
      <div style={{ transform: 'translateZ(20px)' }}>
        <button 
          onClick={onEnquiryClick}
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-primary-cyan group-hover:text-primary-violet transition-colors duration-300 cursor-pointer"
        >
          <span>Request Details</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Decorative border bottom glow */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-violet to-primary-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </motion.div>
  );
}

export default function Home({ onEnquiryClick, onJoinTrainingClick, onApplyClick }) {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse Parallax coordinates calculation
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch dynamic services
  const [services, setServices] = useState([]);
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("https://ligand-softwares-328p.onrender.com/api/services");
        const data = await response.json();
        if (response.ok && data.services && data.services.length > 0) {
          setServices(data.services);
        } else {
          setServices(servicesData);
        }
      } catch (err) {
        console.error("Failed to load services, using fallback mock data:", err);
        setServices(servicesData);
      }
    };
    fetchServices();
  }, []);

  const floatingIcons = [
    { Icon: Cpu, color: 'text-primary-cyan', top: '15%', left: '10%', delay: 0 },
    { Icon: Shield, color: 'text-primary-violet', top: '25%', right: '15%', delay: 1.5 },
    { Icon: Globe, color: 'text-primary-emerald', top: '65%', left: '12%', delay: 0.8 },
    { Icon: Database, color: 'text-primary-cyan', bottom: '20%', right: '20%', delay: 2.2 },
    { Icon: Terminal, color: 'text-primary-violet', top: '50%', right: '8%', delay: 1.1 }
  ];

  const techMarqueeItems = [
    "Full Stack React.js",
    "Python & Django",
    "Java Spring Boot",
    "AWS & Cloud DevOps",
    "Kubernetes Clusters",
    "Embedded RTOS Systems",
    "Cyber Security Audits",
    "UI/UX Designing",
    "Industrial IoT Platforms"
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      
      {/* Decorative Blur Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary-violet/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-primary-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ==========================================
          HERO SECTION (WITH 3D MULTI-LAYER STACK)
          ========================================== */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
        {/* Parallax Grid Background */}
        <div 
          className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"
          style={{
            transform: `translate(${mousePos.x * 0.012}px, ${mousePos.y * 0.012}px)`,
          }}
        />

        {/* Drifting Background Icons */}
        {floatingIcons.map((item, idx) => (
          <motion.div
            key={idx}
            className={`absolute hidden md:block p-3 rounded-2xl glass-panel border border-white/10 ${item.color} pointer-events-none z-10 shadow-glass-sm`}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              bottom: item.bottom,
              x: mousePos.x * 0.025,
              y: mousePos.y * 0.025,
            }}
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <item.Icon className="w-5 h-5" />
          </motion.div>
        ))}

        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left: Copy block */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md mb-6 hover:border-primary-cyan/35 transition-all">
                <Zap className="w-3.5 h-3.5 text-primary-cyan animate-pulse" />
                <span className="text-xs font-mono font-semibold tracking-wider text-slate-300">
                  ESTABLISHED 2011 • SANKESHWAR
                </span>
              </div>

              {/* Heading */}
              <h1 className="font-outfit text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
                <span className="block text-white">Ligand</span>
                <span className="block bg-gradient-to-r from-primary-violet via-primary-cyan to-primary-emerald bg-clip-text text-transparent">
                  Software Solutions
                </span>
              </h1>

              {/* Subheading Tagline */}
              <h2 className="font-outfit text-lg md:text-xl font-medium text-primary-cyan tracking-wide mb-4">
                "Exclusive Software for Innovative Minds"
              </h2>

              {/* Description */}
              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mb-8">
                We build innovative software solutions and train future technology professionals through industry-focused programs. Bridging enterprise capability with academic excellence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#services-section"
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-bold hover:shadow-glow-violet/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                >
                  Explore Services
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="https://liganddevelopers.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-full border border-primary-cyan/30 text-primary-cyan hover:bg-primary-cyan/10 hover:text-white transition-all font-semibold cursor-pointer flex items-center gap-2"
                >
                  LSM Platform
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-3.5 rounded-full border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.05] hover:border-white/20 transition-all font-semibold cursor-pointer"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>            {/* Hero Right: Interactive SVG Laptop & AI/Web Dev Visual */}
            <motion.div
              className="flex justify-center items-center relative h-[480px] w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{
                perspective: 1000,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Glowing halo behind */}
              <div className="absolute w-[450px] h-[450px] bg-gradient-radial from-primary-cyan/15 to-transparent blur-[80px] rounded-full animate-pulse-slow pointer-events-none" />

              {/* Interactive Visual Base */}
              <motion.div
                className="w-full max-w-[420px] h-[400px] flex items-center justify-center"
                style={{
                  rotateX: mousePos.y * -0.04,
                  rotateY: mousePos.x * 0.04,
                  transformStyle: 'preserve-3d',
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              >
                
                {/* SVG Stage */}
                <svg viewBox="0 0 200 200" className="w-full h-full text-transparent overflow-visible select-none">
                  <defs>
                    <linearGradient id="laptopBorder" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#090D1A" />
                      <stop offset="100%" stopColor="#02040A" />
                    </linearGradient>
                    <filter id="neonGlow" x1="-10%" y1="-10%" width="120%" height="120%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* ===================================================
                      1. BACKGROUND ORBITAL AND DATA STREAM LINES
                      =================================================== */}
                  <g opacity="0.3">
                    <circle cx="100" cy="90" r="70" stroke="url(#laptopBorder)" strokeWidth="0.5" strokeDasharray="3 9" fill="none" className="animate-spin [animation-duration:60s]" />
                    <circle cx="100" cy="90" r="55" stroke="#06B6D4" strokeWidth="0.5" strokeDasharray="5 5" fill="none" className="animate-spin [animation-duration:30s] [animation-direction:reverse]" />
                  </g>

                  {/* ===================================================
                      2. FLOATING AI / NEURAL NETWORK NODE (LEFT SIDE)
                      =================================================== */}
                  <motion.g
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {/* Glowing background halo for AI */}
                    <circle cx="28" cy="65" r="16" fill="rgba(139, 92, 246, 0.08)" filter="url(#neonGlow)" />
                    {/* Connections */}
                    <line x1="28" y1="65" x2="48" y2="60" stroke="#8B5CF6" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                    <line x1="28" y1="65" x2="42" y2="85" stroke="#8B5CF6" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                    
                    {/* Neural network net */}
                    <line x1="16" y1="65" x2="28" y2="53" stroke="#8B5CF6" strokeWidth="1" />
                    <line x1="28" y1="53" x2="40" y2="65" stroke="#06B6D4" strokeWidth="1" />
                    <line x1="40" y1="65" x2="28" y2="77" stroke="#06B6D4" strokeWidth="1" />
                    <line x1="28" y1="77" x2="16" y2="65" stroke="#8B5CF6" strokeWidth="1" />
                    <line x1="16" y1="65" x2="40" y2="65" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.5" />
                    <line x1="28" y1="53" x2="28" y2="77" stroke="#06B6D4" strokeWidth="0.5" opacity="0.5" />

                    {/* Nodes */}
                    <circle cx="28" cy="53" r="2.5" fill="#8B5CF6" filter="url(#neonGlow)" />
                    <circle cx="40" cy="65" r="2.5" fill="#06B6D4" filter="url(#neonGlow)" />
                    <circle cx="28" cy="77" r="2.5" fill="#10B981" filter="url(#neonGlow)" />
                    <circle cx="16" cy="65" r="2.5" fill="#8B5CF6" filter="url(#neonGlow)" />
                    <circle cx="28" cy="65" r="3.5" fill="#ffffff" filter="url(#neonGlow)" className="animate-pulse" />

                    {/* AI Label */}
                    <text x="28" y="44" fill="#8B5CF6" fontSize="6" fontFamily="monospace" textAnchor="middle" letterSpacing="1">AI CORE</text>
                  </motion.g>

                  {/* ===================================================
                      3. THE LAPTOP VECTOR
                      =================================================== */}
                  <g style={{ transformStyle: 'preserve-3d' }}>
                    
                    {/* Screen Bezel shadow / glow */}
                    <rect x="37" y="42" width="126" height="81" rx="5" fill="#02040A" stroke="url(#laptopBorder)" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.6" />
                    
                    {/* Screen Bezel */}
                    <rect x="38" y="43" width="124" height="79" rx="4" fill="#0B0F19" stroke="#1F2937" strokeWidth="1.5" />
                    
                    {/* Inner Screen Display */}
                    <rect x="42" y="47" width="116" height="71" rx="2" fill="url(#screenGlow)" />
                    
                    {/* Web Camera */}
                    <circle cx="100" cy="45" r="0.8" fill="#1F2937" />
                    <circle cx="100" cy="45" r="0.4" fill="#06B6D4" />

                    {/* Screen Coding IDE Contents */}
                    {/* Sidebar */}
                    <rect x="44" y="49" width="14" height="67" fill="rgba(255,255,255,0.02)" />
                    <line x1="58" y1="49" x2="58" y2="116" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <circle cx="51" cy="54" r="1.5" fill="#8B5CF6" opacity="0.6" />
                    <circle cx="51" cy="60" r="1.5" fill="#06B6D4" opacity="0.6" />
                    <circle cx="51" cy="66" r="1.5" fill="#10B981" opacity="0.6" />

                    {/* File Tabs */}
                    <rect x="58" y="49" width="30" height="6" fill="rgba(6, 182, 212, 0.1)" />
                    <text x="61" y="54" fill="#06B6D4" fontSize="4.5" fontFamily="monospace">App.jsx</text>
                    <line x1="88" y1="49" x2="88" y2="55" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                    {/* Code Lines */}
                    {/* Line 1 (import) */}
                    <rect x="62" y="59" width="22" height="2.5" rx="1" fill="#C084FC" />
                    <rect x="86" y="59" width="15" height="2.5" rx="1" fill="#818CF8" />
                    <rect x="103" y="59" width="28" height="2.5" rx="1" fill="#34D399" />
                    
                    {/* Line 2 (function) */}
                    <rect x="62" y="65" width="18" height="2.5" rx="1" fill="#F472B6" />
                    <rect x="82" y="65" width="25" height="2.5" rx="1" fill="#60A5FA" />
                    
                    {/* Line 3 (indent code) */}
                    <rect x="70" y="71" width="32" height="2.5" rx="1" fill="#38BDF8" />
                    <rect x="104" y="71" width="20" height="2.5" rx="1" fill="#F59E0B" />
                    
                    {/* Line 4 (indent code) */}
                    <rect x="70" y="77" width="15" height="2.5" rx="1" fill="#34D399" />
                    <rect x="87" y="77" width="38" height="2.5" rx="1" fill="#818CF8" />
                    
                    {/* Line 5 (closing brace) */}
                    <rect x="62" y="83" width="8" height="2.5" rx="1" fill="#F472B6" />

                    {/* Live preview graph in IDE bottom right */}
                    <rect x="110" y="88" width="44" height="25" rx="3" fill="rgba(2, 4, 10, 0.75)" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.5" />
                    <path d="M114,107 L122,100 L130,103 L138,94 L146,101 L150,97" stroke="url(#laptopBorder)" strokeWidth="1" fill="none" filter="url(#neonGlow)" />
                    <circle cx="138" cy="94" r="1.5" fill="#ffffff" filter="url(#neonGlow)" className="animate-pulse" />
                    
                    {/* Console Bar */}
                    <rect x="42" y="112" width="116" height="6" fill="#02040A" />
                    <text x="46" y="116.5" fill="#10B981" fontSize="4" fontFamily="monospace" letterSpacing="0.5">DEPLOYMENT COMPILED SUCCESSFULLY</text>

                    {/* Laptop Hinge connection */}
                    <rect x="80" y="121" width="40" height="4" rx="1" fill="#1F2937" />

                    {/* Laptop Bottom Keyboard Base (Isometric projection) */}
                    <polygon points="25,124 175,124 195,147 5,147" fill="#111827" stroke="url(#laptopBorder)" strokeWidth="1.5" filter="url(#neonGlow)" opacity="0.5" />
                    <polygon points="26,124 174,124 193,145 7,145" fill="#1F2937" stroke="#374151" strokeWidth="1" />
                    
                    {/* Laptop Base Inner Bevel */}
                    <polygon points="34,126 166,126 182,140 18,140" fill="#0F172A" />

                    {/* Keyboard Rows (Represented by concentric lines) */}
                    <line x1="38" y1="129" x2="162" y2="129" stroke="#1F2937" strokeWidth="1" />
                    <line x1="34" y1="133" x2="166" y2="133" stroke="#1F2937" strokeWidth="1" />
                    <line x1="30" y1="137" x2="170" y2="137" stroke="#1F2937" strokeWidth="1" />

                    {/* Trackpad */}
                    <polygon points="86,141 114,141 116,144 84,144" fill="#06B6D4" opacity="0.3" filter="url(#neonGlow)" />
                    <polygon points="86,141 114,141 116,144 84,144" fill="#374151" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

                  </g>

                  {/* ===================================================
                      4. FLOATING WEB DEV PAGE (RIGHT SIDE)
                      =================================================== */}
                  <motion.g
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  >
                    {/* Glowing background halo for Web */}
                    <rect x="156" y="80" width="34" height="42" rx="4" fill="rgba(6, 182, 212, 0.08)" filter="url(#neonGlow)" />
                    {/* Connection */}
                    <line x1="156" y1="100" x2="140" y2="105" stroke="#06B6D4" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />

                    {/* Web Dev Window Frame */}
                    <rect x="156" y="80" width="34" height="42" rx="3" fill="rgba(11, 15, 25, 0.85)" stroke="#06B6D4" strokeWidth="1" filter="url(#neonGlow)" />
                    
                    {/* Title bar */}
                    <rect x="156" y="80" width="34" height="6" rx="1.5" fill="rgba(255,255,255,0.03)" />
                    <circle cx="160" cy="83" r="0.8" fill="#EF4444" />
                    <circle cx="163" cy="83" r="0.8" fill="#F59E0B" />
                    <circle cx="166" cy="83" r="0.8" fill="#10B981" />
                    <rect x="172" y="82" width="14" height="2" rx="0.5" fill="rgba(255,255,255,0.1)" />

                    {/* Layout Mock */}
                    {/* Banner */}
                    <rect x="160" y="89" width="26" height="8" rx="1.5" fill="url(#laptopBorder)" opacity="0.75" />
                    {/* Column 1 */}
                    <rect x="160" y="100" width="11" height="18" rx="1.5" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <circle cx="165.5" cy="105" r="2.5" fill="#06B6D4" opacity="0.8" />
                    <rect x="162" y="110" width="7" height="1.5" rx="0.5" fill="rgba(255,255,255,0.1)" />
                    
                    {/* Column 2 */}
                    <rect x="175" y="100" width="11" height="18" rx="1.5" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                    <circle cx="180.5" cy="105" r="2.5" fill="#8B5CF6" opacity="0.8" />
                    <rect x="177" y="110" width="7" height="1.5" rx="0.5" fill="rgba(255,255,255,0.1)" />

                    {/* Web Label */}
                    <text x="173" y="128" fill="#06B6D4" fontSize="5.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.8">WEB DEV</text>
                  </motion.g>

                  {/* ===================================================
                      5. DATA STREAM PARTICLES (FLOATING CODE CHIPS)
                      =================================================== */}
                  {/* Floating Bracket Tag */}
                  <motion.g
                    animate={{ y: [0, -12, 0], x: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  >
                    <rect x="145" y="24" width="22" height="12" rx="3" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="0.5" />
                    <text x="156" y="32" fill="#10B981" fontSize="7" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">&lt;/&gt;</text>
                  </motion.g>

                  {/* Floating Binary Tag */}
                  <motion.g
                    animate={{ y: [0, 12, 0], x: [0, -5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  >
                    <rect x="42" y="132" width="22" height="12" rx="3" fill="rgba(6, 182, 212, 0.15)" stroke="#06B6D4" strokeWidth="0.5" />
                    <text x="53" y="140" fill="#06B6D4" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">01</text>
                  </motion.g>

                </svg>

              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ==========================================
          INFINITE TECHNOLOGY MARQUEE BAND
          ========================================== */}
      <div className="w-full py-6 overflow-hidden bg-dark-900 border-y border-white/5 relative z-20">
        <div className="animate-marquee-scroll">
          {techMarqueeItems.concat(techMarqueeItems).map((tech, i) => (
            <span 
              key={i} 
              className="font-outfit font-extrabold text-sm tracking-widest text-slate-500 uppercase flex items-center gap-4 px-8 cursor-default hover:text-primary-cyan transition-colors duration-300"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary-violet to-primary-cyan" />
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ==========================================
          STATISTICS SECTION
          ========================================== */}
      <section className="relative py-16 bg-dark-800/50 border-b border-white/5 z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {statsData.map((stat, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-outfit font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2 animate-pulse-slow">
                  <StatCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <span className="text-slate-400 text-xs font-semibold tracking-widest uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          SERVICES SECTION (WITH 3D TILT CARDS)
          ========================================== */}
      <section id="services-section" className="relative py-24 z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block">
              Core Capabilities
            </span>
            <h2 className="font-outfit text-3xl md:text-4xl font-extrabold text-white mb-4">
              Enterprise Solutions & Technologies
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              We specialize in multiple software ecosystems, designing responsive web panels, secure clouds, and IoT integrations.
            </p>
          </div>

          {/* Services Grid with 3D Tilt components */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <ServiceCard 
                key={service._id || service.id} 
                service={service} 
                idx={idx} 
                onEnquiryClick={onEnquiryClick} 
              />
            ))}
          </div>

        </div>
      </section>

      {/* ==========================================
          WHY CHOOSE US SECTION
          ========================================== */}
      <section className="relative py-24 bg-dark-800/30 border-t border-white/5 z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Copy Left */}
            <div>
              <span className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block">
                The Ligand Advantage
              </span>
              <h2 className="font-outfit text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                Architecting Core Business Applications and Upskilling Innovators
              </h2>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                Ligand Softwares bridges industrial development cycles with academic training. We maintain rigorous standards, supporting national skills training and government database protocols.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary-cyan/20 transition-all duration-300">
                  <h4 className="font-outfit font-bold text-white mb-2 text-sm">Elite Faculty</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Mentorship directly by practicing Engineers and technocrats with 14+ years of software experience.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary-cyan/20 transition-all duration-300">
                  <h4 className="font-outfit font-bold text-white mb-2 text-sm">Govt. Endorsements</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Proven infrastructure handling critical projects like UID operations and NSDC star schemes.
                  </p>
                </div>
              </div>
            </div>

            {/* Grid Right */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {whyChooseUsData.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 rounded-2xl glass-panel border border-white/5 relative overflow-hidden group hover:border-primary-cyan/35 transition-colors duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-violet/5 rounded-full blur-2xl group-hover:bg-primary-cyan/10 transition-colors duration-300 pointer-events-none" />
                  
                  <h3 className="font-outfit font-bold text-white text-base mb-2 group-hover:text-primary-cyan transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          SEQUENTIAL LANDING SECTIONS (ONE BY ONE SCROLL FLOW)
          ========================================== */}
      
      {/* About Section */}
      <section id="about-section" className="border-t border-white/5 bg-dark-900/50">
        <About />
      </section>

      {/* Team Section */}
      <section id="team-section" className="border-t border-white/5 bg-dark-900/20">
        <Team />
      </section>

      {/* Gallery Section */}
      <section id="gallery-section" className="border-t border-white/5 bg-dark-900/50">
        <Gallery />
      </section>

     
      {/* Contact Section */}
      <section id="contact-section" className="border-t border-white/5 bg-dark-900/20 pb-20">
        <Contact />
      </section>

    </div>
  );
}
