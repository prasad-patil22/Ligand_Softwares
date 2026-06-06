import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const API_URL = "http://localhost:8000/api/admin";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    setPwLoading(true);

    if (newPassword !== confirmNewPassword) {
      setPwError("New passwords do not match.");
      setPwLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPwError("Password must be at least 6 characters long.");
      setPwLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setPwSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <motion.div
      key="password"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="max-w-md"
    >
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 bg-dark-800/80 space-y-6">
        <div className="space-y-1">
          <h2 className="font-outfit text-xl font-bold text-white uppercase tracking-wider">Change Password</h2>
          <p className="text-slate-400 text-xs">
            Update your account password securely. We recommend a password with at least 8 characters containing numbers and symbols.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type={showOldPw ? "text" : "password"}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                className="glass-input w-full pl-12 pr-12 py-2.5 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={() => setShowOldPw(!showOldPw)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showOldPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type={showNewPw ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="glass-input w-full pl-12 pr-12 py-2.5 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showNewPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400 block uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type={showConfirmPw ? "text" : "password"}
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                className="glass-input w-full pl-12 pr-12 py-2.5 rounded-xl text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showConfirmPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </div>

          {/* Alerts */}
          <AnimatePresence mode="wait">
            {pwError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-start gap-2"
              >
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{pwError}</span>
              </motion.div>
            )}

            {pwSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="p-3 rounded-xl bg-primary-emerald/10 border border-primary-emerald/20 text-primary-emerald text-xs font-semibold flex items-start gap-2"
              >
                <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
                <span>{pwSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={pwLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none"
          >
            {pwLoading ? (
              <span className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
