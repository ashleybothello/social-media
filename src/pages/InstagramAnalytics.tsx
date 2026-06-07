import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Instagram, Users, Heart, Eye, TrendingUp, RefreshCw, ExternalLink,
  Calendar, Film, Grid, FileText, ArrowUpRight, Loader2, AlertCircle
} from "lucide-react";
import { formatNumber, formatPercent, formatDate } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "");

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

export default function InstagramAnalytics() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("aix_access_token") ?? "";
      const res = await fetch(`${API_BASE}/api/instagram/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 404) {
        setError("NOT_CONNECTED");
      } else if (!res.ok) {
        throw new Error("Failed to fetch data");
      } else {
        const json = await res.json();
        // Format dates
        json.chartData = json.chartData.map((d: any) => ({
          ...d,
          date: formatDate(d.date)
        }));
        setData(json);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-brand" size={32} />
      </div>
    );
  }

  if (error === "NOT_CONNECTED") {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ background: "linear-gradient(45deg, #f09433, #bc1888)" }}>
          <Instagram size={32} color="white" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-primary">Not yet connected to Instagram</h1>
        <p className="text-secondary mb-8 max-w-md">
          Connect your Instagram Professional account to view your advanced profile analytics.
        </p>
        <button onClick={() => navigate("/instagram/connect")} className="btn-brand">
          <Instagram size={18} />
          Connect Instagram
        </button>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="text-danger mb-4" size={32} />
        <h2 className="text-xl font-bold text-danger mb-2">Failed to load analytics</h2>
        <p className="text-secondary">{error}</p>
        <button onClick={fetchDashboardData} className="btn-ghost mt-4">Try again</button>
      </div>
    );
  }

  const { profile, stats, chartData, topPosts } = data;

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
            <span className="badge-success mr-2">Connected</span>
            Showing data for <strong style={{ color: "#a89bf8" }}>@{profile.username}</strong>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate("/instagram/connect")} className="btn-ghost">
            <Instagram size={16} />
            <span className="hidden sm:inline">Reconnect</span>
          </button>
          <button onClick={fetchDashboardData} className="btn-ghost">
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
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}
        >
          {profile.profile_picture_url ? (
            <img src={profile.profile_picture_url} alt={profile.username} className="w-full h-full object-cover" />
          ) : (
            profile.username.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              @{profile.username}
            </h2>
            <span className="badge-success">Connected</span>
          </div>
          <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{profile.bio || "No bio"}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>{formatNumber(profile.followers_count)}</strong> Followers
            </span>
            <span style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>{formatNumber(profile.following_count)}</strong> Following
            </span>
            <span style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--text-primary)" }}>{profile.media_count}</strong> Posts
            </span>
          </div>
        </div>
        <a href={`https://instagram.com/${profile.username}`} target="_blank" rel="noreferrer" className="btn-ghost shrink-0">
          <ExternalLink size={14} />
          View Profile
        </a>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Followers",        value: formatNumber(stats.followers.value),       change: stats.followers.change,       icon: Users    },
          { label: "Reach",            value: formatNumber(stats.reach.value),            change: stats.reach.change,           icon: Eye      },
          { label: "Avg Engagement",   value: `${stats.engagement_rate.value.toFixed(1)}%`, change: stats.engagement_rate.change, icon: Heart },
          { label: "Profile Visits",   value: formatNumber(stats.profile_visits.value),  change: stats.profile_visits.change,  icon: TrendingUp },
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
          {topPosts.length > 0 ? topPosts.map((post: any, i: number) => (
            <div key={i} className="flex items-center gap-4 py-3" style={{ borderBottom: i < topPosts.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: post.type === "VIDEO" ? "rgba(124,110,245,0.15)" : "rgba(59,130,246,0.15)" }}>
                {post.type === "VIDEO" ? <Film size={14} /> : post.type === "CAROUSEL_ALBUM" ? <Grid size={14} /> : <FileText size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>{post.caption || "No caption"}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  ❤️ {post.likes} · 💬 {post.comments} · 👁️ {formatNumber(post.reach)}
                </p>
              </div>
              <span className={post.type === "VIDEO" ? "badge-brand" : "text-xs px-2 py-0.5 rounded-full"} style={post.type !== "VIDEO" ? { background: "rgba(59,130,246,0.12)", color: "#60a5fa" } : {}}>
                {post.type}
              </span>
            </div>
          )) : (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No posts available.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
