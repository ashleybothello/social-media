import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 500,
        height: 300,
        background: "radial-gradient(ellipse, rgba(83,74,183,0.15), transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Abstract broken path visual */}
      <div style={{ position: "absolute", opacity: 0.04, pointerEvents: "none" }}>
        <svg width="600" height="400" viewBox="0 0 600 400" fill="none">
          <path d="M50 200 Q150 100 250 200 T450 200" stroke="white" strokeWidth="3" strokeDasharray="12 8" fill="none" />
          <path d="M80 280 Q200 180 320 280" stroke="white" strokeWidth="2" strokeDasharray="8 6" fill="none" />
          <circle cx="450" cy="200" r="30" stroke="white" strokeWidth="2" strokeDasharray="6 4" fill="none" />
          <circle cx="150" cy="120" r="18" stroke="white" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", position: "relative", zIndex: 10 }}
      >
        {/* 404 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
          className="font-display gradient-text"
          style={{
            fontSize: "clamp(5rem, 16vw, 9rem)",
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.06em",
            marginBottom: "1.25rem",
          }}
        >
          404
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem", letterSpacing: "-0.025em" }}>
            This page doesn't exist
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", maxWidth: 380, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            Looks like you've wandered off the map. Let's get you back to where the content lives.
          </p>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline btn-lg"
            >
              <ArrowLeft size={16} /> Go back
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary btn-lg"
            >
              <LayoutDashboard size={16} /> Go to dashboard
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
