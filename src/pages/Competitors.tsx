import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, TrendingUp, Search, Loader2, X, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { demoCompetitors } from "@/lib/demoData";
import { formatNumber } from "@/lib/utils";
import toast from "react-hot-toast";

export default function Competitors() {
  const [competitors, setCompetitors] = useState(demoCompetitors);
  const [search, setSearch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setIsAnalyzing(true);
    setTimeout(() => {
      const newComp = {
        id: `comp-${Date.now()}`,
        username: search.toLowerCase().replace('@', ''),
        followers: Math.floor(Math.random() * 50000) + 10000,
        posting_frequency: `${(Math.random() * 3 + 2).toFixed(1)}x/week`,
        engagement_rate: parseFloat((Math.random() * 3 + 1.5).toFixed(1)),
        top_content_themes: ["Lifestyle", "Tips & Tricks", "Product Reviews"],
        growth_opportunity: "Lower engagement than average. Good target for outperforming with high-quality Reels.",
        added_at: new Date().toISOString()
      };
      setCompetitors([newComp, ...competitors]);
      setSearch("");
      setIsAnalyzing(false);
      toast.success("Competitor analyzed and added.");
    }, 1500);
  };

  const handleRemove = (id: string) => {
    setCompetitors(competitors.filter(c => c.id !== id));
    toast.success("Competitor removed.");
  };

  const chartData = competitors.map(c => ({
    name: `@${c.username}`,
    engagement: c.engagement_rate
  }));

  return (
    <div className="page-container flex flex-col min-h-full">
      <div className="section-header mb-8">
        <h1 className="section-title">Competitor Analysis</h1>
        <p className="section-subtitle">Track competitors and discover growth opportunities to outpace them.</p>
      </div>

      <div className="glass-card p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleAnalyze} className="flex w-full gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" size={18} />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Enter Instagram username (e.g. @competitor)" 
              className="input-field pl-10 h-11"
            />
          </div>
          <button type="submit" disabled={isAnalyzing || !search.trim()} className="btn-brand h-11 px-6 whitespace-nowrap">
            {isAnalyzing ? <Loader2 size={18} className="animate-spin mr-2" /> : null}
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </div>

      {competitors.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-card text-center flex-1">
          <div className="w-16 h-16 rounded-full bg-surface-3 flex items-center justify-center mb-4 border border-border-default">
            <Users size={32} className="text-muted-custom" />
          </div>
          <h3 className="text-lg font-medium text-primary-custom mb-2">No Competitors Tracked</h3>
          <p className="text-secondary-custom max-w-md">Add your first competitor above to start tracking their performance, analyzing their content strategy, and finding gaps to exploit.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AnimatePresence>
              {competitors.map((comp, i) => (
                <motion.div 
                  key={comp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card p-6 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center text-primary-custom font-bold border border-border-default uppercase">
                        {comp.username.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-primary-custom">@{comp.username}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-secondary-custom">{formatNumber(comp.followers || 0)} followers</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleRemove(comp.id)} className="text-muted-custom hover:text-danger transition-colors p-1" title="Remove">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 bg-surface-1 rounded-lg p-4 border border-border-default">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-custom mb-1">Posting Freq</p>
                      <p className="font-semibold text-primary-custom">{comp.posting_frequency}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-custom mb-1">Engagement</p>
                      <p className="font-semibold text-success">{comp.engagement_rate}%</p>
                    </div>
                  </div>

                  <div className="mb-6 flex-1">
                    <p className="text-xs font-semibold text-secondary-custom mb-2 uppercase tracking-wider">Top Content Themes</p>
                    <div className="flex flex-wrap gap-2">
                      {comp.top_content_themes?.map(theme => (
                        <span key={theme} className="text-xs px-2.5 py-1 bg-surface-3 border border-border-default rounded-md text-primary-custom">{theme}</span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-brand-400" />
                      <p className="text-sm font-semibold text-brand-400">Growth Opportunity</p>
                    </div>
                    <p className="text-sm text-primary-custom">{comp.growth_opportunity}</p>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <button className="btn-ghost flex-1 text-sm border-border-default hover:bg-surface-3">View Full Insights</button>
                    <button className="btn-brand flex-1 text-sm shadow-none">Track Changes</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {competitors.length >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h3 className="section-title text-base mb-6">Engagement Comparison</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} contentStyle={{ backgroundColor: "var(--surface-4)", borderColor: "var(--border-strong)", borderRadius: "8px", fontSize: "12px", color: "var(--text-primary)" }} />
                    <Bar dataKey="engagement" name="Engagement Rate" fill="#7c6ef5" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
