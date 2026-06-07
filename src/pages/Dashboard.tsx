import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  Users, Eye, TrendingUp, Heart, UserCheck, Percent,
  ArrowUpRight, ArrowDownRight, RefreshCw, Instagram, Sparkles, Zap,
} from "lucide-react";
import { demoAnalytics, demoStats, demoProfile } from "@/lib/demoData";
import { formatNumber, formatPercent, formatDate } from "@/lib/utils";

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="font-medium mb-1" style={{ color: "var(--text-primary)", fontSize: "0.75rem" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>
            {p.name}: <strong style={{ color: "var(--text-primary)" }}>{formatNumber(p.value)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatProps {
  label: string;
  value: string;
  change: number;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  suffix?: string;
  delay?: number;
}

function StatCard({ label, value, change, icon: Icon, suffix = "", delay = 0 }: StatProps) {
  const positive = change >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="stat-card group cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(124,110,245,0.12)", border: "1px solid rgba(124,110,245,0.2)" }}
        >
          <Icon size={18} strokeWidth={1.8} style={{ color: "#7c6ef5" }} />
        </div>
        <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(change)}{suffix === "%" ? "" : "%"}
        </span>
      </div>
      <div className="text-2xl font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>
        {value}{suffix}
      </div>
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
    </motion.div>
  );
}

// ─── Chart data (last 30 days) ────────────────────────────────────────────────
const chartData = demoAnalytics.slice(-30).map((s) => ({
  date:        formatDate(s.date),
  followers:   s.followers,
  reach:       s.reach,
  impressions: s.impressions,
  engagement:  s.engagement_rate,
}));

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Overview of <strong style={{ color: "#a89bf8" }}>@{demoProfile.username}</strong>
            <span className="badge-brand ml-2">Demo Mode</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/instagram/connect" className="btn-ghost">
            <Instagram size={16} />
            <span className="hidden sm:inline">Connect Instagram</span>
          </a>
          <button className="btn-ghost">
            <RefreshCw size={16} />
          </button>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <StatCard label="Followers"       value={formatNumber(demoStats.followers.value)}       change={demoStats.followers.change}       icon={Users}     delay={0.05} />
        <StatCard label="Reach"           value={formatNumber(demoStats.reach.value)}            change={demoStats.reach.change}           icon={Eye}       delay={0.10} />
        <StatCard label="Impressions"     value={formatNumber(demoStats.impressions.value)}      change={demoStats.impressions.change}     icon={TrendingUp} delay={0.15} />
        <StatCard label="Engagement Rate" value={demoStats.engagement_rate.value.toFixed(1)}    change={demoStats.engagement_rate.change} icon={Heart}     delay={0.20} suffix="%" />
        <StatCard label="Profile Visits"  value={formatNumber(demoStats.profile_visits.value)}  change={demoStats.profile_visits.change}  icon={UserCheck} delay={0.25} />
        <StatCard label="Growth %"        value={`+${demoStats.growth_percent.value}`}          change={demoStats.growth_percent.change}  icon={Percent}   delay={0.30} suffix="%" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Follower Growth — Large */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title text-base">Follower Growth</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Last 30 days</p>
            </div>
            <span className="badge-success">+{demoStats.followers.change}%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="followersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c6ef5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c6ef5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="followers" name="Followers" stroke="#7c6ef5" strokeWidth={2} fill="url(#followersGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title text-base">Engagement Rate</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Daily avg</p>
            </div>
            <span className="badge-brand">4.2%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="engagementGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} interval={5} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="engagement" name="Engagement %" stroke="#a855f7" strokeWidth={2} fill="url(#engagementGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Reach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title text-base">Reach</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Unique accounts reached</p>
            </div>
            <span className="badge-success">+{demoStats.reach.change}%</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData.filter((_, i) => i % 3 === 0)} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="reach" name="Reach" fill="#3b82f6" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Impressions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="section-title text-base">Impressions</h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Total content views</p>
            </div>
            <span className="badge-success">+{demoStats.impressions.change}%</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData.filter((_, i) => i % 3 === 0)} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="impressions" name="Impressions" fill="#f59e0b" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* AI Tip Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.4 }}
        className="rounded-xl p-4 flex items-start gap-3 mb-2"
        style={{ background: "rgba(124,110,245,0.08)", border: "1px solid rgba(124,110,245,0.2)" }}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(124,110,245,0.2)" }}>
          <Zap size={16} color="#7c6ef5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold mb-0.5" style={{ color: "#a89bf8" }}>AI Insight of the Day</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Your Tuesday evening Reels get <strong style={{ color: "var(--text-primary)" }}>2.8x more reach</strong> than average. 
            Schedule your best content for Tuesday 7–9 PM for maximum impact.
          </p>
        </div>
        <a href="/insights" className="btn-ghost text-xs shrink-0">
          <Sparkles size={14} />
          View All
        </a>
      </motion.div>
    </div>
  );
}
