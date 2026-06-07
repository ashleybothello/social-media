import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Instagram, Sparkles, Wand2, User, BarChart3,
  Users, Calendar, TrendingUp, MessageSquareText, Menu, X, Zap, LogOut,
} from "lucide-react";
import { clearAuthData } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",         icon: LayoutDashboard,     path: "/dashboard" },
  { label: "Instagram",         icon: Instagram,            path: "/instagram" },
  { label: "AI Insights",       icon: Sparkles,             path: "/insights" },
  { label: "Content Studio",    icon: Wand2,                path: "/content-studio" },
  { label: "Profile Optimizer", icon: User,                 path: "/profile-optimizer" },
  { label: "AI Audit",          icon: BarChart3,            path: "/ai-audit" },
  { label: "AI Coach",          icon: MessageSquareText,    path: "/ai-coach" },
  { label: "Competitors",       icon: Users,                path: "/competitors" },
  { label: "Content Calendar",  icon: Calendar,             path: "/calendar" },
  { label: "Trend Discovery",   icon: TrendingUp,           path: "/trends" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };

  return (
    <>
      <header
        className="flex items-center justify-between px-4 h-14"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}>
            <Zap size={14} color="white" />
          </div>
          <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>AIXMedia</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          <Menu size={20} />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col"
              style={{ background: "var(--surface-2)", borderRight: "1px solid var(--border-default)" }}
            >
              <div className="flex items-center justify-between px-4 h-14" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}>
                    <Zap size={14} color="white" />
                  </div>
                  <span className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>AIXMedia</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg" style={{ color: "var(--text-secondary)" }}>
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 no-scrollbar">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => cn("nav-item", isActive && "active")}
                  >
                    <item.icon size={18} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="px-3 pb-4" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
                <button onClick={handleLogout} className="nav-item w-full text-left">
                  <LogOut size={18} strokeWidth={1.8} />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
