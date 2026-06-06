import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  X, 
  Upload, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Copy,
  Linkedin,
  Twitter,
  Github 
} from "lucide-react";

const TEAM_API_URL = "https://ligand-softwares-328p.onrender.com/api/team";

export default function ManageTeam() {
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState("");

  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamMemberId, setEditingTeamMemberId] = useState(null); // null if adding
  const [teamMemberName, setTeamMemberName] = useState("");
  const [teamMemberRole, setTeamMemberRole] = useState("");
  const [teamMemberExperience, setTeamMemberExperience] = useState("");
  const [teamMemberImage, setTeamMemberImage] = useState("");
  const [teamMemberLinkedin, setTeamMemberLinkedin] = useState("");
  const [teamMemberTwitter, setTeamMemberTwitter] = useState("");
  const [teamMemberGithub, setTeamMemberGithub] = useState("");
  const [teamMemberIsExecutive, setTeamMemberIsExecutive] = useState(false);
  const [teamMemberOrder, setTeamMemberOrder] = useState("");
  const [isUploadingTeamMember, setIsUploadingTeamMember] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  const fetchTeam = async () => {
    setTeamLoading(true);
    setTeamError("");
    try {
      const response = await fetch(TEAM_API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load team");
      setTeam(data.team || []);
    } catch (err) {
      setTeamError(err.message);
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenAddTeamForm = () => {
    setEditingTeamMemberId(null);
    setTeamMemberName("");
    setTeamMemberRole("");
    setTeamMemberExperience("");
    setTeamMemberImage("");
    setTeamMemberLinkedin("");
    setTeamMemberTwitter("");
    setTeamMemberGithub("");
    setTeamMemberIsExecutive(false);
    setTeamMemberOrder("");
    setShowTeamForm(true);
  };

  const handleEditTeamMemberClick = (member) => {
    setEditingTeamMemberId(member._id);
    setTeamMemberName(member.name);
    setTeamMemberRole(member.role);
    setTeamMemberExperience(member.experience);
    setTeamMemberImage(member.image);
    setTeamMemberLinkedin(member.socials?.linkedin || "");
    setTeamMemberTwitter(member.socials?.twitter || "");
    setTeamMemberGithub(member.socials?.github || "");
    setTeamMemberIsExecutive(member.isExecutive || false);
    setTeamMemberOrder(member.order || "");
    setShowTeamForm(true);
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${TEAM_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete team member");

      fetchTeam();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTeamImageFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setIsUploadingTeamMember(true);
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${TEAM_API_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ image: reader.result })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setTeamMemberImage(data.url);
      } catch (err) {
        alert(err.message);
      } finally {
        setIsUploadingTeamMember(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTeamMember = async (e) => {
    e.preventDefault();

    if (!teamMemberName.trim() || !teamMemberRole.trim() || !teamMemberExperience.trim() || !teamMemberImage.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingTeamMemberId 
        ? `${TEAM_API_URL}/${editingTeamMemberId}`
        : TEAM_API_URL;
      
      const method = editingTeamMemberId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: teamMemberName,
          role: teamMemberRole,
          experience: teamMemberExperience,
          image: teamMemberImage,
          order: teamMemberOrder ? Number(teamMemberOrder) : undefined,
          isExecutive: teamMemberIsExecutive,
          socials: {
            linkedin: teamMemberLinkedin,
            twitter: teamMemberTwitter,
            github: teamMemberGithub
          }
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save team member");

      setTeamMemberName("");
      setTeamMemberRole("");
      setTeamMemberExperience("");
      setTeamMemberImage("");
      setTeamMemberLinkedin("");
      setTeamMemberTwitter("");
      setTeamMemberGithub("");
      setTeamMemberIsExecutive(false);
      setTeamMemberOrder("");
      setEditingTeamMemberId(null);
      setShowTeamForm(false);

      fetchTeam();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      key="team"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-xl font-bold text-white uppercase tracking-wider">Dynamic Technical Leadership / Team</h2>
          <p className="text-slate-400 text-xs">Create, update, and manage team members that populate the Meet Our Team section on the Team page.</p>
        </div>
        {!showTeamForm && (
          <button
            onClick={handleOpenAddTeamForm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/20 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* AI Background Generator Prompt Tool */}
      <div className="glass-panel rounded-2xl p-5 border border-white/5 bg-gradient-to-r from-primary-violet/5 to-primary-cyan/5 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold tracking-widest text-primary-cyan bg-primary-cyan/15 px-2.5 py-0.5 rounded-full uppercase">
            AI Background Prompt Tool
          </span>
          <h3 className="text-sm font-bold text-white tracking-wide">Generate Uniform Portrait Backgrounds</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use the prompt below with AI tools (such as Photoshop Generative Fill, Midjourney, or DALL-E) to generate identical, design-suitable backgrounds for all team member images without changing their face, dress, and body personality.
          </p>
          <div className="mt-3 bg-dark-900/80 border border-white/5 rounded-xl p-3.5 text-[11px] font-mono text-slate-300 select-all leading-normal relative group">
            "Futuristic tech office workspace background, professional dark studio portrait background with subtle ambient neon cyan and violet lighting, clean minimalist glassmorphism elements, high-end bokeh effect, professional depth of field. Keep the subject's face, hair, clothing, dress, expression, pose, and body personality completely unchanged. Only replace the background behind the subject."
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`"Futuristic tech office workspace background, professional dark studio portrait background with subtle ambient neon cyan and violet lighting, clean minimalist glassmorphism elements, high-end bokeh effect, professional depth of field. Keep the subject's face, hair, clothing, dress, expression, pose, and body personality completely unchanged. Only replace the background behind the subject."`);
            setPromptCopied(true);
            setTimeout(() => setPromptCopied(false), 2000);
          }}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 self-stretch md:self-auto justify-center cursor-pointer shrink-0 ${
            promptCopied
              ? "bg-primary-emerald text-dark-900"
              : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-200"
          }`}
        >
          {promptCopied ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-primary-cyan" />
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>

      {/* Team Member Form Card */}
      {showTeamForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-panel rounded-2xl p-6 border border-white/5 bg-dark-800/90 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">
              {editingTeamMemberId ? "Edit Team Member Details" : "Create New Team Member Profile"}
            </h3>
            <button
              onClick={() => setShowTeamForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleSaveTeamMember} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Abhishek Belavi"
                  value={teamMemberName}
                  onChange={(e) => setTeamMemberName(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Role / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Founder"
                  value={teamMemberRole}
                  onChange={(e) => setTeamMemberRole(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Experience String *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 14+ Years Experience"
                  value={teamMemberExperience}
                  onChange={(e) => setTeamMemberExperience(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Sort Order Rank</label>
                <input
                  type="number"
                  placeholder="e.g., 1 (Founder first)"
                  value={teamMemberOrder}
                  onChange={(e) => setTeamMemberOrder(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center pt-6 pl-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={teamMemberIsExecutive}
                    onChange={(e) => setTeamMemberIsExecutive(e.target.checked)}
                    className="w-4 h-4 rounded border-white/10 bg-dark-900 text-primary-cyan focus:ring-primary-cyan cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-300 uppercase">Executive Leader</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">LinkedIn URL</label>
                <input
                  type="text"
                  placeholder="e.g., https://linkedin.com/in/username"
                  value={teamMemberLinkedin}
                  onChange={(e) => setTeamMemberLinkedin(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Twitter URL</label>
                <input
                  type="text"
                  placeholder="e.g., https://twitter.com/username"
                  value={teamMemberTwitter}
                  onChange={(e) => setTeamMemberTwitter(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">GitHub URL</label>
                <input
                  type="text"
                  placeholder="e.g., https://github.com/username"
                  value={teamMemberGithub}
                  onChange={(e) => setTeamMemberGithub(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Image Upload Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Upload Member Photo *</label>
                <div className="border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.03] transition-all relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleTeamImageFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploadingTeamMember}
                  />
                  <Upload className="w-6 h-6 text-primary-cyan mb-2" />
                  <span className="text-xs text-slate-300 font-medium">
                    {isUploadingTeamMember ? "Uploading photo..." : "Click to select photo"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Image size max 5MB</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Or Paste Direct Photo URL</label>
                <input
                  type="text"
                  placeholder="e.g., https://images.unsplash.com/..."
                  value={teamMemberImage}
                  onChange={(e) => setTeamMemberImage(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm mb-2"
                />
                {teamMemberImage && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center">
                    <img
                      src={teamMemberImage}
                      alt="Member Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setTeamMemberImage("")}
                      className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowTeamForm(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploadingTeamMember}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {editingTeamMemberId ? "Save Changes" : "Register Member"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Team Members List */}
      {teamLoading ? (
        <div className="py-12 flex justify-center items-center">
          <span className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : teamError ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{teamError}</span>
        </div>
      ) : team.length === 0 ? (
        <div className="p-8 text-center glass-panel rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm">No team members found in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {team.map((member) => (
            <div
              key={member._id}
              className={`glass-panel rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-800/40 relative overflow-hidden group transition-all duration-300 ${
                member.isExecutive ? "border-primary-cyan/35" : "border-white/5"
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Photo Preview */}
                <div className="w-12 h-16 rounded-lg overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white mb-0.5 tracking-wide flex items-center gap-2">
                    <span>{member.name}</span>
                    {member.isExecutive && (
                      <span className="text-[9px] font-mono font-extrabold bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 px-1.5 py-0.5 rounded uppercase">Exec</span>
                    )}
                  </h4>
                  <p className="text-[10px] font-mono text-primary-cyan mb-1">{member.role}</p>
                  <p className="text-[10px] text-slate-400 font-mono mb-2">{member.experience} (Order: {member.order || 0})</p>
                  
                  {/* Socials tags */}
                  <div className="flex gap-2">
                    {member.socials?.linkedin && <span className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5"><Linkedin className="w-2.5 h-2.5" /> ✔</span>}
                    {member.socials?.twitter && <span className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5"><Twitter className="w-2.5 h-2.5" /> ✔</span>}
                    {member.socials?.github && <span className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5"><Github className="w-2.5 h-2.5" /> ✔</span>}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0 shrink-0">
                <button
                  onClick={() => handleEditTeamMemberClick(member)}
                  className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-primary-cyan hover:text-white transition-colors cursor-pointer"
                  title="Edit Member"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTeamMember(member._id)}
                  className="p-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                  title="Delete Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
