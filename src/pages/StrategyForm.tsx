import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveStrategy } from "@/store/local-store";
import { generateStrategy } from "@/services/ml-api";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/Toast";
import { motion } from "framer-motion";
import { Zap, Loader2, Sparkles, Lightbulb, CheckCircle2 } from "lucide-react";

const brandStages = ["New", "Growing", "Established"];
const brandPersonalities = ["Bold", "Calm", "Premium", "Fun", "Educational"];
const socialGoals = ["Grow followers", "Get leads", "Build authority", "Drive sales", "Build community"];
const timeHorizons = [1, 3, 6, 12];

const PLATFORMS = [
  { id: "Instagram",  emoji: "📸", color: "#E1306C" },
  { id: "YouTube",    emoji: "▶️", color: "#FF0000" },
  { id: "LinkedIn",   emoji: "💼", color: "#0A66C2" },
  { id: "Twitter/X",  emoji: "𝕏", color: "#1DA1F2" },
  { id: "TikTok",     emoji: "🎵", color: "#FF004F" },
];

function ChipSelect({
  options, selected, onChange, multi = false,
}: {
  options: string[]; selected: string | string[]; onChange: (val: any) => void; multi?: boolean;
}) {
  const isSelected = (o: string) => multi ? (selected as string[]).includes(o) : selected === o;
  const toggle = (o: string) => {
    if (multi) {
      const arr = selected as string[];
      onChange(arr.includes(o) ? arr.filter((v) => v !== o) : [...arr, o]);
    } else { onChange(o); }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <motion.button
          key={o} type="button" onClick={() => toggle(o)}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          className={`chip ${isSelected(o) ? "active" : ""}`}
        >{o}</motion.button>
      ))}
    </div>
  );
}

/* Tip card data */
interface TipStep { step: number; title: string; tip: string; }
const TIPS: TipStep[] = [
  { step: 1, title: "Be specific with your niche", tip: "The more specific your industry (e.g. \"SaaS for HR teams\" vs \"Software\"), the better calibrated your strategy." },
  { step: 2, title: "Match personality to audience", tip: "\"Bold\" works great for consumer brands. \"Educational\" excels in B2B — think about who you're speaking to." },
  { step: 3, title: "Pick 2–3 platforms max", tip: "Spreading too thin dilutes impact. Focus on platforms where your audience already hangs out." },
  { step: 4, title: "Align goals with time horizon", tip: "Follower growth takes 3–6 months. Revenue goals need a longer runway — plan realistically." },
];

export default function StrategyForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTip, setActiveTip] = useState(0);

  const [form, setForm] = useState({
    industry: "",
    brandStage: "New",
    brandPersonality: "Bold",
    socialGoals: [] as string[],
    platforms: [] as string[],
    timeHorizon: 3,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.industry.trim()) {
      toast({ title: "Enter your industry", description: "Tell us what niche you're in.", variant: "destructive" });
      return;
    }
    if (form.socialGoals.length === 0 || form.platforms.length === 0) {
      toast({ title: "Missing fields", description: "Select at least one goal and one platform.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await generateStrategy(form);
      const strategy = saveStrategy({
        title: `${form.industry} strategy`,
        industry: form.industry,
        brand_stage: form.brandStage,
        brand_personality: form.brandPersonality,
        social_goals: form.socialGoals,
        platforms: form.platforms,
        time_horizon: form.timeHorizon,
        roadmap: result.roadmap,
        calendar: result.calendar,
      });
      toast({ title: "Strategy generated! ✨" });
      navigate(`/calendar/${strategy.id}`);
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const togglePlatform = (id: string) => {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(id)
        ? prev.platforms.filter((p) => p !== id)
        : [...prev.platforms, id],
    }));
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{
            width: 36, height: 36, borderRadius: "var(--radius-md)",
            background: "var(--indigo-dim)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={18} color="var(--indigo-light)" />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.025em" }}>
              Create strategy
            </h1>
            <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "1px" }}>
              AI will generate a complete content roadmap just for you
            </p>
          </div>
        </div>

        {/* Split layout */}
        <form onSubmit={handleSubmit} className="form-split">
          {/* Left: Form */}
          <div className="glass-panel p-7" style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

            {/* Industry */}
            <div onFocus={() => setActiveTip(0)}>
              <label className="label">Industry / niche</label>
              <input
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                placeholder="e.g. SaaS, Fitness, E-commerce, Food, Tech"
                required maxLength={100}
                className="input"
              />
            </div>

            {/* Brand stage */}
            <div onFocus={() => setActiveTip(1)}>
              <label className="label">Brand stage</label>
              <ChipSelect options={brandStages} selected={form.brandStage} onChange={(v) => setForm({ ...form, brandStage: v })} />
            </div>

            {/* Brand personality */}
            <div onFocus={() => setActiveTip(1)}>
              <label className="label">Brand personality</label>
              <ChipSelect options={brandPersonalities} selected={form.brandPersonality} onChange={(v) => setForm({ ...form, brandPersonality: v })} />
            </div>

            {/* Social goals */}
            <div onFocus={() => setActiveTip(3)}>
              <label className="label">Social goals</label>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.625rem" }}>Select all that apply</p>
              <ChipSelect options={socialGoals} selected={form.socialGoals} onChange={(v) => setForm({ ...form, socialGoals: v })} multi />
            </div>

            {/* Platforms */}
            <div onFocus={() => setActiveTip(2)}>
              <label className="label">Platforms</label>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Select your target platforms</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.625rem" }}>
                {PLATFORMS.map((p) => (
                  <motion.div
                    key={p.id}
                    whileTap={{ scale: 0.95 }}
                    className={`platform-card ${form.platforms.includes(p.id) ? "active" : ""}`}
                    onClick={() => togglePlatform(p.id)}
                  >
                    <div className="platform-icon" style={{ background: `${p.color}18`, fontSize: "1.25rem" }}>{p.emoji}</div>
                    <div className="platform-name">{p.id}</div>
                    {form.platforms.includes(p.id) && (
                      <CheckCircle2 size={13} color="var(--indigo-light)" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Time horizon */}
            <div onFocus={() => setActiveTip(3)}>
              <label className="label">Time horizon (months)</label>
              <ChipSelect
                options={timeHorizons.map(String)}
                selected={String(form.timeHorizon)}
                onChange={(v) => setForm({ ...form, timeHorizon: Number(v) })}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
              style={{
                background: loading ? undefined : "linear-gradient(135deg, #534AB7, #7F77DD)",
                fontSize: "0.9375rem",
              }}
            >
              {loading ? (
                <><Loader2 size={18} className="spin" /> Generating strategy...</>
              ) : (
                <><Zap size={18} /> Generate my strategy</>
              )}
            </button>
          </div>

          {/* Right: Tips panel */}
          <div className="form-sidepanel">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={16} color="var(--indigo-light)" />
              <span className="font-display font-medium" style={{ fontSize: "0.875rem" }}>Tips for success</span>
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1rem", lineHeight: 1.5 }}>
              Great strategies start with clear inputs. Here's what to keep in mind:
            </p>

            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                className="tip-card"
                animate={{ opacity: i === activeTip ? 1 : 0.5, scale: i === activeTip ? 1 : 0.98 }}
                transition={{ duration: 0.25 }}
                onClick={() => setActiveTip(i)}
                style={{ cursor: "pointer" }}
              >
                <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--indigo-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.375rem" }}>
                  Step {tip.step} · {tip.title}
                </div>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{tip.tip}</p>
              </motion.div>
            ))}

            {/* Preview summary */}
            {(form.industry || form.platforms.length > 0) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-subtle p-4 mt-2">
                <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--teal-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                  Your strategy preview
                </div>
                {form.industry && (
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.375rem" }}>
                    🏷️ <strong>{form.industry}</strong> · {form.brandStage}
                  </div>
                )}
                {form.platforms.length > 0 && (
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginBottom: "0.375rem" }}>
                    📱 {form.platforms.join(", ")}
                  </div>
                )}
                {form.socialGoals.length > 0 && (
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
                    🎯 {form.socialGoals.join(", ")}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}
