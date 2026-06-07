import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import {
  Instagram, Users, Heart, Eye, TrendingUp, RefreshCw, ExternalLink,
  Calendar, Film, Grid, FileText, ArrowUpRight,
} from "lucide-react";
import { demoProfile, demoAnalytics, demoStats } from "@/lib/demoData";
import { formatNumber, formatPercent, formatDate } from "@/lib/utils";

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="font-medium mb-1 text-xs" style={{ color: "var(--text-primary)" }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-secondary)" }}>
            {p.name}: <strong style={{ color: "var(--text-primary)" }}>{typeof p.value === 'number' && p.value > 100 ? formatNumber(p.value) : `${p.value}%`}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

const chartData = demoAnalytics.slice(-30).map((s) => ({
  date:        formatDate(s.date),
  followers:   s.followers,
  reach:       s.reach,
  impressions: s.impressions,
  engagement:  s.engagement_rate,
}));

const topPosts = [
  { type: "REEL",     caption: "How I grew 10K followers in 30 days 🚀", likes: 1240, comments: 87, reach: 18400 },
  { type: "CAROUSEL", caption: "5 Instagram mistakes you're making (and how to fix them)", likes: 920, comments: 64, reach: 12800 },
  { type: "REEL",     caption: "Day in the life of a content creator ✨", likes: 874, comments: 51, reach: 9600 },
];

function PostTypeIcon({ type }: { type: string }) {
  if (type === "REEL")     return <Film size={14} />;
  if (type === "CAROUSEL") return <Grid size={14} />;
  return <FileText size={14} />;
}

export default function InstagramAnalytics() {
  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>Instagram Analytics</h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            <span className="badge-brand mr-2">Demo Mode</span>
            Showing sample data for <strong style={{ color: "#a89bf8" }}>@{demoProfile.username}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <a href="/instagram/connect" className="btn-ghost">
            <Instagram size={16} />
            <span className="hidden sm:inline">Reconnect</span>
          </a>
          <button className="btn-ghost">
            <RefreshCw size={16} />
          </button>
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="glass-card p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}
        >
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              @{demoProfile.username}
            </h2>
            <span className="badge-success">Connected</span>
          </div>
          <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{demoProfile.bio}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>{formatNumber(demoProfile.followers_count)}</strong> Followers
            </span>
            <span style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>{formatNumber(demoProfile.following_count)}</strong> Following
            </span>
            <span style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>{demoProfile.media_count}</strong> Posts
            </span>
          </div>
        </div>
        <a href={`https://instagram.com/${demoProfile.username}`} target="_blank" rel="noreferrer" className="btn-ghost shrink-0">
          <ExternalLink size={14} />
          View on Instagram
        </a>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Followers",        value: formatNumber(demoStats.followers.value),       change: demoStats.followers.change,       icon: Users    },
          { label: "Reach",            value: formatNumber(demoStats.reach.value),            change: demoStats.reach.change,           icon: Eye      },
          { label: "Avg Engagement",   value: `${demoStats.engagement_rate.value.toFixed(1)}%`, change: demoStats.engagement_rate.change, icon: Heart },
          { label: "Profile Visits",   value: formatNumber(demoStats.profile_visits.value),  change: demoStats.profile_visits.change,  icon: TrendingUp },
        ].map(({ label, value, change, icon: Icon }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon size={16} strokeWidth={1.8} style={{ color: "#7c6ef5" }} />
              <span className={`text-xs font-medium flex items-center gap-0.5 ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                <ArrowUpRight size={12} />
                {Math.abs(change)}%
              </span>
            </div>
            <div className="text-xl font-bold mb-0.5" style={{ color: "var(--text-primary)" }}>{value}</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="section-title text-base mb-1">Follower Growth</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Last 30 days</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="igFollowers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c6ef5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c6ef5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="followers" name="Followers" stroke="#7c6ef5" strokeWidth={2} fill="url(#igFollowers)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
          <h3 className="section-title text-base mb-1">Engagement Rate</h3>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Daily percentage</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="igEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="engagement" name="Engagement %" stroke="#10b981" strokeWidth={2} fill="url(#igEngagement)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Posts */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
        <h3 className="section-title text-base mb-4">Top Performing Posts</h3>
        <div className="space-y-3">
          {topPosts.map((post, i) => (
            <div key={i} className="flex items-center gap-4 py-3" style={{ borderBottom: i < topPosts.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: post.type === "REEL" ? "rgba(124,110,245,0.15)" : "rgba(59,130,246,0.15)" }}>
                <PostTypeIcon type={post.type} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{post.caption}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  ❤️ {post.likes} · 💬 {post.comments} · 👁️ {formatNumber(post.reach)}
                </p>
              </div>
              <span className={post.type === "REEL" ? "badge-brand" : "text-xs px-2 py-0.5 rounded-full"} style={post.type !== "REEL" ? { background: "rgba(59,130,246,0.12)", color: "#60a5fa" } : {}}>
                {post.type}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
