// ML API service — tries Python backend first, falls back to built-in templates
// The ML backend runs at http://localhost:8000

import type { CalendarPost, RoadmapPhase } from '@/store/local-store';

const ML_API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '');

async function callML<T>(endpoint: string, body: object): Promise<T | null> {
  try {
    const res = await fetch(`${ML_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error('ML API error');
    return await res.json();
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// 1. STRATEGY GENERATION
// ═══════════════════════════════════════════════════════════

interface StrategyInput {
  industry: string;
  brandStage: string;
  brandPersonality: string;
  socialGoals: string[];
  platforms: string[];
  timeHorizon: number;
}

interface StrategyOutput {
  roadmap: RoadmapPhase[];
  calendar: CalendarPost[];
}

const THEMES_DB: Record<string, string[]> = {
  default: ['Building Authority', 'Community Growth', 'Content Mastery', 'Brand Amplification', 'Conversion Sprint', 'Trust Building', 'Audience Deep-Dive', 'Viral Reach', 'Loyalty Loop', 'Revenue Engine'],
  'SaaS': ['Product-Led Growth', 'Developer Relations', 'Success Stories Sprint', 'Feature Launch Blitz', 'Thought Leadership Push', 'Case Study Campaign'],
  'Fitness': ['Transformation Stories', '30-Day Challenge', 'Nutrition Science Hub', 'Community Spotlight', 'Expert Collab Series', 'Mindset Mastery Month'],
  'E-commerce': ['Product Storytelling', 'Social Proof Wave', 'Seasonal Collection Drop', 'Behind the Brand', 'Flash Sale Campaign', 'Customer UGC Month'],
  'Education': ['Knowledge Nuggets', 'Student Spotlight', 'Live Learning Series', 'Myth Busters Campaign', 'Career Pathways', 'Expert Interviews'],
  'Food': ['Recipe Reel Series', 'Farm to Fork Stories', 'Chef Spotlight', 'Seasonal Menu Drop', 'Food Science Fun', 'Community Cook-Along'],
  'Fashion': ['Style Edit Series', 'Sustainable Fashion', 'Trend Forecast', 'Behind the Seams', 'Capsule Wardrobe Challenge', 'Brand Heritage Stories'],
  'Tech': ['Innovation Showcase', 'Tech Teardown', 'Future Trends', 'Developer Spotlight', 'Use Case Deep-Dive', 'Product Roadmap Reveal'],
  'Real Estate': ['Market Insights', 'Property Showcase', 'Neighborhood Guide', 'First-Time Buyer Tips', 'Investment Strategy', 'Agent Life Diaries'],
};

const TOPICS_DB: Record<string, string[]> = {
  default: [
    'How we built our process from scratch', 'The mistake that changed everything', '5 things nobody tells you about starting out',
    'Behind the scenes of our workflow', 'What our customers taught us', 'Day in the life of our team',
    "The tool stack that 10x'd our output", "Controversial take on industry trends", "Before vs After transformation",
    "The framework we use for every project", "Why simplicity wins every time", "Our biggest failure and what we learned",
    "Step-by-step guide to getting started", "The psychology behind great content", "What the top 1% do differently",
    "Unpopular opinion that needs to be said", "How to stand out in a crowded market", "The one metric that actually matters",
    "Common myths debunked", "Q&A from our community", "Industry predictions for next year",
    'How we handle objections', 'The secret sauce behind viral content', 'Lessons from our first 100 customers',
    'Guide to building authentic relationships', 'The power of consistency in growth', 'How we doubled engagement in 30 days',
    'Expert roundup: top tips from leaders', 'Data-driven secrets to better content', 'Our content creation process revealed',
  ],
};

const HOOKS_DB = [
  'Stop scrolling. This will change how you think about {topic}.',
  'I spent 6 months testing this so you don\'t have to.',
  'Nobody talks about this, but it\'s the #1 reason brands fail.',
  'Here\'s the exact framework that got us from 0 to 10K.',
  'This one shift made all the difference for our {industry} brand.',
  'You\'re probably making this mistake right now.',
  'What if everything you knew about {topic} was wrong?',
  'The truth about {topic} that experts won\'t tell you.',
  'We tried 50 strategies. Only 3 actually worked.',
  'This is the post I wish someone showed me when I started.',
  'Hot take: {topic} is overrated. Here\'s what actually works.',
  'POV: You just discovered the future of {industry}.',
  '{topic} but make it actually useful.',
  'Steal this strategy — it works every single time.',
  'I\'m giving away our entire playbook. Save this.',
];

const CTAS_DB = [
  'Save this for later — you\'ll need it.', 'Follow for more actionable insights like this.',
  'Drop a 🔥 if this resonated.', 'Share this with someone who needs to hear it.',
  'Comment your biggest takeaway below.', 'DM us "STRATEGY" for a free deep-dive.',
  'Tag a friend who should see this.', 'Link in bio to learn more.',
  'Which tip surprised you most? Tell us below.', 'Double-tap if you agree.',
];

const ANGLES_DB = [
  'Personal story with data-backed insights', 'Contrarian take that challenges the norm',
  'Step-by-step tutorial with real examples', 'Myth-busting with evidence',
  'Behind-the-scenes authentic look', 'Data visualization storytelling',
  'Before & after transformation', 'Expert interview highlights',
  'Trend analysis with predictions', 'Community-sourced wisdom',
  'Problem → Solution framework', 'Listicle with deep-dive on each point',
];

const FORMATS_BY_PLATFORM: Record<string, string[]> = {
  Instagram: ['Carousel', 'Reel', 'Single Image', 'Story Series', 'Infographic'],
  YouTube: ['Short', 'Tutorial', 'Vlog', 'Interview', 'Product Review'],
  LinkedIn: ['Text Post', 'Document/Carousel', 'Article', 'Poll', 'Video'],
  'Twitter/X': ['Thread', 'Single Tweet', 'Quote Tweet', 'Poll', 'Image + Caption'],
};

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

function generateFallbackStrategy(input: StrategyInput): StrategyOutput {
  const industryKey = Object.keys(THEMES_DB).find(k =>
    input.industry.toLowerCase().includes(k.toLowerCase())
  ) || 'default';

  const themes = [...(THEMES_DB[industryKey] || THEMES_DB.default)];
  const topics = [...(TOPICS_DB[industryKey] || TOPICS_DB.default)];

  // Generate roadmap phases
  const numPhases = Math.min(input.timeHorizon, 6);
  const roadmap: RoadmapPhase[] = pickN(themes, numPhases).map((theme, i) => ({
    phase: `Month ${i + 1}`,
    theme,
    focus: input.socialGoals[i % input.socialGoals.length] || 'Growth',
  }));

  // Generate calendar posts
  const calendar: CalendarPost[] = [];
  const startDate = new Date();
  startDate.setDate(1);
  if (startDate.getDate() > 1) {
    startDate.setMonth(startDate.getMonth() + 1);
    startDate.setDate(1);
  }

  const totalDays = input.timeHorizon * 30;
  const postsPerWeek = Math.min(input.platforms.length * 2, 5);
  let topicIndex = 0;

  for (let day = 0; day < totalDays; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);
    const dayOfWeek = currentDate.getDay();

    // Post on specific days
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    if (Math.random() > 0.5 && postsPerWeek < 5) continue;

    const platform = pick(input.platforms);
    const topic = topics[topicIndex % topics.length];
    topicIndex++;

    const hookTemplate = pick(HOOKS_DB);
    const hook = hookTemplate
      .replace('{topic}', topic.toLowerCase().split(' ').slice(0, 3).join(' '))
      .replace('{industry}', input.industry);

    calendar.push({
      date: currentDate.toISOString().split('T')[0],
      goal: pick(input.socialGoals),
      topic,
      hook,
      content_angle: pick(ANGLES_DB),
      cta: pick(CTAS_DB),
      platform,
      format: pick(FORMATS_BY_PLATFORM[platform] || ['Post']),
    });
  }

  return { roadmap, calendar };
}

export async function generateStrategy(input: StrategyInput): Promise<StrategyOutput> {
  // Try ML backend first
  const mlResult = await callML<StrategyOutput>('/generate-strategy', input);
  if (mlResult) return mlResult;

  // Simulate AI processing delay
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1500));
  return generateFallbackStrategy(input);
}

// ═══════════════════════════════════════════════════════════
// 2. BRAND VOICE TRANSFORMATION
// ═══════════════════════════════════════════════════════════

interface VoiceInput {
  masterPost: string;
  persona: string;
  platform: string;
}

interface VoiceOutput {
  variations: string[];
}

const PERSONA_TRANSFORMS: Record<string, (text: string) => string> = {
  Professional: (t) => {
    const sentences = t.split(/[.!?]+/).filter(Boolean).map(s => s.trim());
    return sentences.map(s => {
      const words = s.split(' ');
      const upgraded = words.map(w => {
        const swaps: Record<string, string> = {
          'good': 'exceptional', 'great': 'outstanding', 'big': 'significant', 'use': 'leverage',
          'help': 'facilitate', 'start': 'initiate', 'make': 'develop', 'get': 'acquire',
          'show': 'demonstrate', 'try': 'endeavor', 'need': 'require', 'think': 'consider',
          'buy': 'invest in', 'change': 'transform', 'build': 'architect',
        };
        return swaps[w.toLowerCase()] || w;
      });
      return upgraded.join(' ');
    }).join('. ') + '.';
  },
  Friendly: (t) => {
    const friendly = t.replace(/\. /g, '! ').replace(/\.$/g, '! 😊');
    return `Hey there! 👋 ${friendly} Can't wait to hear what you think! 💬`;
  },
  'Gen-Z': (t) => {
    const sentences = t.split(/[.!?]+/).filter(Boolean).map(s => s.trim());
    const emojis = ['💀', '😭', '🔥', '✨', '💅', '👀', '🤌', '⚡', '📱', '🎯'];
    const slang = (s: string) => s
      .replace(/very /gi, 'lowkey ')
      .replace(/really /gi, 'fr fr ')
      .replace(/important/gi, 'a whole mood')
      .replace(/amazing/gi, 'bussin')
      .replace(/everyone/gi, 'bestie');
    return `no bc ${slang(sentences[0])} ${pick(emojis)}\n\n${sentences.slice(1).map(s => `${slang(s)} ${pick(emojis)}`).join('\n')}\n\niykyk 🫡`;
  },
  Corporate: (t) => {
    return `Executive Summary:\n\n${t}\n\nKey Takeaways:\n• This initiative aligns with our strategic objectives\n• Measurable ROI expected within Q2\n• Cross-functional synergies anticipated\n\nRecommended next steps: Schedule a follow-up briefing to discuss implementation roadmap.`;
  },
  Storyteller: (t) => {
    const sentences = t.split(/[.!?]+/).filter(Boolean).map(s => s.trim());
    return `Picture this...\n\n${sentences[0]}.\n\nIt wasn't always like this. I remember when we first started, everything felt impossible. But then something shifted.\n\n${sentences.slice(1).join('. ')}.\n\nAnd that's when everything changed. 🌟\n\nWhat's your story? Share it below. ↓`;
  },
  Motivational: (t) => {
    return `🚀 Listen up.\n\n${t.toUpperCase().split('. ').join('. 💪\n\n')}\n\n🔥 The only person stopping you is YOU.\n\nDouble-tap if you're ready to level up. Tag someone who needs to see this. ⚡`;
  },
};

function generateFallbackVoice(input: VoiceInput): VoiceOutput {
  const transform = PERSONA_TRANSFORMS[input.persona] || PERSONA_TRANSFORMS.Professional;

  const variation1 = transform(input.masterPost);
  const variation2 = `[${input.platform} Optimized]\n\n${transform(input.masterPost.split('. ').reverse().join('. '))}`;
  const variation3 = `✨ ${input.persona} Voice for ${input.platform}:\n\n${transform(input.masterPost)}\n\n#${input.platform.replace(/\//g, '')} #ContentStrategy #BrandVoice`;

  return { variations: [variation1, variation2, variation3] };
}

export async function transformVoice(input: VoiceInput): Promise<VoiceOutput> {
  const mlResult = await callML<VoiceOutput>('/transform-voice', input);
  if (mlResult) return mlResult;

  await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1000));
  return generateFallbackVoice(input);
}

// ═══════════════════════════════════════════════════════════
// 3. PERFORMANCE ANALYSIS
// ═══════════════════════════════════════════════════════════

interface PerfInput {
  postContent: string;
  metrics: Record<string, string>;
}

interface PerfOutput {
  analysis: {
    score: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    next_strategy: string;
  };
}

function analyzePostContent(content: string) {
  const hasEmojis = /[\u{1F600}-\u{1F9FF}]/u.test(content);
  const hasHashtags = /#\w+/.test(content);
  const hasCTA = /\b(comment|share|follow|tag|link|dm|save|click|subscribe|check)\b/i.test(content);
  const hasHook = content.split('\n')[0]?.length < 100 && /[?!]/.test(content.split('\n')[0] || '');
  const hasNumbers = /\d+/.test(content);
  const wordCount = content.split(/\s+/).length;
  const lineCount = content.split('\n').filter(Boolean).length;
  const readability = wordCount > 20 && wordCount < 300 ? 'good' : wordCount <= 20 ? 'too_short' : 'too_long';

  return { hasEmojis, hasHashtags, hasCTA, hasHook, hasNumbers, wordCount, lineCount, readability };
}

function generateFallbackAnalysis(input: PerfInput): PerfOutput {
  const analysis = analyzePostContent(input.postContent);
  const m = input.metrics;
  const likes = parseInt(m.likes || '0');
  const comments = parseInt(m.comments || '0');
  const shares = parseInt(m.shares || '0');
  const saves = parseInt(m.saves || '0');
  const reach = parseInt(m.reach || '1');
  const impressions = parseInt(m.impressions || '1');

  const engagementRate = reach > 0 ? ((likes + comments + shares + saves) / reach) * 100 : 0;

  let score = 50;
  if (engagementRate > 5) score += 20;
  else if (engagementRate > 2) score += 10;
  if (analysis.hasHook) score += 8;
  if (analysis.hasCTA) score += 8;
  if (analysis.hasEmojis) score += 4;
  if (analysis.hasHashtags) score += 5;
  if (analysis.hasNumbers) score += 5;
  if (analysis.readability === 'good') score += 5;
  if (comments > likes * 0.05) score += 5;
  if (saves > likes * 0.1) score += 5;
  score = Math.min(score, 100);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];

  if (analysis.hasHook) strengths.push('Strong opening hook that grabs attention');
  else weaknesses.push('Missing a strong opening hook — first line should be punchy');

  if (analysis.hasCTA) strengths.push('Clear call-to-action drives engagement');
  else weaknesses.push('No clear CTA — always tell your audience what to do next');

  if (engagementRate > 3) strengths.push(`High engagement rate (${engagementRate.toFixed(1)}%) — above industry average`);
  else weaknesses.push(`Low engagement rate (${engagementRate.toFixed(1)}%) — aim for 3%+ for healthy growth`);

  if (saves > 0 && saves > likes * 0.08) strengths.push('High save rate indicates valuable, bookmark-worthy content');
  if (shares > 0 && shares > likes * 0.05) strengths.push('Good share ratio suggests highly relatable content');
  if (comments > 0 && comments > likes * 0.03) strengths.push('Healthy comment ratio shows strong community engagement');

  if (analysis.readability === 'too_long') weaknesses.push('Post is too long — consider breaking into a carousel or thread');
  if (analysis.readability === 'too_short') weaknesses.push('Post feels thin — add more value, examples, or storytelling');
  if (!analysis.hasHashtags) weaknesses.push('No hashtags detected — use 3-5 relevant hashtags for discoverability');
  if (!analysis.hasEmojis) weaknesses.push('Missing visual breaks (emojis/formatting) — aids scannability');

  recommendations.push('Test posting at different times to find your audience\'s peak activity hours');
  if (!analysis.hasHook) recommendations.push('Start with a pattern-interrupting first line (question, bold claim, or stat)');
  if (!analysis.hasCTA) recommendations.push('End every post with a specific CTA (question, share prompt, or link)');
  recommendations.push('Repurpose this content across platforms in different formats');
  if (analysis.readability === 'good') recommendations.push('Your length is optimal — maintain this content density');
  recommendations.push('Create a content series based on your top-performing themes');

  let next_strategy = '';
  if (score >= 80) next_strategy = 'This post performed exceptionally. Double down on this content pillar. Create a series expanding on this topic. Consider turning it into a lead magnet or longer-form piece.';
  else if (score >= 60) next_strategy = 'Solid performance with room for growth. A/B test different hooks and CTAs. Try a carousel or video format of this same concept. Engage with every comment within 1 hour.';
  else next_strategy = 'This content needs iteration. Revisit the hook, add a strong CTA, and make the content more actionable. Study your top 3 performing posts and identify common patterns.';

  return {
    analysis: {
      score: `${score}/100`,
      strengths: strengths.slice(0, 4),
      weaknesses: weaknesses.slice(0, 4),
      recommendations: recommendations.slice(0, 5),
      next_strategy,
    },
  };
}

export async function analyzePerformance(input: PerfInput): Promise<PerfOutput> {
  const mlResult = await callML<PerfOutput>('/analyze-performance', input);
  if (mlResult) return mlResult;

  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
  return generateFallbackAnalysis(input);
}

// ═══════════════════════════════════════════════════════════
// 4. POST REGENERATION
// ═══════════════════════════════════════════════════════════

interface RegenInput {
  post: CalendarPost;
  industry: string;
  brand_personality: string;
}

export async function regeneratePost(input: RegenInput): Promise<{ post: CalendarPost }> {
  const mlResult = await callML<{ post: CalendarPost }>('/regenerate-post', input);
  if (mlResult) return mlResult;

  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

  const topics = TOPICS_DB.default;
  const newTopic = topics.find(t => t !== input.post.topic) || pick(topics);
  const formats = FORMATS_BY_PLATFORM[input.post.platform] || ['Post'];
  const hookTemplate = pick(HOOKS_DB);
  const hook = hookTemplate
    .replace('{topic}', newTopic.toLowerCase().split(' ').slice(0, 3).join(' '))
    .replace('{industry}', input.industry);

  return {
    post: {
      ...input.post,
      topic: newTopic,
      hook,
      content_angle: pick(ANGLES_DB),
      cta: pick(CTAS_DB),
      format: pick(formats),
    },
  };
}
