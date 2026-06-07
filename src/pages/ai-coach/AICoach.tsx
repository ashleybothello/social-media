import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowUp, Plus, MessageSquare, Zap, Clock, TrendingUp } from "lucide-react";
import { demoChat, demoProfile, demoStats } from "@/lib/demoData";

const cannedResponses = [
  "Based on your analytics, your peak engagement window is Tuesday and Friday evenings between 7-9 PM. I recommend posting your best Reels during these windows for maximum reach.",
  "Your engagement rate of 4.2% is above the industry average of 2.8%. To push it higher, focus on asking questions in your captions and responding to every comment within the first hour.",
  "This week I suggest: Monday - motivational quote carousel, Wednesday - tutorial Reel, Friday - trending audio Reel. This mix will optimize for both reach and saves.",
  "Your top competitors post 6x/week vs your 2.3x/week. Increasing to 5x/week could grow your follower count by an estimated 34% in 60 days.",
  "I notice you haven't used Collab posts yet. Collaborating with accounts in the 10K-50K range in your niche typically drives 20-30% more reach per post."
];

export default function AICoach() {
  const [messages, setMessages] = useState(demoChat);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { id: `msg-${Date.now()}`, role: "user" as const, content: input.trim(), timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = cannedResponses[Math.floor(Math.random() * cannedResponses.length)];
      const aiMsg = { id: `msg-${Date.now() + 1}`, role: "assistant" as const, content: responseText, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-[calc(100vh-1.5rem)] flex p-4 page-container" style={{ paddingBottom: 0 }}>
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:flex flex-col w-64 pr-4 border-r border-border-default mr-4">
        <button onClick={() => setMessages([])} className="btn-brand w-full justify-center mb-6 py-2.5">
          <Plus size={18} /> New Chat
        </button>
        <p className="text-xs font-semibold text-secondary-custom uppercase tracking-wider mb-3 px-2">Conversation History</p>
        <div className="flex flex-col gap-1 overflow-y-auto no-scrollbar">
          {["Best posting times", "How to grow faster", "Caption strategy"].map((history, i) => (
            <button key={i} className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-surface-3 transition-colors text-sm text-secondary-custom hover:text-primary-custom group">
              <MessageSquare size={16} className="text-muted-custom group-hover:text-brand-400" />
              <span className="truncate">{history}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 glass-card overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-border-subtle bg-surface-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-brand-sm" style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}>
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <h2 className="font-bold text-primary-custom text-lg flex items-center gap-2">AI Growth Coach</h2>
              <span className="text-xs text-brand-400 flex items-center gap-1"><Zap size={10} /> Powered by AIXMedia</span>
            </div>
          </div>
        </div>

        {/* Context Banner */}
        <div className="bg-brand-500/10 border-b border-brand-500/20 px-6 py-2.5 flex items-center gap-2 text-xs text-brand-400 shrink-0 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse shrink-0" />
          <span>Analyzing <strong className="font-semibold text-primary-custom">@{demoProfile.username}</strong></span>
          <span className="text-muted-custom mx-1">•</span>
          <span className="flex items-center gap-1"><Users size={12} /> {demoProfile.followers_count} followers</span>
          <span className="text-muted-custom mx-1">•</span>
          <span className="flex items-center gap-1"><TrendingUp size={12} /> {demoStats.engagement_rate.value}% engagement</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-brand-md mb-6" style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}>
                <Sparkles size={32} color="white" />
              </div>
              <h3 className="text-xl font-bold text-primary-custom mb-2">How can I help you grow today?</h3>
              <p className="text-sm text-secondary-custom mb-8">I have full context of your Instagram analytics and competitor performance.</p>
              
              <div className="w-full grid grid-cols-1 gap-2">
                {["What's my best posting time?", "How can I increase my reach?", "What content should I post this week?", "Analyze my competitors"].map((q, i) => (
                  <button 
                    key={i} 
                    onClick={() => setInput(q)}
                    className="p-3 bg-surface-3 border border-border-default rounded-xl text-sm text-primary-custom hover:border-brand-500 hover:bg-surface-4 transition-all text-left flex items-center gap-3"
                  >
                    <span className="w-6 h-6 rounded-full bg-surface-2 flex items-center justify-center text-brand-400"><MessageSquare size={12} /></span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-brand-sm" style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}>
                        <Zap size={14} color="white" />
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <div className={`px-4 py-3 text-[15px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-2xl rounded-tr-sm' : 'bg-surface-3 border border-border-default text-primary-custom rounded-2xl rounded-tl-sm'}`}>
                        {/* Process markdown-like bolding for demo */}
                        {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} className={msg.role === 'user' ? 'text-white' : 'text-primary-custom'}>{part.slice(2, -2)}</strong>;
                          }
                          // Handle newlines
                          return part.split('\n').map((line, j) => <span key={`${i}-${j}`}>{j > 0 && <br/>}{line}</span>);
                        })}
                      </div>
                      <span className={`text-[10px] text-muted-custom flex items-center gap-1 ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                        <Clock size={10} /> {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-brand-sm" style={{ background: "linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)" }}>
                      <Zap size={14} color="white" />
                    </div>
                    <div className="px-4 py-4 bg-surface-3 border border-border-default rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[46px]">
                      <motion.div className="w-2 h-2 rounded-full bg-brand-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                      <motion.div className="w-2 h-2 rounded-full bg-brand-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                      <motion.div className="w-2 h-2 rounded-full bg-brand-400" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface-2 border-t border-border-subtle shrink-0">
          <div className="relative flex items-center bg-surface-3 border border-border-strong rounded-2xl p-1 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500/50 transition-all shadow-sm max-w-4xl mx-auto">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask your AI coach anything..."
              className="flex-1 bg-transparent border-none focus:outline-none resize-none px-4 py-3 text-sm text-primary-custom max-h-32 min-h-[44px]"
              rows={1}
              style={{
                height: "auto"
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${input.trim() && !isTyping ? 'bg-brand-500 text-white shadow-brand-sm hover:bg-brand-400' : 'bg-surface-4 text-muted-custom'}`}
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-center text-[10px] text-muted-custom mt-2">AI Coach uses your real account data. AI can make mistakes. Verify important advice.</p>
        </div>
      </div>
    </div>
  );
}
