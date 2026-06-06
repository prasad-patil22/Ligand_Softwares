import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  FolderKanban, 
  Briefcase, 
  MessageSquare, 
  Image as ImageIcon,
  Database
} from "lucide-react";

const SERVICES_API_URL = "http://localhost:8000/api/services";
const PROJECTS_API_URL = "http://localhost:8000/api/projects";
const TESTIMONIALS_API_URL = "http://localhost:8000/api/testimonials";
const TEAM_API_URL = "http://localhost:8000/api/team";
const GALLERY_API_URL = "http://localhost:8000/api/gallery";

export default function Overview() {
  const { admin } = useOutletContext();
  
  const [projectsCount, setProjectsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const fetchServices = fetch(SERVICES_API_URL).then(res => res.json());
        const fetchProjects = fetch(PROJECTS_API_URL).then(res => res.json());
        const fetchTestimonials = fetch(TESTIMONIALS_API_URL).then(res => res.json());
        const fetchTeam = fetch(TEAM_API_URL).then(res => res.json());
        const fetchGallery = fetch(GALLERY_API_URL).then(res => res.json());

        const [srv, prj, tst, tm, glr] = await Promise.all([
          fetchServices,
          fetchProjects,
          fetchTestimonials,
          fetchTeam,
          fetchGallery
        ]);

        setServicesCount(srv.services?.length || 0);
        setProjectsCount(prj.projects?.length || 0);
        setTestimonialsCount(tst.testimonials?.length || 0);
        setTeamCount(tm.team?.length || 0);
        setGalleryCount(glr.gallery?.length || 0);
      } catch (err) {
        console.error("Failed to load overview counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-8 animate-fade-in"
    >
      {/* Welcome Card */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 relative overflow-hidden bg-gradient-to-r from-dark-800 to-dark-900">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-violet/10 rounded-full blur-[70px] pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] font-mono tracking-widest text-primary-cyan uppercase">Control Center</span>
          <h2 className="font-outfit text-2xl md:text-3xl font-black text-white">
            Welcome Back, <span className="bg-gradient-to-r from-primary-violet to-primary-cyan bg-clip-text text-transparent">{admin?.name}</span>!
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            You are in the control interface of Ligand Software. Here you can control configurations, monitor user activities, and manage platform interactions.
          </p>
        </div>
      </div>

      {/* Metrics/Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Metric 1: Active Services */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Active Services</span>
            <h3 className="font-outfit text-2xl font-black text-white">{loading ? "..." : servicesCount}</h3>
            <span className="text-[10px] text-primary-emerald font-semibold">Live on Portal</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-emerald/10 border border-primary-emerald/15 flex items-center justify-center text-primary-emerald">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Client Projects */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Client Projects</span>
            <h3 className="font-outfit text-2xl font-black text-white">{loading ? "..." : projectsCount}</h3>
            <span className="text-[10px] text-primary-cyan font-semibold">Live on Portal</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-cyan/10 border border-primary-cyan/15 flex items-center justify-center text-primary-cyan">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Testimonials */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Testimonials</span>
            <h3 className="font-outfit text-2xl font-black text-white">{loading ? "..." : testimonialsCount}</h3>
            <span className="text-[10px] text-primary-cyan font-semibold">Live on Portal</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-violet/10 border border-primary-violet/15 flex items-center justify-center text-primary-violet">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4: Team Members */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Team Members</span>
            <h3 className="font-outfit text-2xl font-black text-white">{loading ? "..." : teamCount}</h3>
            <span className="text-[10px] text-primary-emerald font-semibold">Live on Portal</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-emerald/10 border border-primary-emerald/15 flex items-center justify-center text-primary-emerald">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 5: Gallery Albums */}
        <div className="glass-panel rounded-2xl p-5 border border-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Gallery Albums</span>
            <h3 className="font-outfit text-2xl font-black text-white">{loading ? "..." : galleryCount}</h3>
            <span className="text-[10px] text-primary-cyan font-semibold">Live on Portal</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary-violet/10 border border-primary-violet/15 flex items-center justify-center text-primary-violet">
            <ImageIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Additional Platform Status Section */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5 bg-dark-850/20">
        <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-primary-cyan" />
          <span>Database Status & Services</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between bg-dark-900/60 p-4 rounded-xl border border-white/5">
            <span className="text-xs text-slate-300">MongoDB Connection</span>
            <span className="text-[10px] font-bold text-primary-emerald bg-primary-emerald/10 border border-primary-emerald/20 px-2.5 py-0.5 rounded-full">Connected</span>
          </div>
          <div className="flex items-center justify-between bg-dark-900/60 p-4 rounded-xl border border-white/5">
            <span className="text-xs text-slate-300">Cloudinary Media Node</span>
            <span className="text-[10px] font-bold text-primary-emerald bg-primary-emerald/10 border border-primary-emerald/20 px-2.5 py-0.5 rounded-full">Operational</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
