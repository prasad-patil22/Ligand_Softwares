import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

const API_URL = "https://ligand-softwares-328p.onrender.com/api/admin";

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if admin is already logged in
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation
    if (activeTab === "register") {
      if (!name.trim()) {
        setError("Please enter your name.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = activeTab === "login" ? `${API_URL}/login` : `${API_URL}/register`;
      const payload = activeTab === "login" 
        ? { email, password }
        : { name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSuccess(activeTab === "login" ? "Login successful! Redirecting..." : "Registration successful! Redirecting...");
      
      // Store auth state
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));

      // Redirect after animation
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-dark-900 px-4">
      {/* Dynamic Aesthetic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-violet/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-cyan/10 rounded-full blur-[120px] animate-pulse-slow" />
      
      <div className="w-full max-w-md z-10">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative flex items-center justify-center">
            <svg className="w-full h-full text-transparent" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
                </linearGradient>
              </defs>
              <polygon
                points="50,8 88,30 88,70 50,92 12,70 12,30"
                stroke="url(#logoGrad)"
                strokeWidth="4"
                fill="none"
              />
              <circle cx="50" cy="50" r="3" fill="#06B6D4" />
              <path d="M32 38 V62 H44" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M54 38 H46 V47 H54 V59 H46" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M68 38 H60 V47 H68 V59 H60" stroke="url(#logoGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h2 className="font-outfit text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-primary-cyan bg-clip-text text-transparent">
            LIGAND SOFTWARE
          </h2>
          <p className="text-slate-400 font-mono text-xs mt-2 uppercase tracking-widest">
            Admin Authentication Control
          </p>
        </div>

        {/* Auth Glass Panel Card */}
        <div className="glass-panel rounded-3xl p-8 border border-white/5 shadow-glass-lg bg-dark-800/85">
          {/* Tab Selector */}
          <div className="flex bg-dark-900/60 p-1 rounded-2xl mb-8 border border-white/5">
            <button
              onClick={() => handleTabChange("login")}
              className={`flex-1 py-2.5 text-xs font-bold font-outfit uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 shadow-glow-violet/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleTabChange("register")}
              className={`flex-1 py-2.5 text-xs font-bold font-outfit uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                activeTab === "register"
                  ? "bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 shadow-glow-violet/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {activeTab === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter admin name"
                      className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="glass-input w-full pl-12 pr-4 py-3 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full pl-12 pr-12 py-3 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {activeTab === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="glass-input w-full pl-12 pr-12 py-3 rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error and Success Indicators */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-start gap-2"
                >
                  <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 rounded-xl bg-primary-emerald/10 border border-primary-emerald/20 text-primary-emerald text-xs font-semibold flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{activeTab === "login" ? "Sign In" : "Register Admin"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
