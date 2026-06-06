import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

const {
  LayoutDashboard,
  KeyRound,
  Settings: SettingsIcon,
  LogOut,
  Users,
  MessageSquare,
  FileText,
  Briefcase,
  FolderKanban,
  Image: ImageIcon,
  BookOpen,
  Menu,
  X
} = Icons;

const API_URL = "http://localhost:8000/api/admin";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Session expired");
        }

        setAdmin(data.admin);
      } catch (err) {
        console.error("Profile load failed:", err);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/login");
  };

  // Helper to determine active tab title for breadcrumbs
  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") return "Overview";
    if (path.includes("/services")) return "Manage Services";
    if (path.includes("/projects")) return "Manage Projects";
    if (path.includes("/testimonials")) return "Manage Testimonials";
    if (path.includes("/team")) return "Manage Team";
    if (path.includes("/gallery")) return "Manage Gallery";
    if (path.includes("/courses")) return "Manage Courses";
    if (path.includes("/careers")) return "Manage Careers";
    if (path.includes("/applications")) return "Job Applications";
    if (path.includes("/messages")) return "Contact Messages";
    if (path.includes("/password")) return "Change Password";
    if (path.includes("/settings")) return "Console Settings";
    return "Dashboard";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center font-inter">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">Verifying Admin Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-dark-900 text-slate-100 font-inter flex flex-col md:flex-row overflow-hidden relative">
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-dark-950/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-dark-950/95 md:bg-dark-950/40 border-r border-white/5 p-6 flex flex-col gap-6 transition-transform duration-300 md:translate-x-0 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } shrink-0 overflow-y-auto`}>
        
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-violet/20 to-primary-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg viewBox="0 0 100 100" className="w-6 h-6 relative z-10">
              <defs>
                <linearGradient id="sidebarLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
                </linearGradient>
              </defs>
              <polygon
                points="50,8 88,30 88,70 50,92 12,70 12,30"
                stroke="url(#sidebarLogoGrad)"
                strokeWidth="5"
                fill="none"
              />
              <circle cx="50" cy="50" r="3" fill="#06B6D4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-outfit text-sm font-black tracking-wider text-white uppercase">
              LIGAND ADMIN
            </span>
            <span className="text-[9px] font-mono tracking-wider text-primary-cyan uppercase">
              Console Panel
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2">
          <NavLink
            to="/admin"
            end
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>Overview</span>
          </NavLink>

          <NavLink
            to="/admin/services"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Briefcase className="w-4.5 h-4.5" />
            <span>Manage Services</span>
          </NavLink>

          <NavLink
            to="/admin/projects"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <FolderKanban className="w-4.5 h-4.5" />
            <span>Manage Projects</span>
          </NavLink>

          <NavLink
            to="/admin/testimonials"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>Manage Testimonials</span>
          </NavLink>

          <NavLink
            to="/admin/team"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>Manage Team</span>
          </NavLink>

          <NavLink
            to="/admin/gallery"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <ImageIcon className="w-4.5 h-4.5" />
            <span>Manage Gallery</span>
          </NavLink>

          <NavLink
            to="/admin/courses"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <BookOpen className="w-4.5 h-4.5" />
            <span>Manage Courses</span>
          </NavLink>

          <NavLink
            to="/admin/careers"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Briefcase className="w-4.5 h-4.5" />
            <span>Manage Careers</span>
          </NavLink>

          <NavLink
            to="/admin/applications"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            <span>Job Applications</span>
          </NavLink>

          <NavLink
            to="/admin/messages"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>Contact Messages</span>
          </NavLink>

          <NavLink
            to="/admin/password"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <KeyRound className="w-4.5 h-4.5" />
            <span>Change Password</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-gradient-to-r from-primary-violet/15 to-primary-cyan/15 border border-primary-cyan/35 text-primary-cyan shadow-glow-cyan/5"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <SettingsIcon className="w-4.5 h-4.5" />
            <span>Console Settings</span>
          </NavLink>
        </nav>

        {/* User Profile Summary */}
        <div className="border-t border-white/5 pt-6 flex flex-col gap-4 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-violet to-primary-cyan flex items-center justify-center font-bold text-dark-900 text-sm">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-white truncate">{admin?.name}</span>
              <span className="text-[10px] text-slate-400 truncate">{admin?.email}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-slate-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-grow h-screen flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-white/5 px-6 md:px-8 flex items-center justify-between shrink-0 bg-dark-900/60 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-5 h-5">
                <polygon
                  points="50,8 88,30 88,70 50,92 12,70 12,30"
                  stroke="url(#sidebarLogoGrad)"
                  strokeWidth="6"
                  fill="none"
                />
              </svg>
            </div>
            <span className="font-outfit text-sm font-black tracking-wider text-white">LIGAND PANEL</span>
          </div>

          <div className="hidden md:block">
            <h1 className="font-outfit text-xl font-bold tracking-tight text-white capitalize">
              Dashboard / {getBreadcrumbTitle()}
            </h1>
          </div>

          {/* User badge */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-slate-400 bg-white/5 border border-white/5 py-1 px-3 rounded-full hidden sm:block">
              Status: <span className="text-primary-emerald font-bold animate-pulse">Online</span>
            </span>

            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="md:hidden flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Panel Main content container */}
        <div className="flex-grow p-6 md:p-8 max-w-5xl w-full mx-auto overflow-y-auto">
          <AnimatePresence mode="wait">
            <Outlet context={{ admin }} />
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
