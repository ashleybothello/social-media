import { AnalyticsSnapshot, ContentIdea, GeneratedCaption, AIAudit, Competitor, CalendarPost, TrendItem, ChatMessage, InstagramProfile } from "@/types";

// ─── Demo Instagram Profile ───────────────────────────────────────────────────
export const demoProfile: InstagramProfile = {
  id: "demo-profile-1",
  instagram_id: "17841400008460056",
  username: "aixmedia.demo",
  name: "AIXMedia Demo",
  bio: "AI-Powered Social Media Growth 🚀\nContent Creator | Brand Builder\n📊 10K+ posts analyzed",
  profile_picture_url: "",
  followers_count: 24_830,
  following_count: 412,
  media_count: 183,
  website: "https://aixmedia.io",
  last_synced_at: new Date().toISOString(),
};

// ─── Demo Analytics (90 days) ─────────────────────────────────────────────────
function generateAnalytics(): AnalyticsSnapshot[] {
  const snapshots: AnalyticsSnapshot[] = [];
  let followers = 18_400;
  const start = new Date();
  start.setDate(start.getDate() - 89);

  for (let i = 0; i < 90; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const growthFactor = isWeekend ? 1.4 : 1.0;
    const growth = Math.floor((Math.random() * 120 + 40) * growthFactor);
    followers += growth;
    snapshots.push({
      date: date.toISOString().split("T")[0],
      followers,
      reach: Math.floor(Math.random() * 8000 + 3000),
      impressions: Math.floor(Math.random() * 15000 + 6000),
      engagement_rate: parseFloat((Math.random() * 3 + 2.5).toFixed(2)),
      profile_visits: Math.floor(Math.random() * 400 + 80),
    });
  }
  return snapshots;
}

export const demoAnalytics = generateAnalytics();

// ─── Demo Stats Cards ─────────────────────────────────────────────────────────
export const demoStats = {
  followers:       { value: 24_830, change: +8.4  },
  reach:           { value: 182_400, change: +12.1 },
  impressions:     { value: 341_200, change: +9.7  },
  engagement_rate: { value: 4.2,    change: +0.6  },
  profile_visits:  { value: 3_840,  change: +15.3 },
  growth_percent:  { value: 6.2,    change: +1.8  },
};

// ─── Demo Content Ideas ───────────────────────────────────────────────────────
export const demoContentIdeas: ContentIdea[] = [
  {
    id: "idea-1",
    type: "reel",
    title: "Day in the Life of a Content Creator",
    description: "Show your daily workflow — from planning to posting. Behind-the-scenes content gets 3x more saves.",
    hashtags: ["#contentcreator", "#dayinthelife", "#behindthescenes", "#creatorlife"],
    estimated_reach: 12_400,
    created_at: new Date().toISOString(),
  },
  {
    id: "idea-2",
    type: "carousel",
    title: "5 Mistakes Killing Your Instagram Reach",
    description: "Educational carousel listing common engagement mistakes. Carousels with 7-10 slides perform best.",
    hashtags: ["#instagramtips", "#socialmediagrowth", "#instagramgrowth", "#digitalmarketing"],
    estimated_reach: 18_200,
    created_at: new Date().toISOString(),
  },
  {
    id: "idea-3",
    type: "story",
    title: "Poll: What Content Do You Want More Of?",
    description: "Use the poll sticker to boost engagement and gather audience insights simultaneously.",
    hashtags: [],
    estimated_reach: 5_600,
    created_at: new Date().toISOString(),
  },
  {
    id: "idea-4",
    type: "reel",
    title: "\"Hot Take\" Trending Audio Transition",
    description: "Use a trending audio clip with a bold hot take about your niche. Controversy = reach.",
    hashtags: ["#hottake", "#trendingnow", "#viralreel", "#instagramreels"],
    estimated_reach: 28_000,
    created_at: new Date().toISOString(),
  },
  {
    id: "idea-5",
    type: "post",
    title: "Before & After Growth Transformation",
    description: "Share a before/after of your brand, content, or results. Transformation posts get 4x more shares.",
    hashtags: ["#transformation", "#growthmindset", "#beforeandafter", "#results"],
    estimated_reach: 9_800,
    created_at: new Date().toISOString(),
  },
  {
    id: "idea-6",
    type: "carousel",
    title: "The Viral Formula: Breaking Down a 1M+ View Reel",
    description: "Dissect a viral competitor post frame by frame. Teach your audience by example.",
    hashtags: ["#viralformula", "#reelstips", "#contentmarketing", "#instagramalgorithm"],
    estimated_reach: 22_500,
    created_at: new Date().toISOString(),
  },
];

// ─── Demo Generated Captions ──────────────────────────────────────────────────
export const demoCaption: GeneratedCaption = {
  id: "cap-1",
  caption: "The algorithm doesn't shadow-ban you. 📵\n\nIt just stops amplifying content that doesn't hold attention.\n\nHere's the truth nobody talks about:\n→ The first 3 seconds decide everything.\n→ No watch time = no reach.\n→ No reach = you blame the algorithm.\n\nFix your hook. Fix your reach. 🎯\n\nSave this if you needed the reminder. ↗️",
  cta: "Drop a 🔥 if you're done letting the algorithm win.",
  hashtags: ["#instagramgrowth", "#socialmediastrategy", "#contentcreator", "#digitalmarketing", "#instagramtips", "#growthhacking", "#contentmarketing", "#instagram2024", "#creatoreconomy", "#socialmediatips"],
  niche: "Social Media Marketing",
  goal: "Engagement",
  tone: "Bold & Direct",
  created_at: new Date().toISOString(),
};

// ─── Demo AI Audit ────────────────────────────────────────────────────────────
export const demoAudit: AIAudit = {
  id: "audit-1",
  growth_score: 72,
  branding: 80,
  consistency: 65,
  engagement: 78,
  posting_frequency: 60,
  seo: 70,
  content_quality: 82,
  recommendations: [
    "Post at least 4x per week — your current frequency is 2.3x/week which limits reach.",
    "Add keyword-rich bio words: your target audience searches for these terms.",
    "Your Reels outperform static posts by 3.2x — shift 60% of content to video.",
    "Carousel engagement is strong — increase educational carousel output.",
    "Reply to comments within the first hour — this signals activity to the algorithm.",
    "Optimize your highlights covers with branded visuals for profile trust.",
  ],
  created_at: new Date().toISOString(),
};

// ─── Demo Competitors ─────────────────────────────────────────────────────────
export const demoCompetitors: Competitor[] = [
  {
    id: "comp-1",
    username: "competitor.brand1",
    followers: 84_200,
    posting_frequency: "6.2x/week",
    engagement_rate: 3.1,
    top_content_themes: ["Educational Carousels", "Behind-the-Scenes", "User Testimonials"],
    growth_opportunity: "They rarely post Reels. Dominate short-form video in this niche.",
    added_at: new Date().toISOString(),
  },
  {
    id: "comp-2",
    username: "competitor.brand2",
    followers: 31_500,
    posting_frequency: "3.8x/week",
    engagement_rate: 5.4,
    top_content_themes: ["Trending Audio Reels", "Polls & Questions", "Product Reveals"],
    growth_opportunity: "High engagement but low reach. Outpace them with consistent SEO hashtags.",
    added_at: new Date().toISOString(),
  },
];

// ─── Demo Calendar Posts ──────────────────────────────────────────────────────
function getDateStr(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

export const demoCalendarPosts: CalendarPost[] = [
  { id: "cal-1", title: "Monday Motivation Reel", caption: "Start the week right...", scheduled_for: getDateStr(1), status: "scheduled", content_type: "reel", tags: ["motivation"], ai_suggestion: true },
  { id: "cal-2", title: "Algorithm Tips Carousel", caption: "5 things you must know...", scheduled_for: getDateStr(3), status: "scheduled", content_type: "carousel", tags: ["tips"] },
  { id: "cal-3", title: "Behind the Scenes Story", scheduled_for: getDateStr(4), status: "draft", content_type: "story", ai_suggestion: true },
  { id: "cal-4", title: "Brand Collab Announcement", caption: "Exciting news...", scheduled_for: getDateStr(6), status: "draft", content_type: "post" },
  { id: "cal-5", title: "Trending Audio Reel", scheduled_for: getDateStr(7), status: "scheduled", content_type: "reel", ai_suggestion: true },
  { id: "cal-6", title: "Q&A Story Session", scheduled_for: getDateStr(-2), status: "published", content_type: "story" },
  { id: "cal-7", title: "Weekly Analytics Share", scheduled_for: getDateStr(-5), status: "published", content_type: "carousel" },
];

// ─── Demo Trends ──────────────────────────────────────────────────────────────
export const demoTrends: TrendItem[] = [
  { id: "t1",  type: "hashtag", name: "#ContentCreator2024",    growth_percent: 142, usage_count: 2_400_000, category: "Creator" },
  { id: "t2",  type: "hashtag", name: "#InstagramGrowth",       growth_percent: 98,  usage_count: 8_100_000, category: "Growth" },
  { id: "t3",  type: "hashtag", name: "#AIContent",             growth_percent: 310, usage_count: 520_000,   category: "AI" },
  { id: "t4",  type: "hashtag", name: "#ViralReels",            growth_percent: 76,  usage_count: 15_200_000, category: "Reels" },
  { id: "t5",  type: "hashtag", name: "#SocialMediaMarketing",  growth_percent: 54,  usage_count: 32_800_000, category: "Marketing" },
  { id: "t6",  type: "audio",   name: "Espresso - Sabrina Carpenter", growth_percent: 890, category: "Pop" },
  { id: "t7",  type: "audio",   name: "Too Sweet - Hozier",     growth_percent: 640, category: "Indie" },
  { id: "t8",  type: "audio",   name: "Von dutch - Charli xcx",  growth_percent: 420, category: "Pop" },
  { id: "t9",  type: "topic",   name: "AI Tools for Creators",   growth_percent: 280, category: "Technology" },
  { id: "t10", type: "topic",   name: "Aesthetic Minimalism",    growth_percent: 165, category: "Lifestyle" },
  { id: "t11", type: "topic",   name: "Creator Economy Growth",  growth_percent: 210, category: "Business" },
  { id: "t12", type: "format",  name: "Text-On-Screen Reels",    growth_percent: 340, category: "Format" },
  { id: "t13", type: "format",  name: "Talking-Head POV",        growth_percent: 190, category: "Format" },
  { id: "t14", type: "format",  name: "Aesthetic B-Roll Reels",  growth_percent: 220, category: "Format" },
];

// ─── Demo AI Coach Messages ───────────────────────────────────────────────────
export const demoChat: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "👋 Hey! I'm your AI Growth Coach. I've analyzed your Instagram account and I'm ready to help you grow faster.\n\nYour account currently has **24,830 followers** with a **4.2% engagement rate** — that's above average! But your posting consistency score is 65/100. Want me to build you a posting schedule?",
    timestamp: new Date(Date.now() - 120_000).toISOString(),
  },
  {
    id: "msg-2",
    role: "user",
    content: "Yes! What's the best time for me to post?",
    timestamp: new Date(Date.now() - 60_000).toISOString(),
  },
  {
    id: "msg-3",
    role: "assistant",
    content: "Based on your audience's activity patterns, here are your **optimal posting windows**:\n\n📅 **Best Days:** Tuesday, Wednesday, Friday\n⏰ **Best Times:**\n- 7:00 AM – 9:00 AM (morning commute)\n- 12:00 PM – 1:00 PM (lunch scroll)\n- 7:00 PM – 9:00 PM (peak evening)\n\n🎯 **Pro tip:** Your Reels posted on Tuesday evenings get 2.8x more reach than average. Prioritize that slot for your best content!",
    timestamp: new Date().toISOString(),
  },
];
