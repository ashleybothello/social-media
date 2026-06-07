import { motion } from "framer-motion";
import { Instagram, CheckCircle2, AlertCircle, ExternalLink, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const requirements = [
  "Your Instagram must be a Professional Account (Business or Creator)",
  "Your Instagram must be linked to a Facebook Page",
  "Log in with the Facebook Account that administers that Page",
];

export default function InstagramConnect() {
  const navigate = useNavigate();

  const handleConnect = () => {
    // Will be wired to backend OAuth URL after Meta setup
    const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "");
    fetch(`${API_BASE}/api/instagram/connect`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("aix_access_token") ?? ""}` },
    })
      .then((r) => r.json())
      .then((data) => { if (data.url) window.location.href = data.url; })
      .catch(() => {
        // Demo mode: just show coming soon
        alert("Instagram OAuth will be available after Meta App configuration.");
      });
  };

  return (
    <div className="page-container flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="glass-card p-8 w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
          >
            <Instagram size={32} color="#fff" />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Connect Instagram
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Unlock AI-powered analytics, insights, and growth tracking by linking your Instagram account.
          </p>
        </div>

        {/* Requirements */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} color="#3b82f6" />
            <h3 className="text-sm font-semibold" style={{ color: "#60a5fa" }}>Requirements</h3>
          </div>
          <ul className="space-y-2">
            {requirements.map((req) => (
              <li key={req} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <CheckCircle2 size={15} style={{ color: "var(--success)", marginTop: 1, flexShrink: 0 }} />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={handleConnect}
          className="btn-brand w-full justify-center mb-4"
          style={{ background: "#1877F2", boxShadow: "0 4px 16px rgba(24,119,242,0.3)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Continue with Facebook
        </button>

        <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
          By connecting, you agree to share your Instagram Insights data with AIXMedia.{" "}
          <a href="#" className="underline" style={{ color: "var(--text-secondary)" }}>Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  );
}
