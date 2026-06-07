// Local storage management — replaces Supabase for now

export interface Strategy {
  id: string;
  title: string;
  industry: string;
  brand_stage: string;
  brand_personality: string;
  social_goals: string[];
  platforms: string[];
  time_horizon: number;
  roadmap: RoadmapPhase[];
  calendar: CalendarPost[];
  created_at: string;
}

export interface RoadmapPhase {
  phase: string;
  theme: string;
  focus: string;
}

export interface CalendarPost {
  date: string;
  goal: string;
  topic: string;
  hook: string;
  content_angle: string;
  cta: string;
  platform: string;
  format: string;
}

export interface BrandVoiceResult {
  id: string;
  original_post: string;
  cultural_persona: string;
  platform: string;
  variations: string[];
  created_at: string;
}

export interface PerformanceAnalysis {
  id: string;
  post_content: string;
  metrics: Record<string, string>;
  analysis: {
    score: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    next_strategy: string;
  };
  created_at: string;
}

const KEYS = {
  strategies: 'aix_strategies',
  brandVoice: 'aix_brand_voice',
  performance: 'aix_performance',
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setList<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// ── Strategies ──────────────────────────────────────────

export function getStrategies(): Strategy[] {
  return getList<Strategy>(KEYS.strategies).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getStrategy(id: string): Strategy | null {
  return getStrategies().find((s) => s.id === id) || null;
}

export function saveStrategy(data: Omit<Strategy, 'id' | 'created_at'>): Strategy {
  const strategy: Strategy = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  const list = getStrategies();
  list.unshift(strategy);
  setList(KEYS.strategies, list);
  return strategy;
}

export function updateStrategyCalendar(id: string, calendar: CalendarPost[]): void {
  const list = getStrategies();
  const idx = list.findIndex((s) => s.id === id);
  if (idx !== -1) {
    list[idx].calendar = calendar;
    setList(KEYS.strategies, list);
  }
}

export function deleteStrategy(id: string): void {
  setList(KEYS.strategies, getStrategies().filter((s) => s.id !== id));
}

// ── Brand Voice ─────────────────────────────────────────

export function saveBrandVoiceResult(data: Omit<BrandVoiceResult, 'id' | 'created_at'>): BrandVoiceResult {
  const result: BrandVoiceResult = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  const list = getList<BrandVoiceResult>(KEYS.brandVoice);
  list.unshift(result);
  setList(KEYS.brandVoice, list);
  return result;
}

// ── Performance ─────────────────────────────────────────

export function savePerformanceAnalysis(data: Omit<PerformanceAnalysis, 'id' | 'created_at'>): PerformanceAnalysis {
  const result: PerformanceAnalysis = {
    ...data,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  const list = getList<PerformanceAnalysis>(KEYS.performance);
  list.unshift(result);
  setList(KEYS.performance, list);
  return result;
}
