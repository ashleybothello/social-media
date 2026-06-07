import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Instagram, Sparkles, Wand2, User, BarChart3,
  Users, Calendar, TrendingUp, MessageSquareText, Settings,
  ChevronLeft, ChevronRight, LogOut, Zap, Bell, Youtube, Linkedin, Bot
} from "lucide-react";
import { clearAuthData } from "@/store/auth-store";

  {
    label: "Overview",
    items: [
      { label: "Dashboard",         icon: LayoutDashboard,     path: "/dashboard" },
    ],
  },
  {
    label: "Platforms",
    items: [
      { label: "Instagram",         icon: Instagram,            path: "/instagram" },
      { label: "YouTube",           icon: Youtube,              path: "#", disabled: true },
      { label: "LinkedIn",          icon: Linkedin,             path: "#", disabled: true },
    ],
  },
  {
    label: "AI Tools",
    items: [
      { label: "Global AI Chatbot", icon: Bot,                  path: "#", disabled: true },
      { label: "AI Insights",       icon: Sparkles,             path: "/insights" },
      { label: "Content Studio",    icon: Wand2,                path: "/content-studio" },
      { label: "Profile Optimizer", icon: User,                 path: "/profile-optimizer" },
      { label: "AI Audit",          icon: BarChart3,            path: "/ai-audit" },
      { label: "AI Coach",          icon: MessageSquareText,    path: "/ai-coach" },
    ],
  },
  {
    label: "Growth",
    items: [
      { label: "Competitors",       icon: Users,                path: "/competitors" },
      { label: "Content Calendar",  icon: Calendar,             path: "/calendar" },
      { label: "Trend Discovery",   icon: TrendingUp,           path: "/trends" },
    ],
  },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthData();
    navigate("/");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-full flex-shrink-0 overflow-hidden"
      style={{ background: "var(--surface-2)", borderRight: "1px solid var(--border-default)" }}
    >
      {/* Logo */}
      <div className="flex items-center h-14 px-3 shrink-0" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}>
            <Zap size={16} color="white" strokeWidth={2.5} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-sm tracking-tight whitespace-nowrap"
                style={{ color: "var(--text-primary)" }}
              >
                AIXMedia
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5 no-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-2xs font-semibold uppercase tracking-widest mb-1.5 px-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                if (item.disabled) {
                  return (
                    <div
                      key={item.label}
                      title={collapsed ? `${item.label} (Coming Soon)` : undefined}
                      className={cn("nav-item opacity-50 cursor-not-allowed", collapsed && "justify-center px-0")}
                    >
                      <item.icon size={18} strokeWidth={1.8} className="shrink-0" />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.15 }}
                            className="whitespace-nowrap text-sm flex items-center justify-between w-full"
                          >
                            <span>{item.label}</span>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm bg-brand/20 text-brand ml-2">Soon</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      cn("nav-item", isActive && "active", collapsed && "justify-center px-0")
                    }
                  >
                    <item.icon size={18} strokeWidth={1.8} className="shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.15 }}
                          className="whitespace-nowrap text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 pb-3 space-y-0.5" style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "0.75rem" }}>
        <button
          onClick={handleLogout}
          title={collapsed ? "Log out" : undefined}
          className={cn("nav-item w-full text-left", collapsed && "justify-center px-0")}
        >
          <LogOut size={18} strokeWidth={1.8} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="text-sm"
              >
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 z-10 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: "var(--surface-4)", border: "1px solid var(--border-default)", color: "var(--text-muted)" }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </motion.aside>
  );
}
