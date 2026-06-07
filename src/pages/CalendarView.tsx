import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Sparkles, Film, Grid, BookOpen, FileText } from "lucide-react";
import { demoCalendarPosts } from "@/lib/demoData";
import { CalendarPost } from "@/types";

const typeColors = {
  reel: "bg-brand-500/20 text-brand-400 border-brand-500/30",
  carousel: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  story: "bg-warning/20 text-warning border-warning/30",
  post: "bg-success/20 text-success border-success/30",
};

const TypeIcon = ({ type, size = 12 }: { type: string, size?: number }) => {
  if (type === "reel") return <Film size={size} />;
  if (type === "carousel") return <Grid size={size} />;
  if (type === "story") return <BookOpen size={size} />;
  return <FileText size={size} />;
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState("all");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  
  const startingDayIndex = getDay(firstDayOfMonth);
  
  // Padding days for grid
  const prefixDays = Array.from({ length: startingDayIndex }).map((_, i) => {
    const d = new Date(firstDayOfMonth);
    d.setDate(d.getDate() - (startingDayIndex - i));
    return d;
  });
  
  const suffixDays = Array.from({ length: 42 - (daysInMonth.length + prefixDays.length) }).map((_, i) => {
    const d = new Date(lastDayOfMonth);
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  const allDays = [...prefixDays, ...daysInMonth, ...suffixDays];

  const nextPosts = demoCalendarPosts.filter(p => new Date(p.scheduled_for) >= new Date()).sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()).slice(0, 5);

  const getPostsForDay = (date: Date) => {
    return demoCalendarPosts.filter(p => isSameDay(new Date(p.scheduled_for), date) && (filter === "all" || p.status === filter));
  };

  return (
    <div className="page-container flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary-custom w-48">{format(currentDate, "MMMM yyyy")}</h1>
          <div className="flex items-center gap-1 bg-surface-2 rounded-lg border border-border-default p-1">
            <button onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() - 1); setCurrentDate(d); }} className="p-1 hover:bg-surface-3 rounded text-secondary-custom hover:text-primary-custom transition-colors"><ChevronLeft size={20} /></button>
            <button onClick={() => setCurrentDate(new Date())} className="text-sm px-2 font-medium text-secondary-custom hover:text-primary-custom transition-colors">Today</button>
            <button onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth() + 1); setCurrentDate(d); }} className="p-1 hover:bg-surface-3 rounded text-secondary-custom hover:text-primary-custom transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-surface-2 p-1 rounded-lg border border-border-default">
            {["all", "draft", "scheduled", "published"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${filter === f ? "bg-surface-4 text-primary-custom shadow-sm" : "text-muted-custom hover:text-secondary-custom"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="btn-brand text-sm px-4 py-2 h-auto shadow-none">
            <Plus size={16} className="mr-1" /> New Post
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col glass-card overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border-default shrink-0">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="py-3 text-center text-xs font-medium text-secondary-custom uppercase tracking-wider">{day}</div>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-7 h-full auto-rows-[minmax(100px,1fr)]">
              {allDays.map((date, i) => {
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isCurrentDay = isToday(date);
                const posts = getPostsForDay(date);
                
                return (
                  <div 
                    key={i} 
                    onClick={() => setSelectedDay(date)}
                    className={`border-r border-b border-border-subtle p-2 transition-colors hover:bg-surface-3/50 cursor-pointer flex flex-col gap-1
                      ${!isCurrentMonth ? "bg-surface-1/50" : ""}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full
                        ${isCurrentDay ? "bg-brand-500 text-white" : isCurrentMonth ? "text-primary-custom" : "text-muted-custom"}
                      `}>
                        {format(date, "d")}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      {posts.map(p => (
                        <div 
                          key={p.id} 
                          className={`text-[10px] flex items-center gap-1.5 px-1.5 py-1 rounded border truncate ${typeColors[p.content_type]}`}
                          title={p.title}
                        >
                          <TypeIcon type={p.content_type} size={10} />
                          <span className="truncate">{p.title}</span>
                          {p.ai_suggestion && <Sparkles size={10} className="ml-auto shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="hidden lg:flex flex-col w-72 shrink-0 gap-4 overflow-y-auto pr-1 no-scrollbar">
          <div className="glass-card p-5">
            <h3 className="font-semibold text-primary-custom mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-brand-400" /> Upcoming
            </h3>
            <div className="flex flex-col gap-3">
              {nextPosts.length > 0 ? nextPosts.map(p => (
                <div key={p.id} className="flex gap-3 items-start group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-surface-3 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${typeColors[p.content_type]}`}>
                    <TypeIcon type={p.content_type} size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-secondary-custom mb-0.5">{format(new Date(p.scheduled_for), "MMM d, h:mm a")}</p>
                    <p className="text-sm font-medium text-primary-custom truncate group-hover:text-brand-400 transition-colors">{p.title}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-custom">No upcoming posts scheduled.</p>
              )}
            </div>
          </div>

          <div className="glass-card p-5 bg-brand-500/5 border-brand-500/20">
            <h3 className="font-semibold text-brand-400 mb-4 flex items-center gap-2">
              <Sparkles size={18} /> AI Suggestions
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { title: "Carousel: 3 Myths About Instagram Growth", type: "carousel" },
                { title: "Reel: Trending Audio POV", type: "reel" },
                { title: "Story: Ask Me Anything Poll", type: "story" }
              ].map((s, i) => (
                <div key={i} className="bg-surface-1 p-3 rounded-lg border border-border-default cursor-pointer hover:border-brand-500/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1 text-xs text-secondary-custom">
                    <TypeIcon type={s.type} size={12} />
                    <span className="capitalize">{s.type}</span>
                  </div>
                  <p className="text-sm font-medium text-primary-custom">{s.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedDay && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md glass-card p-5 shadow-brand-lg z-50 border-brand-500/30"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-primary-custom">New Post for {format(selectedDay, "MMM d")}</h3>
              <button onClick={() => setSelectedDay(null)} className="text-muted-custom hover:text-primary-custom"><Plus className="rotate-45" size={20} /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Post title..." className="input-field w-full text-sm" autoFocus />
              <div className="flex gap-2">
                <select className="input-field text-sm flex-1">
                  <option>Reel</option>
                  <option>Carousel</option>
                  <option>Story</option>
                  <option>Post</option>
                </select>
                <input type="time" className="input-field text-sm w-32" defaultValue="18:00" />
              </div>
              <button className="btn-brand w-full justify-center" onClick={() => setSelectedDay(null)}>Schedule Draft</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
