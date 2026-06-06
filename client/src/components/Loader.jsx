import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const durations = [1000, 1500, 2000];
    const chosenDuration = durations[Math.floor(Math.random() * durations.length)];
    const totalSteps = 50;
    const stepInterval = chosenDuration / totalSteps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      let currentProgress = Math.floor((currentStep / totalSteps) * 100);
      
      if (currentStep >= totalSteps) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 600); // Allow fadeout animation to complete
        }, 300);
      }
      setProgress(currentProgress);
    }, stepInterval);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 bg-dark-900 z-[99999] flex flex-col justify-center items-center px-4"
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100vh',
            opacity: 0,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Main loader design */}
          <div className="text-center flex flex-col items-center">
            {/* Custom futuristic SVG Logo for LSS */}
            <motion.div
              className="relative w-28 h-28 mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Outer glowing orbital rings */}
              <div className="absolute inset-0 rounded-full border border-dashed border-primary-cyan animate-spin [animation-duration:12s] opacity-30" />
              <div className="absolute -inset-2 rounded-full border border-primary-violet opacity-10 blur-[6px] animate-pulse-slow" />
              
              {/* Actual SVG Logo mark */}
              <svg className="w-full h-full text-transparent" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {/* Modern Futuristic "LSS" Shape */}
                <g filter="url(#glow)">
                  {/* Outer Hexagon / shield element */}
                  <polygon
                    points="50,5 90,28 90,72 50,95 10,72 10,28"
                    stroke="url(#logoGrad)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray="300"
                    strokeDashoffset="0"
                    className="animate-pulse"
                  />
                  {/* Internal grid nodes */}
                  <circle cx="50" cy="50" r="2" fill="#06B6D4" />
                  {/* Custom LSS path style */}
                  {/* First 'L' */}
                  <path d="M30 35 V62 H42" stroke="url(#logoGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  {/* First 'S' */}
                  <path d="M54 35 H46 V47 H54 V60 H46" stroke="url(#logoGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  {/* Second 'S' */}
                  <path d="M68 35 H60 V47 H68 V60 H60" stroke="url(#logoGrad)" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                </g>
              </svg>
            </motion.div>

            {/* Ligand Software Solutions Text */}
            <motion.h1
              className="font-outfit text-2xl md:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-primary-violet via-primary-cyan to-primary-emerald bg-clip-text text-transparent mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              LIGAND SOFTWARE SOLUTIONS
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-slate-400 font-outfit text-sm tracking-widest uppercase mb-12 max-w-xs"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              "Exclusive Software for Innovative Minds"
            </motion.p>

            {/* Progress counter */}
            <div className="relative w-64 h-1 bg-dark-700 rounded-full overflow-hidden mb-4">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-violet to-primary-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <motion.span
              className="text-xs text-primary-cyan font-mono tracking-widest font-semibold"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              LOADING INFRASTRUCTURE... {progress}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
