import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, FileText, ExternalLink, Trash2 } from "lucide-react";

const APPLICATIONS_API_URL = "https://ligand-softwares-328p.onrender.com/api/applications";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState("");

  const fetchApplications = async () => {
    setApplicationsLoading(true);
    setApplicationsError("");
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const response = await fetch(APPLICATIONS_API_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load applications");
      setApplications(data.applications || []);
    } catch (err) {
      setApplicationsError(err.message);
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDeleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to reject/delete this application?")) return;
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    try {
      const response = await fetch(`${APPLICATIONS_API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete application");
      fetchApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      key="applications"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="space-y-1">
        <h2 className="font-outfit text-2xl font-bold text-white uppercase tracking-wider">Job Applications</h2>
        <p className="text-slate-400 text-xs">
          Review candidate details, cover letters, and download/view uploaded resumes.
        </p>
      </div>

      <div className="space-y-4">
        {applicationsLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mb-4" />
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Loading applications...</span>
          </div>
        ) : applicationsError ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5" />
            <span>Error loading applications: {applicationsError}</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-white/5">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">No Applications Received</h4>
            <p className="text-xs text-slate-400">Applications submitted from the guest career modals will list here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((item) => (
              <div
                key={item._id}
                className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between gap-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-outfit text-base font-bold text-white tracking-wide">
                        {item.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary-cyan/10 border border-primary-cyan/35 text-[9px] font-mono font-bold text-primary-cyan uppercase">
                        {item.jobTitle}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-400 font-mono mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Email:</span>
                        <span className="text-slate-300">{item.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Phone:</span>
                        <span className="text-slate-300">{item.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Submitted:</span>
                        <span className="text-slate-300">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {item.coverLetter && (
                      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-xs text-slate-300 leading-relaxed max-w-4xl">
                        <strong className="text-slate-500 font-mono block mb-1 uppercase tracking-wider text-[10px]">Cover Letter / Note:</strong>
                        {item.coverLetter}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 justify-end md:justify-start">
                    <a
                      href={item.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 md:flex-none py-2 px-4 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold text-xs uppercase tracking-wider text-center hover:shadow-glow-cyan/15 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Resume</span>
                    </a>
                    <button
                      onClick={() => handleDeleteApplication(item._id)}
                      className="flex-1 md:flex-none py-2 px-4 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
