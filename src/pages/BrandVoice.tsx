import { useState } from "react";
import { transformVoice } from "@/services/ml-api";
import { saveBrandVoiceResult } from "@/store/local-store";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, Loader2, Copy, Check, Sparkles, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const personas = [
  { id: "Professional",  emoji: "👔", name: "Corporate professional", desc: "Formal, authoritative, polished" },
  { id: "Friendly",      emoji: "😊", name: "Startup hustle",         desc: "Energetic, ambitious, transparent" },
  { id: "Gen-Z",         emoji: "✨", name: "Gen-Z internet",         desc: "Memes, slang, extremely casual" },
  { id: "Corporate",     emoji: "📊", name: "Educator",               desc: "Clear, helpful, empowering" },
  { id: "Storyteller",   emoji: "📖", name: "Creator cool",           desc: "Relatable, authentic, conversational" },
  { id: "Motivational",  emoji: "🔥", name: "Thought leader",         desc: "Insightful, strategic, visionary" },
];

const platformsList = ["Instagram", "YouTube", "LinkedIn", "Twitter/X", "TikTok"];

export default function BrandVoice() {
  const { toast } = useToast();
  const [masterPost, setMasterPost] = useState("");
  const [persona, setPersona] = useState("Professional");
  const [platform, setPlatform] = useState("Instagram");
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);

  const generate = async () => {
    if (!masterPost.trim()) {
      toast({ title: "Enter a post", description: "Paste your draft content first.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const data = await transformVoice({ masterPost, persona, platform });
      setVariations(data.variations);
      saveBrandVoiceResult({ original_post: masterPost, cultural_persona: persona, platform, variations: data.variations });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const copyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: "Copied! 📋" });
  };

  const canGenerate = masterPost.trim().length > 0;
  const activePersona = personas.find((p) => p.id === persona);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div style={{
            width: 36, height: 36, borderRadius: "var(--radius-md)",
            background: "var(--coral-dim)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Mic2 size={18} color="var(--coral-light)" />
          </div>
          <div>
            <h1 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.025em" }}>Brand voice engine</h1>
            <p className="text-secondary" style={{ fontSize: "0.875rem", marginTop: "1px" }}>Rewrite your content for different personas and platforms</p>
          </div>
        </div>

        {/* Persona selector */}
        <div className="mb-5">
          <label className="label">Choose a persona</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
            {personas.map((p) => (
              <motion.div
                key={p.id}
                whileTap={{ scale: 0.97 }}
                className={`voice-persona-card ${persona === p.id ? "active" : ""}`}
                onClick={() => setPersona(p.id)}
              >
                <div className="persona-icon">{p.emoji}</div>
                <div className="persona-name">{p.name}</div>
                <div className="persona-desc">{p.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Platform selector */}
        <div className="mb-6">
          <label className="label">Target platform</label>
          <div className="flex flex-wrap gap-2">
            {platformsList.map((p) => (
              <motion.button key={p} type="button" onClick={() => setPlatform(p)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className={`chip ${platform === p ? "active" : ""}`}
              >{p}</motion.button>
            ))}
          </div>
        </div>

        {/* Split panels */}
        <div className="voice-split-panel mb-5">
          {/* Left: Input */}
          <div className="voice-panel-left">
            <div className="voice-panel-header">
              <span>Your draft</span>
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>{masterPost.length} / 2000</span>
            </div>
            <textarea
              value={masterPost}
              onChange={(e) => setMasterPost(e.target.value)}
              placeholder="Paste or type your content draft here..."
              maxLength={2000}
              className="textarea"
              style={{ flex: 1, minHeight: 220, borderRadius: 0, border: "none", resize: "none", background: "transparent" }}
            />
          </div>

          {/* Divider + transform button */}
          <div className="voice-panel-divider">
            <motion.button
              className="voice-panel-divider-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={generate}
              disabled={!canGenerate || loading}
              style={{
                width: 36, height: 36,
                background: canGenerate ? "linear-gradient(135deg,#534AB7,#7F77DD)" : "var(--bg-elevated)",
                color: canGenerate ? "white" : "var(--text-muted)",
                cursor: canGenerate ? "pointer" : "default",
                boxShadow: canGenerate ? "0 4px 16px rgba(83,74,183,0.4)" : "none",
                transition: "all 0.25s",
              }}
            >
              {loading ? <Loader2 size={14} className="spin" /> : <ArrowRight size={14} />}
            </motion.button>
          </div>

          {/* Right: Output */}
          <div className="voice-panel-right">
            <div className="voice-panel-header">
              <span>{activePersona?.name || "Output"}</span>
              {variations[0] && (
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => copyText(variations[0], -1)} className="btn-ghost" style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--indigo-light)" }}>
                  {copied === -1 ? <Check size={13} /> : <Copy size={13} />}
                  {copied === -1 ? "Copied" : "Copy"}
                </motion.button>
              )}
            </div>
            <div style={{ flex: 1, minHeight: 220, padding: "0.875rem 1rem", display: "flex", alignItems: variations[0] ? "flex-start" : "center", justifyContent: variations[0] ? "flex-start" : "center" }}>
              {variations[0] ? (
                <p style={{ fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{variations[0]}</p>
              ) : (
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", textAlign: "center" }}>
                  {loading ? "Transforming your content..." : "Your transformed content will appear here"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Large transform button (below panels) */}
        <motion.button
          whileHover={canGenerate ? { scale: 1.02 } : {}}
          whileTap={canGenerate ? { scale: 0.98 } : {}}
          onClick={generate}
          disabled={!canGenerate || loading}
          className="btn btn-primary w-full"
          style={{ height: "3rem", fontSize: "0.9375rem", marginBottom: "1.5rem" }}
        >
          {loading ? <><Loader2 size={16} className="spin" /> Transforming...</> : <><Sparkles size={16} /> Transform voice</>}
        </motion.button>

        {/* Additional variations */}
        {variations.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <h3 className="font-display font-medium" style={{ fontSize: "0.8125rem", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              More variations
            </h3>
            {variations.slice(1).map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card"
                style={{ padding: "1.25rem" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--indigo-light)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
                      Variation {i + 2}
                    </div>
                    <p className="text-sm" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, color: "var(--text-secondary)" }}>{v}</p>
                  </div>
                  <motion.button onClick={() => copyText(v, i)} whileTap={{ scale: 0.9 }} className="btn-ghost shrink-0">
                    {copied === i ? <Check size={15} color="var(--teal-light)" /> : <Copy size={15} />}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Tips accordion */}
        <div className="glass-panel" style={{ overflow: "hidden" }}>
          <button
            onClick={() => setTipsOpen((o) => !o)}
            className="w-full flex items-center justify-between p-5"
            style={{ background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={15} color="var(--indigo-light)" />
              <span className="font-display font-medium" style={{ fontSize: "0.9375rem" }}>Tips for best results</span>
            </div>
            {tipsOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
          </button>

          <AnimatePresence>
            {tipsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    "Write your draft in a neutral, straightforward tone for best transformation results.",
                    "Keep the core message clear — don't include multiple unrelated ideas in one post.",
                    "Longer drafts (50–200 words) produce richer, more distinct variations.",
                    "Try the same draft across multiple personas to find your brand's sweet spot.",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--indigo-dim)", color: "var(--indigo-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </DashboardLayout>
  );
}
