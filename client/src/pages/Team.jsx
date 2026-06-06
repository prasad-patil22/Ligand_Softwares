import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github, Briefcase, Award } from 'lucide-react';
import { teamData } from '../data/mockData';

export default function Team() {
  const [team, setTeam] = useState(teamData);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch("https://ligand-softwares-328p.onrender.com/api/team");
        const data = await response.json();
        if (response.ok && data.team && data.team.length > 0) {
          setTeam(data.team);
        }
      } catch (err) {
        console.error("Failed to load team members, using mock fallback data:", err);
      }
    };
    fetchTeam();
  }, []);

  // Helper check for active links
  const cleanLink = (url) => url && url.trim() !== "" && url.trim() !== "#";
  const hasLinks = (member) => {
    if (!member.socials) return false;
    const { linkedin, twitter, github } = member.socials;
    return cleanLink(linkedin) || cleanLink(twitter) || cleanLink(github);
  };

  // Sort: Executives (isExecutive || id <= 2) first, then by order, then by id/createdAt
  const sortedTeam = [...team].sort((a, b) => {
    const aExec = a.isExecutive || a.id <= 2 ? 1 : 0;
    const bExec = b.isExecutive || b.id <= 2 ? 1 : 0;
    if (aExec !== bExec) return bExec - aExec;

    const aOrder = a.order !== undefined ? a.order : (a.id || 999);
    const bOrder = b.order !== undefined ? b.order : (b.id || 999);
    return aOrder - bOrder;
  });

  return (
    <div className="relative min-h-screen pt-32 pb-24">
      {/* Background glow spots */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary-violet/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-primary-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block">
            Technical Leadership
          </span>
          <h1 className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-6">
            Meet Our Team
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Promoted by seasoned Engineers and Technocrats having rich experience in the global software industry and government consultancy programs.
          </p>
        </div>

        {/* Unified Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedTeam.map((member, idx) => {
            const isExecutive = member.isExecutive || member.id <= 2; // Founder & Co-Founder
            const memberHasLinks = hasLinks(member);

            const baseBorderClass = isExecutive ? 'border-primary-cyan/30 shadow-glow-cyan/5' : 'border-white/5';
            const hoverBorderClass = memberHasLinks
              ? (isExecutive ? 'hover:border-primary-cyan/60 hover:shadow-glow-cyan/15' : 'hover:border-primary-violet/30 hover:shadow-glow-violet/10')
              : '';

            return (
              <motion.div
                key={member._id || member.id}
                className={`glass-panel rounded-2xl overflow-hidden border relative group flex flex-col justify-between transition-all duration-300 ${baseBorderClass} ${hoverBorderClass}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={memberHasLinks ? { y: -6 } : {}}
              >
                {/* Executive Leader badge */}
                {isExecutive && (
                  <span className="absolute top-4 left-4 z-20 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 text-[10px] font-mono font-extrabold shadow-glow-violet/20">
                    <Award className="w-3 h-3" />
                    EXECUTIVE
                  </span>
                )}

                {/* Profile Cover Image */}
                <div className="relative h-64 overflow-hidden bg-dark-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full object-cover transition-all duration-500 ${memberHasLinks ? 'group-hover:scale-105' : ''}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                  {/* Subtle bottom shading gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Social Icons Overlay */}
                  {memberHasLinks && (
                    <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      {cleanLink(member.socials?.linkedin) && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-primary-cyan hover:text-dark-900 transition-all cursor-pointer"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {cleanLink(member.socials?.twitter) && (
                        <a
                          href={member.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-primary-cyan hover:text-dark-900 transition-all cursor-pointer"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {cleanLink(member.socials?.github) && (
                        <a
                          href={member.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-primary-cyan hover:text-dark-900 transition-all cursor-pointer"
                          aria-label="Github"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Details card body */}
                <div className="p-6 flex-grow flex flex-col justify-between bg-dark-800/10">
                  <div>
                    {/* Name */}
                    <h3 className={`font-outfit font-extrabold text-white text-lg tracking-wide mb-1 transition-colors duration-200 ${memberHasLinks ? 'group-hover:text-primary-cyan' : ''}`}>
                      {member.name}
                    </h3>
                    
                    {/* Role */}
                    <p className="text-primary-violet font-semibold text-xs uppercase tracking-wider mb-4 font-outfit">
                      {member.role}
                    </p>
                  </div>

                  {/* Experience with Icon */}
                  <div className="flex items-center gap-2 border-t border-white/5 pt-4 mt-2">
                    <Briefcase className="w-4 h-4 text-primary-cyan flex-shrink-0" />
                    <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                      {member.experience}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
