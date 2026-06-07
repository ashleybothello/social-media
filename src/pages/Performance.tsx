import { useState, useEffect } from "react";
import { analyzePerformance } from "@/services/ml-api";
import { savePerformanceAnalysis } from "@/store/local-store";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/Toast";
import { motion } from "framer-motion";
import {
  BarChart3, Loader2, TrendingUp, AlertTriangle, Lightbulb,
  Rocket, Clock, Hash, MessageSquare, Heart, Share2,
} from "lucide-react";

interface Analysis {
  score: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  next_strategy: string;
}

const platforms = ["Instagram", "YouTube", "LinkedIn", "Twitter/X", "TikTok"];
const postTypes = ["Static image", "Reel / Short", "Carousel", "Story", "Text post", "Poll"];

function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const color =
    score >= 80 ? "#22C55E" :
    score >= 60 ? "#EAB308" :
                  "#EF4444";

  return (
    <div className="score-ring-wrap">
      <svg className="score-ring-svg" width="136" height="136" viewBox="0 0 136 136">
        <circle className="score-ring-track" cx="68" cy="68" r={r} />
        <motion.circle
          className="score-ring-fill"
          cx="68" cy="68" r={r}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          stroke={color}
        />
      </svg>
      <div className="score-ring-text">
        <span className="font-display" style={{ fontSize: "2rem", fontWeight: 600, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "2px" }}>/ 100</span>
      </div>
    </div>
  );
}

const recIcons: Record<string, any> = {
  "Hook": Lightbulb,
  "Length": MessageSquare,
  "CTA": ArrowRight,
  "Hashtag": Hash,
  "Timing": Clock,
  "Format": BarChart3,
};

function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function Performance() {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram");
  const [selectedPostType, setSelectedPostType] = useState("Static image");
  const [metrics, setMetrics] = useState({ likes: "", comments: "", shares: "", saves: "", reach: "", impressions: "" });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [scoreNum, setScoreNum] = useState(0);

  const analyze = async () => {
    if (!postContent.trim()) {
      toast({ title: "Enter post content", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const data = await analyzePerformance({ postContent, metrics });
      setAnalysis(data.analysis);
      setScoreNum(parseInt(data.analysis.score));
      savePerformanceAnalysis({ post_content: postContent, metrics, analysis: data.analysis });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const recCardDefs = analysis ? [
    { icon: Lightbulb, title: "Hook optimisation",   desc: analysis.strengths[0] || analysis.recommendations[0] || "" },
    { icon: MessageSquare, title: "Content length",  desc: analysis.weaknesses[0] || "Post length looks good." },
    { icon: TrendingUp, title: "Engagement signals", desc: analysis.strengths[1] || analysis.recommendations[1] || "" },
    { icon: Hash, title: "Hashtag strategy",         desc: analysis.weaknesses[1] || "Hashtag usage looks healthy." },
    { icon: Clock, title: "Timing",                  desc: analysis.recommendations[2] || "Test different posting times." },
    { icon: Rocket, title: "Next move",              desc: analysis.recommendations[3] || analysis.next_strategy.slice(0, 100) + "..." },
  ] : [];

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "rgba(59,130,246,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart3 size={18} color="#3B82F6" />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.025em" }}>Performance intelligence</h1>
            <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "1px" }}>Analyse your post and get AI-powered recommendations</p>
          </div>
        </div>

        {/* Input form */}
        <div className="glass-panel p-7 mb-6" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Post content */}
          <div>
            <label className="label">Post content</label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Paste the post content you want to analyse..."
              rows={4} maxLength={2000}
              className="textarea"
            />
          </div>

          {/* Platform + post type */}
          <div className="grid grid-2 gap-4">
            <div>
              <label className="label">Platform</label>
              <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} className="select">
                {platforms.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Post type</label>
              <select value={selectedPostType} onChange={(e) => setSelectedPostType(e.target.value)} className="select">
                {postTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Metrics */}
          <div>
            <label className="label">Engagement metrics <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
            <div className="grid grid-3 gap-3">
              {[
                { key: "likes", icon: Heart, label: "Likes" },
                { key: "comments", icon: MessageSquare, label: "Comments" },
                { key: "shares", icon: Share2, label: "Shares" },
                { key: "saves", icon: Rocket, label: "Saves" },
                { key: "reach", icon: TrendingUp, label: "Reach" },
                { key: "impressions", icon: BarChart3, label: "Impressions" },
              ].map(({ key, icon: Icon, label }) => (
                <div key={key}>
                  <label className="label-sm">{label}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="number" min="0"
                      value={metrics[key as keyof typeof metrics]}
                      onChange={(e) => setMetrics({ ...metrics, [key]: e.target.value })}
                      placeholder="0"
                      className="input"
                      style={{ height: "2.5rem", paddingLeft: "2.125rem" }}
                    />
                    <Icon size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={analyze} disabled={loading} className="btn btn-primary w-full" style={{ height: "3rem", fontSize: "0.9375rem" }}>
            {loading ? <><Loader2 size={16} className="spin" /> Analysing...</> : <><BarChart3 size={16} /> Analyse performance</>}
          </button>
        </div>

        {/* Results */}
        {analysis && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Score card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-8"
              style={{ textAlign: "center" }}
            >
              <ScoreRing score={scoreNum} />
              <div className="font-display" style={{ fontSize: "1rem", fontWeight: 600, marginTop: "1.25rem" }}>Your post score</div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                {scoreNum >= 80 ? "Excellent performance! Keep it up." : scoreNum >= 60 ? "Solid — a few tweaks will get you there." : "Needs work — check the recommendations below."}
              </p>
            </motion.div>

            {/* Recommendations grid */}
            <div className="grid grid-2 gap-3">
              {recCardDefs.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className="rec-card"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <rec.icon size={15} color="var(--indigo-light)" />
                    <span className="font-display font-medium" style={{ fontSize: "0.875rem" }}>{rec.title}</span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{rec.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-2 gap-4">
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={15} color="var(--success)" />
                  <h4 className="font-display font-medium" style={{ color: "var(--success)" }}>Strengths</h4>
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span style={{ color: "var(--success)", marginTop: 3, fontSize: "0.625rem" }}>●</span>
                      <span style={{ color: "var(--text-secondary)" }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }} className="glass-panel p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={15} color="var(--warning)" />
                  <h4 className="font-display font-medium" style={{ color: "var(--warning)" }}>Areas to improve</h4>
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span style={{ color: "var(--warning)", marginTop: 3, fontSize: "0.625rem" }}>●</span>
                      <span style={{ color: "var(--text-secondary)" }}>{w}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Next strategy */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6">
              <div className="flex items-center gap-2 mb-3">
                <Rocket size={15} color="var(--teal-light)" />
                <h4 className="font-display font-medium" style={{ color: "var(--teal-light)" }}>What to do next</h4>
              </div>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>{analysis.next_strategy}</p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
