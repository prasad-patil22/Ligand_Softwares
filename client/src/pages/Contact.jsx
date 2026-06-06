import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [status, setStatus] = useState(null); // 'SUCCESS', 'ERROR'
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.ok) {
          setStatus('SUCCESS');
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } else {
          setStatus('ERROR');
          console.error("Submission failed:", data.error);
        }
      } catch (err) {
        setStatus('ERROR');
        console.error("Submission error:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setStatus(null), 5000);
      }
    } else {
      setStatus('ERROR');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24">
      {/* Background glow spots */}
      <div className="absolute top-[10%] right-[-10%] w-[450px] h-[450px] bg-primary-violet/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] bg-primary-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="font-mono text-xs font-bold text-primary-cyan tracking-widest uppercase mb-3 block">
            Get in touch
          </span>
          <h1 className="font-outfit text-4xl md:text-5xl font-extrabold text-white mb-6">
            Contact Ligand Software Solutions
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Have a project in mind or want to join our software training programs? Reach out, and our consulting team will connect shortly.
          </p>
        </div>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
          
          {/* Contact Details (Left) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-outfit text-2xl font-bold text-white mb-6">
              Contact Information
            </h2>
            
            {/* Address */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-cyan/10 border border-primary-cyan/20 flex items-center justify-center text-primary-cyan flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-white text-sm uppercase tracking-wide mb-1">
                  Our Location
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Ligand Software Solutions,<br />
                  KWALI PLOT, Sankeshwar,<br />
                  Karnataka - 591313, India
                </p>
              </div>
            </div>

            {/* Hotlines */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-violet/10 border border-primary-violet/20 flex items-center justify-center text-primary-violet flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-white text-sm uppercase tracking-wide mb-1">
                  Phone Numbers
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  +91 8722585715<br />
                  +91 8147322769
                </p>
              </div>
            </div>

            {/* Emails */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-emerald/10 border border-primary-emerald/20 flex items-center justify-center text-primary-emerald flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-white text-sm uppercase tracking-wide mb-1">
                  Email Support
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-mono">
                  info@ligandsolutions.com<br />
                  support@ligandsolutions.com
                </p>
              </div>
            </div>

            {/* Timings */}
            <div className="glass-panel rounded-2xl p-6 border border-white/5 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-white text-sm uppercase tracking-wide mb-1">
                  Office Hours
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  Monday - Saturday: 8:00 AM - 8:00 PM<br />
                  Sunday: 9:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-8 border border-white/10 relative group">
            {/* Border glow */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-violet to-primary-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <h2 className="font-outfit text-2xl font-bold text-white mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-2 uppercase">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter name"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-2 uppercase">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-2 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-2 uppercase">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    className="glass-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-2 uppercase">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us about your project requirements or training enquiries..."
                  className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold font-outfit tracking-wider text-xs uppercase hover:shadow-glow-violet/20 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{loading ? "Sending..." : "Submit Message"}</span>
              </button>
            </form>

            <AnimatePresence>
              {status === 'SUCCESS' && (
                <motion.div
                  className="mt-4 p-4 rounded-xl bg-primary-emerald/10 border border-primary-emerald/20 text-primary-emerald text-xs font-outfit flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Thank you! Your message has been sent successfully. We will contact you soon.</span>
                </motion.div>
              )}
              {status === 'ERROR' && (
                <motion.div
                  className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-outfit flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Please fill out all required fields marked with an asterisk (*).</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* ==========================================
            MAP SECTION
            ========================================== */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-glass-md">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.01]">
            <h3 className="font-outfit font-bold text-white text-base">Office Map Directions</h3>
          </div>
          <div className="relative w-full h-[400px] bg-dark-800">
            {/* Embedded Google Map with modern dark filters */}
            <iframe
              title="Ligand Software Solutions Office Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.75530080794!2d74.4889054749083!3d16.257717984449357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc0931673d7c8dd%3A0xc144c2d0dfb000bc!2sLIGAND%20SOFTWARE%20SOLUTIONS!5e1!3m2!1sen!2sin!4v1780511059401!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: 'none',
                opacity: 1
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
