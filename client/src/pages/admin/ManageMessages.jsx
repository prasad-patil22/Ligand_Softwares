import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, MessageSquare, Trash2, X, Send } from "lucide-react";

const CONTACT_API_URL = "https://ligand-softwares-328p.onrender.com/api/contact";

export default function ManageMessages() {
  const [contactMessages, setContactMessages] = useState([]);
  const [contactMessagesLoading, setContactMessagesLoading] = useState(true);
  const [contactMessagesError, setContactMessagesError] = useState("");
  const [messagesFilter, setMessagesFilter] = useState("all");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);

  const fetchContactMessages = async () => {
    setContactMessagesLoading(true);
    setContactMessagesError("");
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      const response = await fetch(CONTACT_API_URL, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load messages");
      setContactMessages(data.messages || []);
    } catch (err) {
      setContactMessagesError(err.message);
    } finally {
      setContactMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchContactMessages();
  }, []);

  const handleDeleteContactMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) return;
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    try {
      const response = await fetch(`${CONTACT_API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete message");
      fetchContactMessages();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      alert("Please enter a reply message.");
      return;
    }
    setReplyLoading(true);
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`${CONTACT_API_URL}/${selectedMessage._id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ replyMessage: replyText })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send reply");
      
      alert("Reply sent successfully and user notified!");
      setShowReplyForm(false);
      setSelectedMessage(null);
      setReplyText("");
      fetchContactMessages();
    } catch (err) {
      alert(err.message);
    } finally {
      setReplyLoading(false);
    }
  };

  const filteredMessages = contactMessages.filter((msg) => {
    if (messagesFilter === "pending") return !msg.isReplied;
    if (messagesFilter === "replied") return msg.isReplied;
    return true;
  });

  return (
    <motion.div
      key="messages"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-2xl font-bold text-white uppercase tracking-wider">Contact Messages</h2>
          <p className="text-slate-400 text-xs">
            Review user enquiries and reply to them directly via email.
          </p>
        </div>
        
        {/* Status Filters */}
        <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-xl gap-1.5 self-stretch sm:self-auto justify-center">
          {['all', 'pending', 'replied'].map((filter) => (
            <button
              key={filter}
              onClick={() => setMessagesFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                messagesFilter === filter
                  ? 'bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 shadow-glow-cyan/5'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {contactMessagesLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mb-4" />
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Loading messages...</span>
          </div>
        ) : contactMessagesError ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5" />
            <span>Error loading messages: {contactMessagesError}</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-white/5">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wide">No Messages Found</h4>
            <p className="text-xs text-slate-400">Messages submitted from the contact page will list here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg._id}
                className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors flex flex-col justify-between gap-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-outfit text-base font-bold text-white tracking-wide">
                        {msg.subject || "No Subject"}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase ${
                        msg.isReplied
                          ? 'bg-primary-emerald/10 border-primary-emerald/35 text-primary-emerald'
                          : 'bg-amber-500/10 border-amber-500/35 text-amber-400'
                      }`}>
                        {msg.isReplied ? 'Replied' : 'Pending Reply'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-400 font-mono mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">From:</span>
                        <span className="text-slate-300">{msg.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Email:</span>
                        <span className="text-slate-300">{msg.email}</span>
                      </div>
                      {msg.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">Phone:</span>
                          <span className="text-slate-300">{msg.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Received:</span>
                        <span className="text-slate-300">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 text-xs text-slate-300 leading-relaxed max-w-4xl">
                      <strong className="text-slate-500 font-mono block mb-1 uppercase tracking-wider text-[10px]">User Message:</strong>
                      {msg.message}
                    </div>

                    {msg.isReplied && (
                      <div className="mt-4 p-4 rounded-xl bg-primary-cyan/5 border border-primary-cyan/15 text-xs text-slate-200 leading-relaxed max-w-4xl">
                        <div className="flex items-center gap-2 mb-1.5">
                          <strong className="text-primary-cyan font-mono uppercase tracking-wider text-[10px]">Admin Reply:</strong>
                          <span className="text-[9px] text-slate-500 font-mono">
                            Replied on {new Date(msg.repliedAt).toLocaleString()}
                          </span>
                        </div>
                        {msg.replyMessage}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 justify-end md:justify-start">
                    {!msg.isReplied && (
                      <button
                        onClick={() => {
                          setSelectedMessage(msg);
                          setReplyText("");
                          setShowReplyForm(true);
                        }}
                        className="flex-1 md:flex-none py-2 px-4 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold text-xs uppercase tracking-wider text-center hover:shadow-glow-cyan/15 hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Reply</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteContactMessage(msg._id)}
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

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyForm && selectedMessage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel w-full max-w-lg rounded-3xl border border-white/10 bg-dark-900/90 shadow-glass-2xl p-6 md:p-8 relative overflow-hidden"
            >
              {/* Top border glow */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary-violet to-primary-cyan" />
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-outfit text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary-cyan" />
                  Reply to message
                </h3>
                <button
                  onClick={() => {
                    setShowReplyForm(false);
                    setSelectedMessage(null);
                  }}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1 bg-white/[0.01] border border-white/5 rounded-xl p-4 text-xs font-mono text-slate-400">
                  <div><span className="text-slate-500">To:</span> <span className="text-white">{selectedMessage.name} ({selectedMessage.email})</span></div>
                  <div><span className="text-slate-500">Subject:</span> <span className="text-slate-300">{selectedMessage.subject}</span></div>
                  <div className="border-t border-white/5 mt-2 pt-2 italic text-slate-400 max-h-32 overflow-y-auto">
                    "{selectedMessage.message}"
                  </div>
                </div>

                <form onSubmit={handleSendReply} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">Your Response *</label>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      required
                      rows="6"
                      placeholder="Type your response email..."
                      className="glass-input w-full px-4 py-3 rounded-xl text-sm resize-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReplyForm(false);
                        setSelectedMessage(null);
                      }}
                      className="py-2.5 px-5 rounded-xl border border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={replyLoading}
                      className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-primary-violet to-primary-cyan text-dark-900 font-extrabold text-xs uppercase tracking-wider hover:shadow-glow-cyan/15 hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {replyLoading ? (
                        <div className="w-4 h-4 border-2 border-dark-900 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>{replyLoading ? "Sending..." : "Send Reply"}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
