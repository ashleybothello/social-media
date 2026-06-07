import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Copy, Check, Loader2, Sparkles, Hash, Video, LayoutTemplate, Square, Image } from "lucide-react";
import toast from "react-hot-toast";
import { demoContentIdeas, demoCaption } from "@/lib/demoData";

const niches = ["Social Media Marketing", "Fitness", "Food & Lifestyle", "Business", "Fashion", "Travel", "Tech"];
const goals = ["Engagement", "Reach", "Followers", "Sales", "Brand Awareness"];
const tones = ["Bold & Direct", "Friendly & Casual", "Professional", "Inspirational", "Humorous", "Educational"];

export default function ContentStudio() {
  const [activeTab, setActiveTab] = useState<"ideas" | "captions">("ideas");
  const [filter, setFilter] = useState("all");
  
  // Caption Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState<any>(null);
  
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedCaption(null);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedCaption(demoCaption);
      toast.success("Caption generated!");
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const filteredIdeas = filter === "all" ? demoContentIdeas : demoContentIdeas.filter(i => i.type === filter);

  return (
    <div className="page-container flex flex-col h-full">
      <div className="section-header mb-6">
        <h1 className="section-title">Content Studio</h1>
        <p className="section-subtitle">Generate ideas, captions, and strategies in seconds.</p>
      </div>

      <div className="flex bg-surface-2 p-1 rounded-lg w-fit mb-6 border border-border-default">
        <button
          onClick={() => setActiveTab("ideas")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "ideas" ? "bg-surface-4 text-primary-custom shadow-sm" : "text-muted-custom hover:text-secondary-custom"}`}
        >
          Idea Generator
        </button>
        <button
          onClick={() => setActiveTab("captions")}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "captions" ? "bg-surface-4 text-primary-custom shadow-sm" : "text-muted-custom hover:text-secondary-custom"}`}
        >
          Caption Generator
        </button>
      </div>

      {activeTab === "ideas" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
            {["all", "reel", "carousel", "story", "post"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border whitespace-nowrap transition-all ${filter === f ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-border-default bg-surface-2 text-muted-custom hover:border-border-strong hover:text-secondary-custom"}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}s
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredIdeas.map((idea, i) => (
                <motion.div
                  key={idea.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className="glass-card p-5 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`badge-${idea.type === 'reel' ? 'brand' : idea.type === 'carousel' ? 'success' : idea.type === 'story' ? 'warning' : 'info'}`}>
                      {idea.type === 'reel' ? <Video size={12}/> : idea.type === 'carousel' ? <LayoutTemplate size={12}/> : idea.type === 'story' ? <Square size={12}/> : <Image size={12}/>}
                      {idea.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-brand-400 flex items-center gap-1 font-medium bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                      <Sparkles size={10} /> ~{idea.estimated_reach ? (idea.estimated_reach/1000).toFixed(1) : '0'}K reach
                    </span>
                  </div>
                  <h3 className="text-primary-custom font-semibold text-sm mb-2">{idea.title}</h3>
                  <p className="text-secondary-custom text-xs mb-4 flex-1 truncate-3 leading-relaxed">{idea.description}</p>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-4 pb-1">
                    {idea.hashtags.map(tag => (
                      <span key={tag} className="text-[10px] text-muted-custom bg-surface-3 px-1.5 py-0.5 rounded whitespace-nowrap">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button className="btn-ghost flex-1 text-xs py-1.5 border border-border-default hover:bg-surface-3">Save Idea</button>
                    <button onClick={() => { setActiveTab("captions"); }} className="btn-brand flex-1 text-xs py-1.5 shadow-none">Generate</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {activeTab === "captions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          <div className="glass-card p-6 lg:w-[40%] flex flex-col gap-5">
            <h2 className="text-primary-custom font-semibold flex items-center gap-2">
              <Wand2 size={18} className="text-brand-500" />
              Configure Generator
            </h2>
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary-custom mb-1.5">Niche / Industry</label>
                <select className="input-field w-full appearance-none bg-surface-3 border-border-default text-sm" required>
                  {niches.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-custom mb-1.5">Primary Goal</label>
                <select className="input-field w-full appearance-none bg-surface-3 border-border-default text-sm" required>
                  {goals.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-custom mb-1.5">Tone of Voice</label>
                <select className="input-field w-full appearance-none bg-surface-3 border-border-default text-sm" required>
                  {tones.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary-custom mb-1.5">Context / Topic (Optional)</label>
                <textarea className="input-field w-full resize-none bg-surface-3 border-border-default text-sm" rows={3} placeholder="What is this post about?" />
              </div>
              <button type="submit" disabled={isGenerating} className="btn-brand w-full mt-2 justify-center py-2.5">
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <><Wand2 size={18} /> Generate Caption</>}
              </button>
            </form>
          </div>

          <div className="glass-card lg:w-[60%] flex flex-col overflow-hidden relative">
            {!generatedCaption ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                {isGenerating ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center mb-4">
                      <Loader2 size={32} className="text-brand-500 animate-spin" />
                    </div>
                    <p className="text-primary-custom font-medium">Crafting the perfect caption...</p>
                    <p className="text-sm text-muted-custom mt-1">Analyzing successful patterns in your niche.</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-surface-3 flex items-center justify-center mb-4 border border-border-default">
                      <Wand2 size={32} className="text-muted-custom" />
                    </div>
                    <p className="text-secondary-custom text-sm">Your generated caption will appear here.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 relative flex flex-col">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border-subtle">
                  <span className="text-xs bg-surface-3 border border-border-default px-2 py-1 rounded text-primary-custom">{generatedCaption.niche}</span>
                  <span className="text-xs bg-surface-3 border border-border-default px-2 py-1 rounded text-primary-custom">{generatedCaption.tone}</span>
                  <span className="text-xs bg-surface-3 border border-border-default px-2 py-1 rounded text-primary-custom">{generatedCaption.goal}</span>
                </div>
                
                <div className="relative group mb-6">
                  <p className="text-primary-custom text-sm leading-relaxed whitespace-pre-wrap">{generatedCaption.caption}</p>
                  <button onClick={() => handleCopy(generatedCaption.caption)} className="absolute -top-2 -right-2 p-2 bg-surface-3 border border-border-default rounded-md text-muted-custom hover:text-primary-custom opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy size={14} />
                  </button>
                </div>

                <div className="relative group mb-6 bg-brand-500/5 border border-brand-500/20 rounded-lg p-4">
                  <p className="text-xs font-semibold text-brand-400 mb-1 uppercase tracking-wider">Call to Action</p>
                  <p className="text-primary-custom text-sm">{generatedCaption.cta}</p>
                  <button onClick={() => handleCopy(generatedCaption.cta)} className="absolute top-2 right-2 p-2 text-brand-400 hover:text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy size={14} />
                  </button>
                </div>

                <div className="relative group mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-secondary-custom uppercase tracking-wider">Hashtags</p>
                    <button onClick={() => handleCopy(generatedCaption.hashtags.join(" "))} className="text-xs flex items-center gap-1 text-muted-custom hover:text-primary-custom transition-colors">
                      <Copy size={12} /> Copy All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generatedCaption.hashtags.map((t: string) => (
                      <span key={t} className="text-xs text-secondary-custom bg-surface-2 border border-border-default px-2 py-1 rounded-md">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
