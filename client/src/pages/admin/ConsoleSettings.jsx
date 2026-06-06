import React from "react";
import { motion } from "framer-motion";

export default function ConsoleSettings() {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 bg-dark-800/80 space-y-6">
        <div>
          <h2 className="font-outfit text-xl font-bold text-white uppercase tracking-wider">Console Configurations</h2>
          <p className="text-slate-400 text-xs">
            Adjust dashboard preference and security configurations.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-dark-900/50 border border-white/5">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-white">System Logs</span>
              <span className="text-[10px] text-slate-400">Keep activity traces on the server</span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <div className="w-11 h-6 bg-primary-violet/20 border border-primary-violet/30 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-primary-cyan after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </div>
          </div>

          <div className="flex inline-flex items-center justify-between p-4 rounded-xl bg-dark-900/50 border border-white/5 w-full">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-white">Strict JWT Session Mode</span>
              <span className="text-[10px] text-slate-400">Auto-expire tokens after 24 hours</span>
            </div>
            <div className="relative inline-flex items-center cursor-pointer">
              <div className="w-11 h-6 bg-primary-cyan/20 border border-primary-cyan/35 rounded-full after:content-[''] after:absolute after:top-[4px] after:right-[4px] after:bg-primary-cyan after:rounded-full after:h-4 after:w-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
