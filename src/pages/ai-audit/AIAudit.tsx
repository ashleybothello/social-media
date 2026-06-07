import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { demoAudit } from "@/lib/demoData";

const radarData = [
  { subject: 'Branding', A: demoAudit.branding, fullMark: 100 },
  { subject: 'Consistency', A: demoAudit.consistency, fullMark: 100 },
  { subject: 'Engagement', A: demoAudit.engagement, fullMark: 100 },
  { subject: 'Frequency', A: demoAudit.posting_frequency, fullMark: 100 },
  { subject: 'SEO', A: demoAudit.seo, fullMark: 100 },
  { subject: 'Quality', A: demoAudit.content_quality, fullMark: 100 },
];

export default function AIAudit() {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success bg-success/20";
    if (score >= 60) return "text-warning bg-warning/20";
    return "text-danger bg-danger/20";
  };

  const getScoreHex = (score: number) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="page-container">
      <div className="section-header mb-8 text-center max-w-2xl mx-auto">
        <h1 className="section-title text-2xl">AI Growth Audit</h1>
        <p className="section-subtitle">A comprehensive analysis of your Instagram presence based on the last 90 days.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 flex flex-col items-center justify-center relative">
          <div className="relative w-48 h-48 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <motion.circle 
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * demoAudit.growth_score) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                cx="50" cy="50" r="45" fill="none" stroke={getScoreHex(demoAudit.growth_score)} strokeWidth="8" 
                strokeDasharray="283" strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${demoAudit.growth_score >= 80 ? 'text-success' : demoAudit.growth_score >= 60 ? 'text-warning' : 'text-danger'}`}>
                {demoAudit.growth_score}
              </span>
              <span className="text-xs text-muted-custom uppercase tracking-wider mt-1">Score</span>
            </div>
          </div>
          <div className="w-full space-y-4">
            {[
              { label: 'Branding', val: demoAudit.branding },
              { label: 'Consistency', val: demoAudit.consistency },
              { label: 'Engagement', val: demoAudit.engagement },
              { label: 'Frequency', val: demoAudit.posting_frequency },
              { label: 'SEO', val: demoAudit.seo },
              { label: 'Quality', val: demoAudit.content_quality },
            ].map((m, i) => (
              <div key={m.label} className="flex items-center gap-4">
                <span className="text-xs text-secondary-custom w-24">{m.label}</span>
                <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${m.val}%` }} transition={{ delay: 0.2 + (i*0.1), duration: 0.8 }}
                    className="h-full rounded-full" style={{ backgroundColor: getScoreHex(m.val) }} 
                  />
                </div>
                <span className="text-xs font-semibold text-primary-custom w-8 text-right">{m.val}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-primary-custom mb-4 self-start">Performance Radar</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                <Radar name="Score" dataKey="A" stroke="#7c6ef5" fill="#7c6ef5" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <h3 className="section-title text-lg mb-6">AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoAudit.recommendations.map((rec, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl bg-surface-3/50 border border-border-default">
              <div className="w-8 h-8 rounded-full bg-surface-4 border border-border-strong flex items-center justify-center shrink-0 text-sm font-bold text-primary-custom">
                {i + 1}
              </div>
              <div>
                <p className="text-sm text-primary-custom leading-relaxed">{rec}</p>
                <div className="mt-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${i < 2 ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'}`}>
                    {i < 2 ? 'HIGH PRIORITY' : 'MEDIUM PRIORITY'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
