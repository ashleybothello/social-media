import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStrategies, type Strategy } from "@/store/local-store";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, Sparkles, Plus, Filter } from "lucide-react";

const platformTag: Record<string, string> = {
  Instagram: "tag-instagram",
  YouTube: "tag-youtube",
  LinkedIn: "tag-linkedin",
  "Twitter/X": "tag-twitter",
  TikTok: "tag-tiktok",
};

const platformFilters = ["All", "Instagram", "YouTube", "LinkedIn", "Twitter/X", "TikTok"];

export default function CalendarIndex() {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => { setStrategies(getStrategies()); }, []);

  const filtered = strategies.filter((s) => {
    const matchesPlatform = filter === "All" || s.platforms.includes(filter);
    const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.industry.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
  const item      = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.025em" }}>
              Calendars
            </h1>
            <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "2px" }}>
              Select a strategy to view its content calendar
            </p>
          </div>
          <button onClick={() => navigate("/strategy/new")} className="btn btn-primary">
            <Plus size={15} /> New strategy
          </button>
        </div>

        {/* Filter bar */}
        {strategies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex items-center gap-3 mb-6 flex-wrap"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search strategies..."
              className="input"
              style={{ maxWidth: 220, height: "2.25rem", fontSize: "0.8125rem" }}
            />
            <div className="flex items-center gap-1" style={{ padding: "0.25rem", background: "rgba(255,255,255,0.03)", borderRadius: "var(--radius-full)", border: "1px solid var(--border)" }}>
              <Filter size={12} style={{ color: "var(--text-muted)", marginLeft: "0.5rem" }} />
              {platformFilters.map((p) => (
                <button key={p} onClick={() => setFilter(p)} className={`filter-btn ${filter === p ? "active" : ""}`}>{p}</button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Content */}
        {strategies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{ padding: "4rem", textAlign: "center" }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: "var(--radius-xl)",
              background: "var(--indigo-dim)", display: "flex", alignItems: "center",
              justifyContent: "center", margin: "0 auto 1.25rem",
            }}>
              <CalendarDays size={28} color="var(--indigo-light)" />
            </div>
            <h2 className="font-display" style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.625rem" }}>
              No calendars yet
            </h2>
            <p className="text-secondary" style={{ maxWidth: 300, margin: "0 auto 1.75rem", fontSize: "0.9375rem" }}>
              Create your first AI strategy to get a content calendar.
            </p>
            <button onClick={() => navigate("/strategy/new")} className="btn btn-primary btn-lg">
              <Plus size={16} /> Create your first strategy
            </button>
          </motion.div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel" style={{ padding: "3rem", textAlign: "center" }}>
            <Sparkles size={32} style={{ color: "var(--text-muted)", margin: "0 auto 1rem", display: "block" }} />
            <p className="text-secondary">No strategies match your filter.</p>
            <button onClick={() => { setFilter("All"); setSearch(""); }} className="btn btn-outline btn-sm" style={{ marginTop: "1rem" }}>
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-3 gap-4">
            {filtered.map((s) => (
              <motion.div
                key={s.id}
                variants={item}
                className="cal-index-card"
                onClick={() => navigate(`/calendar/${s.id}`)}
              >
                {/* Icon + date */}
                <div className="flex items-start justify-between">
                  <div style={{
                    width: 44, height: 44, borderRadius: "var(--radius-md)",
                    background: "var(--indigo-dim)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}>
                    <CalendarDays size={20} color="var(--indigo-light)" />
                  </div>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)" }}>
                    {new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                {/* Info */}
                <div>
                  <h3 className="font-display font-medium" style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{s.title}</h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                    {s.industry} · {s.calendar?.length || 0} posts · {s.time_horizon}mo
                  </p>
                </div>

                {/* Platform tags */}
                <div className="flex flex-wrap gap-1-5">
                  {s.platforms.map((p) => (
                    <span key={p} className={`tag ${platformTag[p] || ""}`}>{p}</span>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding: "0.625rem 0.875rem",
                    borderRadius: "var(--radius-md)",
                    background: "var(--indigo-dim)",
                    border: "1px solid rgba(83,74,183,0.2)",
                  }}
                >
                  <span style={{ fontSize: "0.8125rem", color: "var(--indigo-light)", fontWeight: 600 }}>Open calendar</span>
                  <ArrowRight size={14} color="var(--indigo-light)" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
