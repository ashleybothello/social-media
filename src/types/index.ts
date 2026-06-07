// ─── Global Types for AIXMedia ───────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface InstagramProfile {
  id: string;
  instagram_id: string;
  username: string;
  name?: string;
  bio?: string;
  profile_picture_url?: string;
  followers_count: number;
  following_count: number;
  media_count: number;
  website?: string;
  last_synced_at?: string;
}

export interface AnalyticsSnapshot {
  date: string;
  followers: number;
  reach: number;
  impressions: number;
  engagement_rate: number;
  profile_visits: number;
}

export interface StatCard {
  label: string;
  value: string | number;
  change: number;         // +/- percent
  suffix?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ContentIdea {
  id: string;
  type: "reel" | "carousel" | "story" | "post";
  title: string;
  description: string;
  hashtags: string[];
  estimated_reach?: number;
  created_at: string;
}

export interface GeneratedCaption {
  id: string;
  caption: string;
  cta: string;
  hashtags: string[];
  niche: string;
  goal: string;
  tone: string;
  created_at: string;
}

export interface AIAudit {
  id: string;
  growth_score: number;
  branding: number;
  consistency: number;
  engagement: number;
  posting_frequency: number;
  seo: number;
  content_quality: number;
  recommendations: string[];
  created_at: string;
}

export interface Competitor {
  id: string;
  username: string;
  followers?: number;
  posting_frequency?: string;
  engagement_rate?: number;
  top_content_themes?: string[];
  growth_opportunity?: string;
  added_at: string;
}

export interface CalendarPost {
  id: string;
  title: string;
  caption?: string;
  scheduled_for: string;
  status: "draft" | "scheduled" | "published";
  content_type: "reel" | "carousel" | "story" | "post";
  tags?: string[];
  ai_suggestion?: boolean;
}

export interface TrendItem {
  id: string;
  type: "hashtag" | "audio" | "topic" | "format";
  name: string;
  growth_percent: number;
  usage_count?: number;
  category?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Demo mode flag
export const DEMO_MODE = !import.meta.env.VITE_API_URL;
