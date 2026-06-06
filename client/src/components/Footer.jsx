import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, Send, Facebook, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Photo Gallery', path: '/gallery' },
    { name: 'Career Board', path: '/career' },
    { name: 'Contact Us', path: '/contact' }
  ];

  const courseLinks = [
    { name: 'Full Stack Development', path: '/courses' },
    { name: 'Python Programming', path: '/courses' },
    { name: 'Java Development', path: '/courses' },
    { name: 'Embedded Systems', path: '/courses' },
    { name: 'Cyber Security', path: '/courses' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/StarLightItWorldSankeshwar/', label: 'Facebook' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/sachin-banne-3a341051/', label: 'Linkedin' },
    { icon: Github, href: 'https://github.com/ligandproject-dev', label: 'Github' }
  ];

  return (
    <footer className="relative bg-dark-900 border-t border-white/5 pt-12 overflow-hidden z-10">
      
      {/* Animated Wave SVG at the top of the footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] h-12">
        <svg 
          className="relative block w-[200%] h-12 text-dark-800" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
          style={{ transform: 'rotate(180deg)' }}
        >
          <path 
            d="M0,60 C150,100 350,20 500,60 C650,100 850,20 1000,60 C1150,100 1350,20 1500,60 L1500,120 L0,120 Z" 
            fill="currentColor" 
            className="animate-wave-slow opacity-10"
          />
          <path 
            d="M0,60 C180,90 310,30 480,60 C650,90 780,30 950,60 C1120,90 1250,30 1420,60 L1420,120 L0,120 Z" 
            fill="currentColor" 
            className="animate-wave-fast opacity-20"
          />
          <path 
            d="M0,60 C120,80 240,40 360,60 C480,80 600,40 720,60 C840,80 960,40 1080,60 L1080,120 L0,120 Z" 
            fill="currentColor" 
            className="opacity-30"
          />
        </svg>
      </div>

      {/* Decorative Blur Spot */}
      <div className="absolute bottom-[-100px] left-[10%] w-96 h-96 bg-primary-violet/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[10%] w-96 h-96 bg-primary-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 pt-8">

        {/* ==========================================
            ANIMATED CALL TO ACTION HEADER
            ========================================== */}
        <div className="text-center py-10 md:py-16 border-b border-white/5 relative overflow-hidden mb-12">
          {/* Subtle glowing halo behind CTA */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-32 bg-primary-violet/10 rounded-full blur-[60px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              <span className="block text-white leading-tight">
                Let’s Connect & Build
              </span>
              <span className="block bg-gradient-to-r from-primary-violet via-primary-cyan to-primary-emerald bg-clip-text text-transparent filter drop-shadow-glow-cyan animate-pulse-slow mt-2">
                Something Amazing together
              </span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-mono tracking-widest uppercase mt-4 animate-pulse">
              Have an idea or a training goal? Let's turn it into reality.
            </p>
          </motion.div>
        </div>

        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <svg className="w-8 h-8" viewBox="0 0 100 100">
                <polygon points="50,8 88,30 88,70 50,92 12,70 12,30" stroke="#06B6D4" strokeWidth="6" fill="none" />
                <path d="M32 38 V62 H44" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M54 38 H46 V47 H54 V59 H46" stroke="#8B5CF6" strokeWidth="8" strokeLinecap="round" fill="none" />
                <path d="M68 38 H60 V47 H68 V59 H60" stroke="#06B6D4" strokeWidth="8" strokeLinecap="round" fill="none" />
              </svg>
              <span className="font-outfit text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-primary-cyan bg-clip-text text-transparent">
                LIGAND SOFTWARE SOLUTIONS
              </span>
            </Link>
            <p className="text-slate-400 text-sm font-outfit leading-relaxed italic">
              "Exclusive Software for Innovative Minds"
            </p>
            <p className="text-slate-400 text-sm leading-relaxed mt-2">
              Bridging the gap between education and industry through world-class software engineering and hands-on technical training.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-primary-cyan/60 hover:shadow-glow-cyan/20 transition-all duration-300"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links & Services */}
          <div className="grid grid-cols-2 gap-4 col-span-1 lg:col-span-2">
            <div>
              <h4 className="font-outfit font-bold text-white tracking-wide mb-5 text-sm uppercase">
                Company Navigation
              </h4>
              <ul className="flex flex-col gap-3">
                {quickLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      to={link.path} 
                      className="text-slate-400 hover:text-primary-cyan text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-outfit font-bold text-white tracking-wide mb-5 text-sm uppercase">
                Training Programs
              </h4>
              <ul className="flex flex-col gap-3">
                {courseLinks.map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      to={link.path} 
                      className="text-slate-400 hover:text-primary-cyan text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter / Contact details */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="font-outfit font-bold text-white tracking-wide mb-4 text-sm uppercase">
                Newsletter
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Subscribe to get recruitment alerts, tech insights, and course registration openings.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                  className="glass-input text-sm px-4 py-2 rounded-full w-full"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-full bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-bold transition-all hover:scale-105 hover:shadow-glow-violet/30 cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {subscribed && (
                <span className="text-xs text-primary-emerald mt-2 block font-medium animate-pulse">
                  Successfully subscribed! Check inbox.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2.5 border-t border-white/5 pt-4">
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <MapPin className="w-4 h-4 text-primary-cyan flex-shrink-0" />
                <span>Sankeshwar, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-xs">
                <Phone className="w-4 h-4 text-primary-violet flex-shrink-0" />
                <span>+91 8722585715</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <center><p className="text-xs text-slate-500 font-mono">
            © 2026 Ligand Software Solutions. All Rights Reserved.
          </p></center>
          <div className="flex gap-6">
           
          </div>
        </div>

      </div>
    </footer>
  );
}
