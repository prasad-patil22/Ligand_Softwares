import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full glass-panel text-primary-cyan hover:text-white border border-primary-cyan/30 shadow-glow-cyan flex items-center justify-center cursor-pointer"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ 
            scale: 1.1, 
            borderColor: 'rgba(139, 92, 246, 0.6)', 
            boxShadow: '0 0 20px 2px rgba(139, 92, 246, 0.4)' 
          }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to Top"
        >
          <ChevronUp className="w-6 h-6 animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
