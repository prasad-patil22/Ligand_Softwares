import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Edit3, Trash2, AlertCircle, Code } from "lucide-react";
import * as Icons from "lucide-react";

const SERVICES_API_URL = "http://localhost:8000/api/services";

// Dynamic Icon Component
const DynamicIcon = ({ name, className }) => {
  const IconComponent = Icons[name];
  if (!IconComponent) return <Code className={className} />;
  return <IconComponent className={className} />;
};

const POPULAR_ICONS = [
  "Cloud",
  "ShieldAlert",
  "Cpu",
  "Smartphone",
  "Layers",
  "Globe",
  "Database",
  "Terminal",
  "Zap",
  "Code",
  "Grid",
  "Lock",
  "Activity",
  "BookOpen",
  "Briefcase",
  "Award"
];

export default function ManageServices() {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState("");
  
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null if adding
  const [serviceNumber, setServiceNumber] = useState("");
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceIcon, setServiceIcon] = useState("Code");
  const [customIcon, setCustomIcon] = useState("");

  const fetchServices = async () => {
    setServicesLoading(true);
    setServicesError("");
    try {
      const response = await fetch(SERVICES_API_URL);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load services");
      setServices(data.services || []);
    } catch (err) {
      setServicesError(err.message);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAddForm = () => {
    setEditingId(null);
    setServiceNumber("");
    setServiceTitle("");
    setServiceDescription("");
    setServiceIcon("Code");
    setCustomIcon("");
    setShowServiceForm(true);
  };

  const handleEditClick = (service) => {
    setEditingId(service._id);
    setServiceNumber(service.number);
    setServiceTitle(service.title);
    setServiceDescription(service.description);
    
    if (POPULAR_ICONS.includes(service.icon)) {
      setServiceIcon(service.icon);
      setCustomIcon("");
    } else {
      setServiceIcon("Code");
      setCustomIcon(service.icon);
    }
    
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${SERVICES_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete service");

      fetchServices();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    const finalIcon = customIcon.trim() || serviceIcon;

    if (!serviceNumber.trim() || !serviceTitle.trim() || !serviceDescription.trim() || !finalIcon.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingId 
        ? `${SERVICES_API_URL}/${editingId}`
        : SERVICES_API_URL;
      
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          number: serviceNumber,
          title: serviceTitle,
          description: serviceDescription,
          icon: finalIcon
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save service");

      setServiceNumber("");
      setServiceTitle("");
      setServiceDescription("");
      setServiceIcon("Code");
      setCustomIcon("");
      setEditingId(null);
      setShowServiceForm(false);

      fetchServices();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      key="services"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-xl font-bold text-white uppercase tracking-wider">Dynamic Services List</h2>
          <p className="text-slate-400 text-xs">Create, update, and manage the services that are visible to customers on the landing homepage.</p>
        </div>
        {!showServiceForm && (
          <button
            onClick={handleOpenAddForm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/20 hover:scale-105 transition-all duration-300 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        )}
      </div>

      {/* Service Form card */}
      {showServiceForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-panel rounded-2xl p-6 border border-white/5 bg-dark-800/90 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-outfit text-sm font-bold uppercase tracking-wider text-white">
              {editingId ? "Edit Service Properties" : "Create New Service Card"}
            </h3>
            <button
              onClick={() => setShowServiceForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <form onSubmit={handleSaveService} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Card Index / Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 07"
                  value={serviceNumber}
                  onChange={(e) => setServiceNumber(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Artificial Intelligence"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Select Popular Icon</label>
                <select
                  value={serviceIcon}
                  onChange={(e) => setServiceIcon(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm bg-dark-800"
                >
                  {POPULAR_ICONS.map((ico) => (
                    <option key={ico} value={ico}>
                      {ico}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Or Custom Lucide Icon Name</label>
                <input
                  type="text"
                  placeholder="e.g., BrainCircuit"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1 uppercase">Service Description *</label>
              <textarea
                required
                rows="4"
                placeholder="Describe the service offering..."
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                className="glass-input w-full px-4 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowServiceForm(false)}
                className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold tracking-wider text-xs uppercase cursor-pointer hover:shadow-glow-violet/25 hover:scale-[1.02] transition-all"
              >
                {editingId ? "Save Changes" : "Create Card"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Services Table List */}
      {servicesLoading ? (
        <div className="py-12 flex justify-center items-center">
          <span className="w-8 h-8 border-2 border-primary-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      ) : servicesError ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{servicesError}</span>
        </div>
      ) : services.length === 0 ? (
        <div className="p-8 text-center glass-panel rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm">No services found in database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-800/40 relative overflow-hidden group hover:border-primary-cyan/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4 min-w-0">
                <span className="font-mono text-xl font-black text-primary-cyan/60 shrink-0 select-none">
                  {service.number}
                </span>
                
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary-cyan shrink-0">
                  <DynamicIcon name={service.icon} className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white mb-1 tracking-wide">{service.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed truncate-2-lines max-w-xl">{service.description}</p>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end border-t border-white/5 sm:border-0 pt-3 sm:pt-0 shrink-0">
                <button
                  onClick={() => handleEditClick(service)}
                  className="p-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-primary-cyan hover:text-white transition-colors cursor-pointer"
                  title="Edit Service"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(service._id)}
                  className="p-2.5 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
                  title="Delete Service"
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
