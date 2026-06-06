import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Upload, ExternalLink, Edit3, Trash2, AlertCircle } from "lucide-react";

const PROJECTS_API_URL = "https://ligand-softwares-328p.onrender.com/api/projects";

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null); // null if adding
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectImage, setProjectImage] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fetchProjects = async () => {
    setProjectsLoading(true);
    setProjectsError("");
    try {
      const response = await fetch(PROJECTS_API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load projects");
      setProjects(data.projects || []);
    } catch (err) {
      setProjectsError(err.message);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenAddProjectForm = () => {
    setEditingProjectId(null);
    setProjectName("");
    setProjectDesc("");
    setProjectImage("");
    setProjectLink("");
    setShowProjectForm(true);
  };

  const handleEditProjectClick = (project) => {
    setEditingProjectId(project._id);
    setProjectName(project.name);
    setProjectDesc(project.desc);
    setProjectImage(project.image);
    setProjectLink(project.link);
    setShowProjectForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client project?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${PROJECTS_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete project");

      fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleImageFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      setIsUploading(true);
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`${PROJECTS_API_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ image: reader.result })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setProjectImage(data.url);
      } catch (err) {
        alert(err.message);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();

    if (!projectName.trim() || !projectDesc.trim() || !projectImage.trim() || !projectLink.trim()) {
      alert("Please fill in all fields (upload a file or input an image URL).");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingProjectId 
        ? `${PROJECTS_API_URL}/${editingProjectId}`
        : PROJECTS_API_URL;
      
      const method = editingProjectId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: projectName,
          desc: projectDesc,
          image: projectImage,
          link: projectLink
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save project");

      setProjectName("");
      setProjectDesc("");
      setProjectImage("");
      setProjectLink("");
      setEditingProjectId(null);
      setShowProjectForm(false);

      fetchProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      key="projects"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-xl font-bold text-white uppercase tracking-wider">Dynamic Client Projects</h2>
          <p className="text-slate-400 text-xs">Create, update, and manage Featured Client Projects that populate the portfolio timeline on the About Us page.</p>
        </div>
        {!showProjectForm && (
          <button
            onClick={handleOpenAddProjectForm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/20 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        )}
      </div>

      {/* Project Form card */}
      {showProjectForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-panel rounded-2xl p-6 border border-white/5 bg-dark-800/90 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">
              {editingProjectId ? "Edit Client Project details" : "Create New Client Project Card"}
            </h3>
            <button
              onClick={() => setShowProjectForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleSaveProject} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., College Website"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Target Link URL *</label>
                <input
                  type="url"
                  required
                  placeholder="e.g., http://www.example.com"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>

            {/* Image Upload Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase">Upload Screenshot *</label>
                <div className="border border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.03] transition-all relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <Upload className="w-6 h-6 text-primary-cyan mb-2" />
                  <span className="text-xs text-slate-300 font-medium">
                    {isUploading ? "Uploading file..." : "Click to select screenshot image"}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">Image size max 5MB</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Or Paste Direct Image Link</label>
                <input
                  type="text"
                  placeholder="e.g., https://images.unsplash.com/..."
                  value={projectImage}
                  onChange={(e) => setProjectImage(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm mb-2"
                />
                {projectImage && (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden border border-white/10 bg-slate-950">
                    <img src={projectImage} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setProjectImage("")}
                      className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white hover:bg-black/85 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Project Description *</label>
              <textarea
                required
                rows="4"
                placeholder="Describe the solution engineered for this client..."
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowProjectForm(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {editingProjectId ? "Save Changes" : "Register Project"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Projects Table List */}
      {projectsLoading ? (
        <div className="py-12 flex justify-center items-center">
          <span className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projectsError ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{projectsError}</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="p-8 text-center glass-panel rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm">No client projects found in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-800/40 relative overflow-hidden group hover:border-primary-cyan/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Image Preview */}
                <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 bg-slate-950 shrink-0">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white mb-1 tracking-wide flex items-center gap-1.5">
                    <span>{project.name}</span>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-primary-cyan hover:text-white">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed truncate-2-lines max-w-xl">{project.desc}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0 shrink-0">
                <button
                  onClick={() => handleEditProjectClick(project)}
                  className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-primary-cyan hover:text-white transition-colors cursor-pointer"
                  title="Edit Project"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="p-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                  title="Delete Project"
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
