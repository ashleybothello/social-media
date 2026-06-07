import { motion } from "framer-motion";
import { Clock, Film, Users, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { demoAudit } from "@/lib/demoData";

const bestContentTypes = [
  { name: "Reels", value: 78, fill: "#7c6ef5" },
  { name: "Carousels", value: 64, fill: "#3b82f6" },
  { name: "Stories", value: 42, fill: "#f59e0b" },
  { name: "Posts", value: 31, fill: "#10b981" },
];

export default function AIInsights() {
  return (
    <div className="page-container">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="section-header flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="section-title">AI Insights</h1>
          <p className="section-subtitle">Deep analytics and AI recommendations based on your performance.</p>
        </div>
        <div className="flex items-center gap-3 bg-surface-2 border border-border-default rounded-lg p-2.5 pr-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <circle 
                cx="18" cy="18" r="16" fill="none" stroke="#f59e0b" strokeWidth="3" 
                strokeDasharray="100" strokeDashoffset={100 - demoAudit.growth_score} 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <span className="absolute text-sm font-bold text-primary-custom">{demoAudit.growth_score}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-warning">Growth Score</p>
            <a href="/ai-audit" className="text-xs text-muted-custom hover:text-primary-custom transition-colors">Full Audit →</a>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Best Posting Time */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-primary-custom">
              <Clock size={20} />
              <h3 className="font-semibold">Best Posting Time</h3>
            </div>
            <span className="badge-brand">High Impact</span>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="text-center text-xs text-muted-custom mb-1">{d}</div>)}
            {Array.from({ length: 28 }).map((_, i) => {
              const isHot = i === 9 || i === 10 || i === 12 || i === 19 || i === 24 || i === 26;
              const isWarm = i === 2 || i === 8 || i === 11 || i === 16 || i === 18 || i === 23;
              return (
                <div 
                  key={i} 
                  className={`aspect-square rounded-sm ${isHot ? "bg-brand-500" : isWarm ? "bg-brand-500/40" : "bg-surface-3"}`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-surface-3 border border-border-default px-2 py-1 rounded text-primary-custom">Tue 7:00 PM</span>
            <span className="text-xs bg-surface-3 border border-border-default px-2 py-1 rounded text-primary-custom">Wed 8:00 PM</span>
            <span className="text-xs bg-surface-3 border border-border-default px-2 py-1 rounded text-primary-custom">Fri 7:30 PM</span>
          </div>
        </motion.div>

        {/* Best Content Type */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-primary-custom">
              <Film size={20} />
              <h3 className="font-semibold">Best Content Type</h3>
            </div>
            <span className="badge-success">Reels +78%</span>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bestContentTypes} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} width={80} />
                <Tooltip cursor={{ fill: "var(--surface-3)" }} contentStyle={{ backgroundColor: "var(--surface-4)", borderColor: "var(--border-strong)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Audience Analysis */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <div className="flex items-center gap-2 text-primary-custom mb-6">
            <Users size={20} />
            <h3 className="font-semibold">Audience Analysis</h3>
          </div>
          <div className="space-y-4 mb-6">
            {[
              { label: "18-24", val: 34 }, { label: "25-34", val: 41 }, 
              { label: "35-44", val: 18 }, { label: "45+", val: 7 }
            ].map(age => (
              <div key={age.label}>
                <div className="flex justify-between text-xs text-secondary-custom mb-1">
                  <span>{age.label}</span>
                  <span>{age.val}%</span>
                </div>
                <div className="h-2 w-full bg-surface-3 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${age.val}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-custom mb-2">Gender</p>
              <div className="h-2 w-full flex rounded-full overflow-hidden mb-1">
                <div className="h-full bg-brand-400" style={{ width: "58%" }} />
                <div className="h-full bg-blue-500" style={{ width: "42%" }} />
              </div>
              <div className="flex justify-between text-xs text-secondary-custom">
                <span>58% F</span><span>42% M</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-custom mb-2">Top Locations</p>
              <div className="flex flex-col gap-1 text-xs text-secondary-custom">
                <div className="flex justify-between"><span>🇺🇸 USA</span><span>45%</span></div>
                <div className="flex justify-between"><span>🇬🇧 UK</span><span>12%</span></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Growth Opportunities */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-primary-custom">
              <TrendingUp size={20} />
              <h3 className="font-semibold">Growth Opportunities</h3>
            </div>
            <span className="badge-success">Actionable</span>
          </div>
          <div className="space-y-4">
            {[
              { t: "Post 2 more Reels/week", g: "+34% reach" },
              { t: "Engage with comments in first hour", g: "+18% boost" },
              { t: "Add location tags to posts", g: "+12% discovery" },
              { t: "Collab with 2 micro-influencers", g: "+28% surge" }
            ].map((opp, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-3/50 border border-border-default">
                <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp size={12} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-primary-custom">{opp.t}</p>
                  <p className="text-xs text-success mt-1">{opp.g} potential</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weakness Detection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-primary-custom">
              <AlertTriangle size={20} />
              <h3 className="font-semibold">Weakness Detection</h3>
            </div>
            <span className="badge-warning">Needs Fix</span>
          </div>
          <div className="space-y-3">
            {[
              { t: "Posting frequency is too low", d: "Current: 2.3x/week. Recommended: 5x/week for optimal reach.", s: "high" },
              { t: "Bio missing target keywords", d: "Your bio doesn't contain search terms your audience looks for.", s: "med" },
              { t: "Story highlights unoptimized", d: "No branded highlights or strategic categories detected.", s: "med" },
            ].map((w, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${w.s === 'high' ? 'bg-danger' : 'bg-warning'}`} />
                <div>
                  <p className="text-sm font-medium text-primary-custom">{w.t}</p>
                  <p className="text-xs text-muted-custom mt-0.5">{w.d}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content Gaps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-primary-custom">
              <Lightbulb size={20} />
              <h3 className="font-semibold">Content Gaps</h3>
            </div>
            <span className="badge-brand">Untapped</span>
          </div>
          <p className="text-sm text-secondary-custom mb-4">Content types your competitors post successfully that you are currently missing:</p>
          <div className="flex flex-wrap gap-2">
            {["Educational Carousels", "Tutorial Reels", "User Testimonials", "Trend Reactions"].map((gap, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-3 border border-border-default text-xs text-primary-custom cursor-pointer hover:border-brand-500 transition-colors">
                {gap}
                <span className="text-brand-500 font-bold">+</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
