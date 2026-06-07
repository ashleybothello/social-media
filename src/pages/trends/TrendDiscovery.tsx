import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Headphones, Lightbulb, Layout, Copy, ArrowUpRight } from "lucide-react";
import { demoTrends } from "@/lib/demoData";
import { formatNumber } from "@/lib/utils";
import toast from "react-hot-toast";

export default function TrendDiscovery() {
  const [activeTab, setActiveTab] = useState("all");

  const hashtags = demoTrends.filter(t => t.type === "hashtag");
  const audio = demoTrends.filter(t => t.type === "audio");
  const topics = demoTrends.filter(t => t.type === "topic");
  const formats = demoTrends.filter(t => t.type === "format");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied: ${text}`);
  };

  const GrowthBadge = ({ percent }: { percent: number }) => {
    const color = percent >= 200 ? "text-success bg-success/10 border-success/20" : percent >= 100 ? "text-warning bg-warning/10 border-warning/20" : "text-muted-custom bg-surface-3 border-border-default";
    return (
      <span className={`text-[10px] font-medium px-2 py-0.5 rounded border flex items-center gap-0.5 whitespace-nowrap ${color}`}>
        <ArrowUpRight size={10} /> {percent}%
      </span>
    );
  };

  const renderSection = (title: string, icon: any, children: React.ReactNode, delay: number) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6 text-primary-custom">
        {icon}
        <h2 className="font-bold text-lg">{title}</h2>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div className="page-container">
      <div className="section-header mb-8">
        <h1 className="section-title">Trend Discovery</h1>
        <p className="section-subtitle">Real-time signals to keep your content viral-ready.</p>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
        {["all", "hashtags", "audio", "topics", "formats"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full border capitalize transition-all whitespace-nowrap ${activeTab === tab ? "bg-brand-500/10 border-brand-500 text-brand-400" : "bg-surface-2 border-border-default text-muted-custom hover:text-secondary-custom"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {(activeTab === "all" || activeTab === "hashtags") && renderSection("Trending Hashtags", <TrendingUp className="text-brand-400" />, (
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
              {hashtags.map((h, i) => (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border-default hover:border-brand-500/30 transition-colors group cursor-pointer" onClick={() => handleCopy(h.name)}>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-custom font-bold text-sm w-4 text-right">{i+1}</span>
                    <div>
                      <p className="font-medium text-primary-custom group-hover:text-brand-400 transition-colors">{h.name}</p>
                      <p className="text-xs text-secondary-custom mt-0.5">{formatNumber(h.usage_count || 0)} posts · {h.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GrowthBadge percent={h.growth_percent} />
                    <Copy size={14} className="text-muted-custom opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          ), 0.1)}

          {(activeTab === "all" || activeTab === "audio") && renderSection("Trending Audio", <Headphones className="text-blue-400" />, (
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
              {audio.map((a, i) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border-default group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-surface-3 flex items-center justify-center gap-1">
                      <div className="w-1 bg-blue-400 animate-pulse" style={{ height: "40%", animationDuration: "0.8s" }} />
                      <div className="w-1 bg-blue-400 animate-pulse" style={{ height: "80%", animationDuration: "1.2s" }} />
                      <div className="w-1 bg-blue-400 animate-pulse" style={{ height: "60%", animationDuration: "0.9s" }} />
                    </div>
                    <div>
                      <p className="font-medium text-primary-custom truncate max-w-[150px] sm:max-w-[200px]">{a.name}</p>
                      <p className="text-xs text-secondary-custom mt-0.5">{a.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <GrowthBadge percent={a.growth_percent} />
                    <button className="btn-ghost text-xs py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(a.name)}>Copy</button>
                  </div>
                </div>
              ))}
            </div>
          ), 0.2)}

          {(activeTab === "all" || activeTab === "topics") && renderSection("Trending Topics", <Lightbulb className="text-warning" />, (
            <div className="flex flex-wrap gap-3">
              {topics.map(t => (
                <div key={t.id} className="px-4 py-3 rounded-lg bg-surface-2 border border-border-default hover:border-warning/50 transition-colors flex-grow cursor-pointer" onClick={() => handleCopy(t.name)}>
                  <p className="font-medium text-primary-custom mb-1">{t.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-secondary-custom">{t.category}</span>
                    <GrowthBadge percent={t.growth_percent} />
                  </div>
                </div>
              ))}
            </div>
          ), 0.3)}

          {(activeTab === "all" || activeTab === "formats") && renderSection("Content Formats", <Layout className="text-success" />, (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formats.map(f => (
                <div key={f.id} className="p-4 rounded-lg bg-surface-2 border border-border-default hover:border-success/50 transition-colors cursor-pointer" onClick={() => handleCopy(f.name)}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center"><Layout size={14} className="text-success" /></div>
                    <GrowthBadge percent={f.growth_percent} />
                  </div>
                  <p className="font-medium text-primary-custom">{f.name}</p>
                  <p className="text-xs text-secondary-custom mt-1">{f.category}</p>
                </div>
              ))}
            </div>
          ), 0.4)}
        </AnimatePresence>
      </div>
    </div>
  );
}
