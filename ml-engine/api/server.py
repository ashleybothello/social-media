"""
Pulse AI — ML Engine
FastAPI server with 3 AI endpoints for content strategy, brand voice, and performance analysis.
Models are loaded from the models/ directory. Run training scripts to generate/update them.
"""
import os
import json
import random
import re
from typing import Optional
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ─── App Setup ──────────────────────────────────────────────
app = FastAPI(title="Pulse AI ML Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_DIR = Path(__file__).parent.parent / "models"

# Try to load trained models
strategy_model = None
voice_model = None
perf_model = None

try:
    import joblib
    if (MODEL_DIR / "strategy_model.pkl").exists():
        strategy_model = joblib.load(MODEL_DIR / "strategy_model.pkl")
        print("✅ Strategy model loaded")
    if (MODEL_DIR / "voice_model.pkl").exists():
        voice_model = joblib.load(MODEL_DIR / "voice_model.pkl")
        print("✅ Voice model loaded")
    if (MODEL_DIR / "performance_model.pkl").exists():
        perf_model = joblib.load(MODEL_DIR / "performance_model.pkl")
        print("✅ Performance model loaded")
except Exception as e:
    print(f"⚠️  Model loading note: {e}")

# ─── Data ─────────────────────────────────────────────────

DATA_DIR = Path(__file__).parent.parent / "training" / "data"

def load_json(filename: str) -> dict:
    filepath = DATA_DIR / filename
    if filepath.exists():
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

THEMES = load_json("themes.json") or {
    "default": ["Building Authority", "Community Growth", "Content Mastery", "Brand Amplification",
                "Conversion Sprint", "Trust Building", "Viral Reach", "Loyalty Loop"],
    "SaaS": ["Product-Led Growth", "Developer Relations", "Success Stories Sprint", "Feature Launch Blitz"],
    "Fitness": ["Transformation Stories", "30-Day Challenge", "Nutrition Science Hub", "Community Spotlight"],
    "E-commerce": ["Product Storytelling", "Social Proof Wave", "Seasonal Collection Drop", "Behind the Brand"],
    "Tech": ["Innovation Showcase", "Tech Teardown", "Future Trends", "Developer Spotlight"],
    "Food": ["Recipe Reel Series", "Farm to Fork Stories", "Chef Spotlight", "Seasonal Menu Drop"],
}

TOPICS = load_json("topics.json") or {
    "default": [
        "How we built our process from scratch", "The mistake that changed everything",
        "5 things nobody tells you about starting out", "Behind the scenes of our workflow",
        "What our customers taught us", "Day in the life of our team",
        "The tool stack that 10xd our output", "Controversial take on industry trends",
        "Before vs After transformation", "The framework we use for every project",
        "Why simplicity wins every time", "Our biggest failure and what we learned",
        "Step-by-step guide to getting started", "The psychology behind great content",
        "What the top 1% do differently", "How to stand out in a crowded market",
        "The one metric that actually matters", "Common myths debunked",
        "Industry predictions for next year", "How we handle objections",
        "The secret sauce behind viral content", "Lessons from our first 100 customers",
        "Guide to building authentic relationships", "The power of consistency in growth",
        "How we doubled engagement in 30 days", "Expert roundup: top tips from leaders",
        "Data-driven secrets to better content", "Our content creation process revealed",
    ]
}

HOOKS = load_json("hooks.json") or [
    "Stop scrolling. This will change how you think about {topic}.",
    "I spent 6 months testing this so you don't have to.",
    "Nobody talks about this, but it's the #1 reason brands fail.",
    "Here's the exact framework that got us from 0 to 10K.",
    "This one shift made all the difference for our {industry} brand.",
    "You're probably making this mistake right now.",
    "What if everything you knew about {topic} was wrong?",
    "We tried 50 strategies. Only 3 actually worked.",
    "This is the post I wish someone showed me when I started.",
    "Steal this strategy — it works every single time.",
]

CTAS = [
    "Save this for later — you'll need it.", "Follow for more actionable insights like this.",
    "Drop a 🔥 if this resonated.", "Share this with someone who needs to hear it.",
    "Comment your biggest takeaway below.", "Tag a friend who should see this.",
    "Which tip surprised you most? Tell us below.", "Double-tap if you agree.",
]

ANGLES = [
    "Personal story with data-backed insights", "Contrarian take that challenges the norm",
    "Step-by-step tutorial with real examples", "Myth-busting with evidence",
    "Behind-the-scenes authentic look", "Data visualization storytelling",
    "Before & after transformation", "Expert interview highlights",
    "Trend analysis with predictions", "Community-sourced wisdom",
]

FORMATS = {
    "Instagram": ["Carousel", "Reel", "Single Image", "Story Series", "Infographic"],
    "YouTube": ["Short", "Tutorial", "Vlog", "Interview", "Product Review"],
    "LinkedIn": ["Text Post", "Document/Carousel", "Article", "Poll", "Video"],
    "Twitter/X": ["Thread", "Single Tweet", "Quote Tweet", "Poll", "Image + Caption"],
}


# ─── Request/Response Models ────────────────────────────────

class StrategyRequest(BaseModel):
    industry: str
    brandStage: str
    brandPersonality: str
    socialGoals: list[str]
    platforms: list[str]
    timeHorizon: int

class CalendarPost(BaseModel):
    date: str
    goal: str
    topic: str
    hook: str
    content_angle: str
    cta: str
    platform: str
    format: str

class RoadmapPhase(BaseModel):
    phase: str
    theme: str
    focus: str

class StrategyResponse(BaseModel):
    roadmap: list[RoadmapPhase]
    calendar: list[CalendarPost]

class VoiceRequest(BaseModel):
    masterPost: str
    persona: str
    platform: str

class VoiceResponse(BaseModel):
    variations: list[str]

class PerfRequest(BaseModel):
    postContent: str
    metrics: dict[str, str]

class AnalysisResult(BaseModel):
    score: str
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]
    next_strategy: str

class PerfResponse(BaseModel):
    analysis: AnalysisResult

class RegenRequest(BaseModel):
    post: CalendarPost
    industry: str
    brand_personality: str

class RegenResponse(BaseModel):
    post: CalendarPost


# ─── Helpers ────────────────────────────────────────────────

def pick(lst):
    return random.choice(lst) if lst else ""

def pick_n(lst, n):
    shuffled = lst[:]
    random.shuffle(shuffled)
    return shuffled[:min(n, len(lst))]


# ─── 1. Strategy Generation ────────────────────────────────

@app.post("/generate-strategy", response_model=StrategyResponse)
async def generate_strategy(req: StrategyRequest):
    # Find matching industry themes
    industry_key = "default"
    for key in THEMES:
        if key.lower() in req.industry.lower():
            industry_key = key
            break

    themes = THEMES.get(industry_key, THEMES["default"])
    topics = TOPICS.get(industry_key, TOPICS["default"])

    # Generate roadmap
    num_phases = min(req.timeHorizon, 6)
    roadmap = []
    selected_themes = pick_n(themes, num_phases)
    for i, theme in enumerate(selected_themes):
        roadmap.append(RoadmapPhase(
            phase=f"Month {i + 1}",
            theme=theme,
            focus=req.socialGoals[i % len(req.socialGoals)] if req.socialGoals else "Growth",
        ))

    # Generate calendar
    calendar = []
    from datetime import datetime, timedelta
    start = datetime.now().replace(day=1)
    if start.day > 1:
        if start.month == 12:
            start = start.replace(year=start.year + 1, month=1, day=1)
        else:
            start = start.replace(month=start.month + 1, day=1)

    total_days = req.timeHorizon * 30
    topic_idx = 0

    for day in range(total_days):
        current = start + timedelta(days=day)
        if current.weekday() >= 5:  # Skip weekends
            continue
        if random.random() > 0.55:
            continue

        platform = pick(req.platforms)
        topic = topics[topic_idx % len(topics)]
        topic_idx += 1

        hook_template = pick(HOOKS if isinstance(HOOKS, list) else HOOKS.get("default", []))
        hook = hook_template.replace("{topic}", " ".join(topic.lower().split()[:3])).replace("{industry}", req.industry)

        calendar.append(CalendarPost(
            date=current.strftime("%Y-%m-%d"),
            goal=pick(req.socialGoals) if req.socialGoals else "Growth",
            topic=topic,
            hook=hook,
            content_angle=pick(ANGLES),
            cta=pick(CTAS),
            platform=platform,
            format=pick(FORMATS.get(platform, ["Post"])),
        ))

    return StrategyResponse(roadmap=roadmap, calendar=calendar)


# ─── 2. Brand Voice Transformation ─────────────────────────

PERSONA_TRANSFORMS = {
    "Professional": lambda t: ". ".join(
        " ".join(
            {"good": "exceptional", "great": "outstanding", "big": "significant",
             "use": "leverage", "help": "facilitate", "start": "initiate",
             "make": "develop", "get": "acquire", "show": "demonstrate"}.get(w.lower(), w)
            for w in s.split()
        )
        for s in re.split(r'[.!?]+', t) if s.strip()
    ) + ".",
    "Friendly": lambda t: f"Hey there! 👋 {t.replace('. ', '! ')} Can't wait to hear what you think! 💬 😊",
    "Gen-Z": lambda t: "no bc " + re.sub(r'very ', 'lowkey ', t, flags=re.I).replace("really ", "fr fr ") + " 💀\n\niykyk 🫡",
    "Corporate": lambda t: f"Executive Summary:\n\n{t}\n\nKey Takeaways:\n• Aligns with strategic objectives\n• Measurable ROI expected within Q2\n• Cross-functional synergies anticipated\n\nRecommended: Schedule follow-up briefing.",
    "Storyteller": lambda t: f"Picture this...\n\n{t.split('.')[0]}.\n\nIt wasn't always like this. Everything felt impossible. But then something shifted.\n\n{'. '.join(t.split('.')[1:])}.\n\nAnd that's when everything changed. 🌟\n\nWhat's your story? Share below. ↓",
    "Motivational": lambda t: f"🚀 Listen up.\n\n{t.upper()}\n\n🔥 The only person stopping you is YOU.\n\nDouble-tap if you're ready to level up. ⚡",
}

@app.post("/transform-voice", response_model=VoiceResponse)
async def transform_voice(req: VoiceRequest):
    transform = PERSONA_TRANSFORMS.get(req.persona, PERSONA_TRANSFORMS["Professional"])

    v1 = transform(req.masterPost)
    v2 = f"[{req.platform} Optimized]\n\n{transform('. '.join(reversed(req.masterPost.split('. '))))}"
    v3 = f"✨ {req.persona} Voice for {req.platform}:\n\n{transform(req.masterPost)}\n\n#{req.platform.replace('/', '')} #ContentStrategy #BrandVoice"

    return VoiceResponse(variations=[v1, v2, v3])


# ─── 3. Performance Analysis ───────────────────────────────

def analyze_content(content: str) -> dict:
    has_emojis = bool(re.search(r'[\U0001F600-\U0001F9FF]', content))
    has_hashtags = bool(re.search(r'#\w+', content))
    has_cta = bool(re.search(r'\b(comment|share|follow|tag|link|dm|save|click|subscribe|check)\b', content, re.I))
    first_line = content.split('\n')[0] if content else ""
    has_hook = len(first_line) < 100 and bool(re.search(r'[?!]', first_line))
    has_numbers = bool(re.search(r'\d+', content))
    word_count = len(content.split())
    readability = "good" if 20 < word_count < 300 else ("too_short" if word_count <= 20 else "too_long")
    return dict(has_emojis=has_emojis, has_hashtags=has_hashtags, has_cta=has_cta,
                has_hook=has_hook, has_numbers=has_numbers, word_count=word_count, readability=readability)

@app.post("/analyze-performance", response_model=PerfResponse)
async def analyze_performance(req: PerfRequest):
    a = analyze_content(req.postContent)
    m = req.metrics
    likes = int(m.get("likes", 0) or 0)
    comments = int(m.get("comments", 0) or 0)
    shares = int(m.get("shares", 0) or 0)
    saves = int(m.get("saves", 0) or 0)
    reach = int(m.get("reach", 1) or 1)

    eng_rate = ((likes + comments + shares + saves) / max(reach, 1)) * 100

    score = 50
    if eng_rate > 5: score += 20
    elif eng_rate > 2: score += 10
    if a["has_hook"]: score += 8
    if a["has_cta"]: score += 8
    if a["has_emojis"]: score += 4
    if a["has_hashtags"]: score += 5
    if a["has_numbers"]: score += 5
    if a["readability"] == "good": score += 5
    if comments > likes * 0.05: score += 5
    if saves > likes * 0.1: score += 5
    score = min(score, 100)

    strengths, weaknesses, recs = [], [], []

    if a["has_hook"]: strengths.append("Strong opening hook grabs attention")
    else: weaknesses.append("Missing a strong opening hook")
    if a["has_cta"]: strengths.append("Clear call-to-action drives engagement")
    else: weaknesses.append("No clear CTA — tell your audience what to do")
    if eng_rate > 3: strengths.append(f"High engagement rate ({eng_rate:.1f}%)")
    else: weaknesses.append(f"Low engagement rate ({eng_rate:.1f}%) — aim for 3%+")
    if saves > likes * 0.08: strengths.append("High save rate — bookmark-worthy content")
    if not a["has_hashtags"]: weaknesses.append("No hashtags — use 3-5 for discoverability")

    recs.append("Test posting at different times for peak engagement")
    if not a["has_hook"]: recs.append("Start with a pattern-interrupting first line")
    if not a["has_cta"]: recs.append("End every post with a specific CTA")
    recs.append("Repurpose this content across platforms")
    recs.append("Create a content series from top-performing themes")

    if score >= 80:
        ns = "Exceptional performance. Double down on this content pillar and expand into a series."
    elif score >= 60:
        ns = "Solid performance. A/B test hooks and CTAs. Try carousel or video format."
    else:
        ns = "Needs iteration. Revisit the hook, add a CTA, make content more actionable."

    return PerfResponse(analysis=AnalysisResult(
        score=f"{score}/100", strengths=strengths[:4], weaknesses=weaknesses[:4],
        recommendations=recs[:5], next_strategy=ns,
    ))


# ─── 4. Post Regeneration ──────────────────────────────────

@app.post("/regenerate-post", response_model=RegenResponse)
async def regenerate_post(req: RegenRequest):
    topics = TOPICS.get("default", ["New content idea"])
    new_topic = pick([t for t in topics if t != req.post.topic] or topics)
    hook_template = pick(HOOKS if isinstance(HOOKS, list) else [])
    hook = hook_template.replace("{topic}", " ".join(new_topic.lower().split()[:3])).replace("{industry}", req.industry) if hook_template else new_topic
    formats = FORMATS.get(req.post.platform, ["Post"])

    return RegenResponse(post=CalendarPost(
        date=req.post.date, goal=req.post.goal, topic=new_topic, hook=hook,
        content_angle=pick(ANGLES), cta=pick(CTAS), platform=req.post.platform, format=pick(formats),
    ))


# ─── Health ─────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "models": {
            "strategy": strategy_model is not None,
            "voice": voice_model is not None,
            "performance": perf_model is not None,
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
