import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Sparkles, CalendarDays, Zap, Loader2 } from "lucide-react";

export default function ContentStrategy() {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [industry, setIndustry] = useState("Technology");
  const [focus, setFocus] = useState("Growth");

  const generateIdeas = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/content/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, focus })
      });
      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 800, margin: "0 auto" }}>
        <div className="flex items-center gap-3 mb-8">
          <div style={{ width: 36, height: 36, borderRadius: "var(--radius-md)", background: "rgba(216,90,48,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={18} color="var(--coral-light)" />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 600 }}>Content Strategy Module</h1>
            <p className="text-secondary" style={{ fontSize: "0.875rem" }}>Generate AI-powered content ideas and calendars</p>
          </div>
        </div>

        <div className="glass-panel p-6 mb-8 grid grid-2 gap-4">
          <div>
            <label className="label">Industry</label>
            <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} className="input" />
          </div>
          <div>
            <label className="label">Focus Area</label>
            <input type="text" value={focus} onChange={e => setFocus(e.target.value)} className="input" />
          </div>
          <div className="col-span-2">
            <button onClick={generateIdeas} disabled={loading} className="btn btn-primary w-full justify-center">
              {loading ? <Loader2 className="spin" size={16} /> : <><Zap size={16} /> Generate Reel Ideas</>}
            </button>
          </div>
        </div>

        {ideas.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display font-medium text-lg">Generated Ideas</h3>
            {ideas.map((idea, i) => (
              <div key={i} className="glass-card p-4 flex gap-4 items-start">
                <div className="bg-indigo-500/10 text-indigo-400 w-8 h-8 rounded flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-secondary mt-1">{idea}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
