import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, FileText, BookOpen, Image as ImageIcon, CheckCircle2, AlertCircle, Wand2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

const profileData = {
  username: "aixmedia.demo",
  name: "AIXMedia Demo",
  bio: "AI-Powered Social Media Growth 🚀\nContent Creator | Brand Builder\n📊 10K+ posts analyzed",
  stats: { followers: 24800, following: 412, posts: 183 }
};

export default function ProfileOptimizer() {
  const [showOptimizedBio, setShowOptimizedBio] = useState(false);

  return (
    <div className="page-container">
      <div className="section-header mb-8">
        <h1 className="section-title">Profile Optimizer</h1>
        <p className="section-subtitle">Turn your profile into a follower-converting machine.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Profile Preview */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-1/3">
          <div className="glass-card p-6 sticky top-6">
            <h3 className="text-sm font-semibold text-secondary-custom mb-6 uppercase tracking-wider">Profile Preview</h3>
            
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center text-4xl font-bold text-white shadow-brand-md" style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}>
                A
              </div>
              <h2 className="text-xl font-bold text-primary-custom">{profileData.name}</h2>
              <p className="text-secondary-custom">@{profileData.username}</p>
            </div>

            <div className="flex justify-between mb-6 px-4">
              <div className="text-center">
                <p className="font-bold text-primary-custom">{formatNumber(profileData.stats.posts)}</p>
                <p className="text-xs text-muted-custom">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-primary-custom">{formatNumber(profileData.stats.followers)}</p>
                <p className="text-xs text-muted-custom">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-primary-custom">{profileData.stats.following}</p>
                <p className="text-xs text-muted-custom">Following</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-primary-custom whitespace-pre-wrap leading-relaxed">{profileData.bio}</p>
            </div>

            <button className="w-full py-2 bg-surface-3 border border-border-default rounded-md text-sm font-medium text-primary-custom hover:bg-surface-4 transition-colors">
              Edit Profile
            </button>
          </div>
        </motion.div>

        {/* Right Column - Analysis */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-2/3 flex flex-col gap-4">
          <div className="glass-card p-6 flex justify-between items-center bg-surface-2 border-brand-500/30">
            <div>
              <h2 className="text-xl font-bold text-primary-custom">Overall Profile Score</h2>
              <p className="text-sm text-secondary-custom">You're doing well, but there's room for optimization.</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-warning flex items-center justify-center bg-warning/10">
              <span className="text-xl font-bold text-warning">74</span>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <User size={18} className="text-brand-400" />
                <h3 className="font-semibold text-primary-custom">Username Analysis</h3>
              </div>
              <span className="badge-success">85/100</span>
            </div>
            <p className="text-sm text-secondary-custom mt-2">Clean and brandable. Consider adding a niche keyword like <span className="text-primary-custom font-medium">@aixmedia.growth</span> for better search visibility.</p>
          </div>

          <div className="glass-card p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-brand-400" />
                <h3 className="font-semibold text-primary-custom">Bio Analysis</h3>
              </div>
              <span className="badge-warning">70/100</span>
            </div>
            <p className="text-sm text-secondary-custom mt-2 mb-3">Missing target keywords. Use line breaks for readability and add a strong Call To Action.</p>
            <div className="flex gap-2">
              <span className="text-[10px] px-2 py-1 rounded border border-danger text-danger bg-danger/10">Missing: AI Analytics</span>
              <span className="text-[10px] px-2 py-1 rounded border border-danger text-danger bg-danger/10">Missing: Instagram Growth</span>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-brand-400" />
                <h3 className="font-semibold text-primary-custom">Story Highlights</h3>
              </div>
              <span className="badge-danger">50/100</span>
            </div>
            <p className="text-sm text-secondary-custom mt-2 mb-4">No branded highlights detected. Add categories like About, Results, FAQ, and Testimonials.</p>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border border-dashed border-border-strong bg-surface-3 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-surface-2" />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-brand-400" />
                <h3 className="font-semibold text-primary-custom">Profile Picture</h3>
              </div>
              <span className="badge-success">90/100</span>
            </div>
            <p className="text-sm text-secondary-custom mt-2">High quality and clear. Brand colors detected. Excellent visibility at small sizes.</p>
          </div>

          <div className="mt-4">
            <AnimatePresence>
              {!showOptimizedBio ? (
                <motion.button 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setShowOptimizedBio(true)}
                  className="btn-brand w-full justify-center py-3"
                >
                  <Wand2 size={18} /> Generate Optimized Bio
                </motion.button>
              ) : (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="glass-card p-6 bg-brand-500/5 border-brand-500/30">
                  <h3 className="font-semibold text-brand-400 flex items-center gap-2 mb-4">
                    <Sparkles size={18} /> AI Suggested Bio
                  </h3>
                  <div className="bg-surface-1 p-4 rounded-lg border border-border-default mb-4">
                    <p className="text-primary-custom whitespace-pre-wrap text-sm leading-relaxed">
                      AIXMedia | Insta Growth 🚀
                      <br/>AI-Powered Social Media Analytics
                      <br/>📈 10K+ accounts scaled
                      <br/>💡 Daily growth hacks & insights
                      <br/>👇 Start your free trial today
                      <br/>aixmedia.io/trial
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-brand flex-1 text-sm py-2" onClick={() => { navigator.clipboard.writeText("AIXMedia | Insta Growth 🚀\nAI-Powered Social Media Analytics\n📈 10K+ accounts scaled\n💡 Daily growth hacks & insights\n👇 Start your free trial today\naixmedia.io/trial"); }}>Copy Bio</button>
                    <button onClick={() => setShowOptimizedBio(false)} className="btn-ghost flex-1 text-sm py-2 border-border-default hover:bg-surface-3">Dismiss</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

const Sparkles = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
  </svg>
);
