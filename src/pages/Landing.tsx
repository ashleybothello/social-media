import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Sparkles,
  Wand2,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  Play,
  Star,
  Check,
  Instagram,
  Twitter,
  Globe,
  Shield,
  Cpu,
  Activity,
  ChevronRight,
} from 'lucide-react';

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Section Wrapper with useInView ──────────────────────────────────────────
function AnimatedSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Features Data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Sparkles,
    title: 'AI Insights',
    desc: 'Deep analytics and AI recommendations tailored to your unique audience and content mix.',
    color: '#7c6ef5',
    glow: 'rgba(124,110,245,0.25)',
  },
  {
    icon: Wand2,
    title: 'Content Studio',
    desc: 'Generate captions, ideas, and hooks in seconds using powerful generative AI.',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.25)',
  },
  {
    icon: BarChart3,
    title: 'AI Audit',
    desc: 'Get a Growth Score with visual breakdowns of reach, engagement, and authority.',
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.25)',
  },
  {
    icon: Users,
    title: 'Competitor Analysis',
    desc: 'Track and outpace your competitors with real-time benchmarking and gap analysis.',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.25)',
  },
  {
    icon: Calendar,
    title: 'Content Calendar',
    desc: 'Plan, schedule, and publish with AI suggestions for optimal posting times.',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.25)',
  },
  {
    icon: TrendingUp,
    title: 'Trend Discovery',
    desc: 'Stay ahead with real-time trend signals and viral content pattern detection.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.25)',
  },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Sophia Carter',
    role: 'Lifestyle Creator · 420K followers',
    quote:
      'AIXMedia completely changed how I think about content. The AI recommendations are scarily accurate — my engagement went up 68% in just 6 weeks.',
    rating: 5,
    avatar: 'S',
    color: '#7c6ef5',
  },
  {
    name: 'Marcus Lee',
    role: 'Head of Social · GrowthLab Agency',
    quote:
      "We manage 30+ client accounts and AIXMedia's competitor analysis saves us hours every week. The audit reports alone are worth the Agency plan.",
    rating: 5,
    avatar: 'M',
    color: '#10b981',
  },
  {
    name: 'Priya Nair',
    role: 'DTC Brand Founder · Lumina Skincare',
    quote:
      'The Content Studio is a game changer. We generate a week of captions in under 10 minutes and they actually sound like us. Incredible product.',
    rating: 5,
    avatar: 'P',
    color: '#ec4899',
  },
];

// ─── Pricing Tiers ────────────────────────────────────────────────────────────
const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Perfect for getting started',
    highlight: false,
    cta: 'Get Started Free',
    features: [
      '1 connected account',
      'Basic analytics dashboard',
      '30-day data history',
      '5 AI caption generations/mo',
      'Growth Score audit (weekly)',
      'Community support',
    ],
    missing: ['Competitor analysis', 'Content calendar', 'Trend discovery'],
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    desc: 'For serious creators and brands',
    highlight: true,
    cta: 'Start Pro — Free 14-day Trial',
    badge: 'Most Popular',
    features: [
      '5 connected accounts',
      'Full analytics + AI insights',
      '1-year data history',
      'Unlimited AI content generation',
      'Daily Growth Score audits',
      'Competitor tracking (up to 10)',
      'Content calendar + scheduling',
      'Trend discovery feed',
      'Priority email support',
    ],
    missing: [],
  },
  {
    name: 'Agency',
    price: '$79',
    period: '/month',
    desc: 'Built for teams and agencies',
    highlight: false,
    cta: 'Start Agency Trial',
    features: [
      'Unlimited connected accounts',
      'Everything in Pro',
      'White-label PDF reports',
      'Multi-workspace management',
      'Team collaboration (5 seats)',
      'Unlimited competitor tracking',
      'API access',
      'Dedicated account manager',
      'SLA-backed support',
    ],
    missing: [],
  },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Which social platforms does AIXMedia support?',
    a: 'AIXMedia currently supports Instagram natively, with Twitter/X, TikTok, and LinkedIn in active beta. When you connect your Instagram account via OAuth, we pull full post metrics, audience demographics, reach, and engagement data automatically.',
  },
  {
    q: 'Is my data secure? How is it stored?',
    a: "Your data is encrypted at rest and in transit using AES-256 and TLS 1.3. We never sell or share your data with third parties. You can export or delete all your data at any time from your account settings. We're SOC 2 Type II compliant.",
  },
  {
    q: 'How accurate are the AI-generated captions and recommendations?',
    a: 'Our AI is fine-tuned on social media performance data from millions of posts. The recommendations factor in your niche, posting history, audience behavior, and current trends. Most creators see measurable engagement improvements within the first 30 days.',
  },
  {
    q: 'Can I cancel or change plans at any time?',
    a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your billing settings. If you cancel, you retain access until the end of your billing period. No cancellation fees, ever.',
  },
  {
    q: 'Do you offer a free trial for paid plans?',
    a: 'Yes — Pro includes a 14-day free trial with no credit card required. Agency plans include a 7-day trial. You get full access to all features during the trial period. If you decide it is not for you, simply cancel before the trial ends.',
  },
];

// ─── Fake Sparkline SVG ───────────────────────────────────────────────────────
function SparkLine({
  color,
  points,
}: {
  color: string;
  points: string;
}) {
  return (
    <svg viewBox="0 0 120 40" className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,35 ${points} L120,5`}
        fill={`url(#grad-${color.replace('#', '')})`}
        stroke="none"
      />
      <path
        d={`M0,35 ${points} L120,5`}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Section refs for animations
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });

  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: '-80px' });

  const pricingRef = useRef(null);
  const pricingInView = useInView(pricingRef, { once: true, margin: '-80px' });

  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: '-80px' });

  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' });

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: 'var(--surface-1)', color: 'var(--text-primary)' }}
    >
      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-xl border-b'
            : 'backdrop-blur-none border-b border-transparent'
        }`}
        style={{
          backgroundColor: scrolled ? 'rgba(13,13,18,0.85)' : 'transparent',
          borderColor: scrolled ? 'var(--border-subtle)' : 'transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)',
                  boxShadow: '0 0 16px rgba(124,110,245,0.4)',
                }}
              >
                <Zap size={16} className="text-white" />
              </div>
              <span
                className="text-base font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                AIX<span className="gradient-text">Media</span>
              </span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              {['Features', 'Pricing', 'FAQ'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')
                  }
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex btn-ghost text-sm"
              >
                Log in
              </Link>
              <Link to="/register" className="btn-brand text-sm">
                Get Started
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.4, 0.55, 0.4],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse, rgba(124,110,245,0.18) 0%, rgba(168,85,247,0.08) 50%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.25, 0.4, 0.25],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse, rgba(59,130,246,0.12) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.35, 0.2],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute top-1/4 -right-32 w-[400px] h-[400px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse, rgba(236,72,153,0.12) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="badge-brand mb-6"
        >
          <Sparkles size={11} />
          Powered by Advanced AI · Now in Beta
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.08]"
          style={{ color: 'var(--text-primary)' }}
        >
          Grow Faster With{' '}
          <span className="gradient-text">AI-Powered</span>
          {' '}Social Media Intelligence
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="mt-6 text-lg sm:text-xl max-w-2xl leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Connect Instagram, analyze performance, discover trends, and get AI-powered growth
          recommendations — all in one intelligent platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-9 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            to="/register"
            className="btn-brand px-7 py-3.5 text-base font-semibold"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
          <button
            onClick={scrollToDemo}
            className="btn-ghost px-6 py-3.5 text-base font-medium flex items-center gap-2"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(124,110,245,0.15)', border: '1px solid rgba(124,110,245,0.3)' }}
            >
              <Play size={11} className="ml-0.5" style={{ color: '#7c6ef5' }} />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Floating Stats Badges */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3"
        >
          {[
            { icon: Users, label: '24K+ Users', color: '#7c6ef5', bg: 'rgba(124,110,245,0.1)', border: 'rgba(124,110,245,0.2)' },
            { icon: TrendingUp, label: '4.2% Avg Engagement', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
            { icon: Activity, label: '10M+ Posts Analyzed', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.2)' },
          ].map(({ icon: Icon, label, color, bg, border }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center gap-2.5 rounded-full px-4 py-2.5"
              style={{ background: bg, border: `1px solid ${border}`, backdropFilter: 'blur(8px)' }}
            >
              <Icon size={14} style={{ color }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={20} style={{ color: 'var(--text-muted)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4" ref={featuresRef}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <div className="badge-brand inline-flex mb-4">
              <Cpu size={11} />
              Everything you need to grow
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              One platform.{' '}
              <span className="gradient-text">Infinite growth.</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Every tool a modern creator or brand needs to dominate social media — powered by
              AI that learns your audience.
            </p>
          </motion.div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial="hidden"
                  animate={featuresInView ? 'visible' : 'hidden'}
                  variants={scaleUp}
                  custom={i}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="feature-card group cursor-default"
                >
                  {/* Icon */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `rgba(${parseInt(feat.color.slice(1, 3), 16)}, ${parseInt(feat.color.slice(3, 5), 16)}, ${parseInt(feat.color.slice(5, 7), 16)}, 0.12)`,
                      border: `1px solid rgba(${parseInt(feat.color.slice(1, 3), 16)}, ${parseInt(feat.color.slice(3, 5), 16)}, ${parseInt(feat.color.slice(5, 7), 16)}, 0.2)`,
                      boxShadow: `0 0 20px ${feat.glow}`,
                    }}
                  >
                    <Icon size={20} style={{ color: feat.color }} />
                  </div>

                  <div>
                    <h3
                      className="text-base font-semibold mb-1.5"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {feat.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {feat.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="mt-auto pt-2">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium transition-all duration-200 group-hover:gap-2"
                      style={{ color: feat.color }}
                    >
                      Learn more <ChevronRight size={12} />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ──────────────────────────────────────────────── */}
      <section id="demo" ref={demoRef} className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <div className="badge-brand inline-flex mb-4">
              <Activity size={11} />
              Live Dashboard Preview
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Your analytics,{' '}
              <span className="gradient-text">beautifully visualized</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              A unified command center for all your social data — updated in real time.
            </p>
          </AnimatedSection>

          {/* Mock Dashboard */}
          <AnimatedSection>
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: '1px solid var(--border-default)',
                background: 'var(--surface-2)',
                boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 0 80px rgba(124,110,245,0.08)',
              }}
            >
              {/* Window bar */}
              <div
                className="flex items-center gap-2 px-5 py-3.5 border-b"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-3)' }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
                <div
                  className="ml-4 flex-1 h-6 rounded-md flex items-center px-3 text-xs"
                  style={{ background: 'var(--surface-4)', color: 'var(--text-muted)' }}
                >
                  app.aixmedia.io/dashboard
                </div>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}
                />
              </div>

              {/* Dashboard content */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Sidebar */}
                <div
                  className="hidden lg:flex flex-col gap-1 rounded-xl p-4"
                  style={{ background: 'var(--surface-3)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-2.5 mb-4 px-2 pt-1">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #7c6ef5, #a855f7)' }}
                    >
                      <Zap size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      AIXMedia
                    </span>
                  </div>
                  {[
                    { icon: Activity, label: 'Dashboard', active: true },
                    { icon: BarChart3, label: 'Analytics', active: false },
                    { icon: Sparkles, label: 'AI Insights', active: false },
                    { icon: Wand2, label: 'Content Studio', active: false },
                    { icon: Users, label: 'Competitors', active: false },
                    { icon: Calendar, label: 'Calendar', active: false },
                    { icon: TrendingUp, label: 'Trends', active: false },
                  ].map(({ icon: Icon, label, active }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium"
                      style={{
                        background: active ? 'rgba(124,110,245,0.12)' : 'transparent',
                        color: active ? '#a89bf8' : 'var(--text-muted)',
                        border: active ? '1px solid rgba(124,110,245,0.15)' : '1px solid transparent',
                      }}
                    >
                      <Icon size={13} />
                      {label}
                    </div>
                  ))}
                </div>

                {/* Main area */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Total Followers', value: '42,861', delta: '+12.4%', color: '#7c6ef5', spark: 'L15,28 L30,22 L45,25 L60,16 L75,18 L90,10 L105,7' },
                      { label: 'Avg Engagement', value: '4.21%', delta: '+0.8%', color: '#10b981', spark: 'L15,30 L30,26 L45,28 L60,20 L75,22 L90,14 L105,10' },
                      { label: 'Posts This Month', value: '28', delta: '+4', color: '#3b82f6', spark: 'L15,32 L30,28 L45,30 L60,24 L75,18 L90,20 L105,12' },
                      { label: 'Growth Score', value: '87/100', delta: '+5pts', color: '#ec4899', spark: 'L15,34 L30,28 L45,30 L60,22 L75,16 L90,12 L105,8' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-xl p-4"
                        style={{ background: 'var(--surface-3)', border: '1px solid var(--border-subtle)' }}
                      >
                        <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                          {stat.label}
                        </p>
                        <p className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                          {stat.value}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium" style={{ color: stat.color }}>
                            {stat.delta}
                          </span>
                        </div>
                        <div className="mt-2">
                          <SparkLine color={stat.color} points={stat.spark} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Fake chart + AI panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Chart */}
                    <div
                      className="sm:col-span-2 rounded-xl p-4"
                      style={{ background: 'var(--surface-3)', border: '1px solid var(--border-subtle)' }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          Engagement Over Time
                        </span>
                        <span className="badge-success text-xs">↑ 18% vs last month</span>
                      </div>
                      <div className="relative h-28">
                        <svg viewBox="0 0 300 90" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#7c6ef5" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#7c6ef5" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {/* Grid lines */}
                          {[20, 40, 60, 80].map((y) => (
                            <line
                              key={y}
                              x1="0"
                              y1={y}
                              x2="300"
                              y2={y}
                              stroke="rgba(255,255,255,0.04)"
                              strokeWidth="1"
                            />
                          ))}
                          {/* Area fill */}
                          <path
                            d="M0,75 L25,65 L50,70 L75,55 L100,60 L125,42 L150,48 L175,35 L200,28 L225,32 L250,20 L275,15 L300,8 L300,90 L0,90 Z"
                            fill="url(#chartGrad)"
                          />
                          {/* Line */}
                          <path
                            d="M0,75 L25,65 L50,70 L75,55 L100,60 L125,42 L150,48 L175,35 L200,28 L225,32 L250,20 L275,15 L300,8"
                            fill="none"
                            stroke="#7c6ef5"
                            strokeWidth="2"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                          {/* Dots */}
                          {[
                            [0, 75], [50, 70], [100, 60], [150, 48], [200, 28], [250, 20], [300, 8],
                          ].map(([x, y]) => (
                            <circle
                              key={`${x}-${y}`}
                              cx={x}
                              cy={y}
                              r="3"
                              fill="#7c6ef5"
                              stroke="var(--surface-3)"
                              strokeWidth="1.5"
                            />
                          ))}
                        </svg>
                        {/* X labels */}
                        <div
                          className="absolute bottom-0 left-0 right-0 flex justify-between px-1"
                          style={{ color: 'var(--text-muted)', fontSize: '9px' }}
                        >
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m) => (
                            <span key={m}>{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* AI Panel */}
                    <div
                      className="rounded-xl p-4 flex flex-col gap-3"
                      style={{ background: 'var(--surface-3)', border: '1px solid var(--border-subtle)' }}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={13} style={{ color: '#7c6ef5' }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          AI Recommendations
                        </span>
                      </div>
                      {[
                        { text: 'Post Reels at 6–8 PM on Tues & Thurs for +34% reach', priority: 'High' },
                        { text: 'Add trending audio to next 3 posts to boost discovery', priority: 'Medium' },
                        { text: 'Engage with 15 niche accounts today to grow your network', priority: 'Medium' },
                      ].map((rec, i) => (
                        <div
                          key={i}
                          className="rounded-lg p-2.5"
                          style={{ background: 'var(--surface-4)', border: '1px solid var(--border-subtle)' }}
                        >
                          <p className="text-xs leading-snug mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                            {rec.text}
                          </p>
                          <span
                            className={rec.priority === 'High' ? 'badge-brand' : 'badge-warning'}
                            style={{ fontSize: '9px' }}
                          >
                            {rec.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gradient overlay at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, var(--surface-1) 0%, transparent 100%)',
                }}
              />
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4" ref={testimonialsRef}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate={testimonialsInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <div className="badge-brand inline-flex mb-4">
              <Star size={11} />
              Loved by creators worldwide
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Real results from{' '}
              <span className="gradient-text">real people</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Join thousands of creators and brands growing faster with AIXMedia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden"
                animate={testimonialsInView ? 'visible' : 'hidden'}
                variants={scaleUp}
                custom={i}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="glass-card p-6 flex flex-col gap-5"
              >
                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} size={13} fill="#f59e0b" className="text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}aa 100%)`,
                      boxShadow: `0 0 16px ${t.color}40`,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust bar */}
          <motion.div
            initial="hidden"
            animate={testimonialsInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            custom={4}
            className="mt-14 flex flex-wrap items-center justify-center gap-8"
          >
            {[
              { icon: Shield, label: 'SOC 2 Compliant' },
              { icon: Instagram, label: 'Instagram Partner' },
              { icon: Globe, label: 'GDPR Ready' },
              { icon: Users, label: '24,000+ Users' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                <Icon size={14} />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4" ref={pricingRef}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate={pricingInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <div className="badge-brand inline-flex mb-4">
              <Zap size={11} />
              Simple pricing
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Start free.{' '}
              <span className="gradient-text">Scale when ready.</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              No hidden fees. Cancel anytime. Every plan includes a free trial.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial="hidden"
                animate={pricingInView ? 'visible' : 'hidden'}
                variants={scaleUp}
                custom={i}
                className={`relative flex flex-col rounded-2xl p-7 ${
                  tier.highlight ? 'ring-2' : ''
                }`}
                style={{
                  background: tier.highlight ? 'var(--surface-3)' : 'var(--surface-2)',
                  border: tier.highlight
                    ? '1px solid rgba(124,110,245,0.4)'
                    : '1px solid var(--border-default)',
                  ringColor: tier.highlight ? '#7c6ef5' : 'transparent',
                  boxShadow: tier.highlight
                    ? '0 0 40px rgba(124,110,245,0.15), 0 20px 60px rgba(0,0,0,0.4)'
                    : '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                {/* Popular badge */}
                {tier.badge && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge-brand px-4 py-1 text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)',
                      color: 'white',
                      border: 'none',
                    }}
                  >
                    {tier.badge}
                  </div>
                )}

                {/* Tier name */}
                <div className="mb-5">
                  <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {tier.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {tier.desc}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-end gap-1.5">
                    <span
                      className="text-5xl font-bold tracking-tight"
                      style={{
                        color: tier.highlight ? '#a89bf8' : 'var(--text-primary)',
                        background: tier.highlight
                          ? 'linear-gradient(135deg, #7c6ef5, #a855f7)'
                          : 'none',
                        WebkitBackgroundClip: tier.highlight ? 'text' : 'initial',
                        WebkitTextFillColor: tier.highlight ? 'transparent' : 'initial',
                        backgroundClip: tier.highlight ? 'text' : 'initial',
                      }}
                    >
                      {tier.price}
                    </span>
                    <span
                      className="text-sm mb-2"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {tier.period}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  to="/register"
                  className={tier.highlight ? 'btn-brand w-full justify-center py-3 mb-7 text-sm font-semibold' : 'btn-ghost w-full justify-center py-3 mb-7 text-sm'}
                >
                  {tier.cta}
                  {tier.highlight && <ArrowRight size={14} />}
                </Link>

                {/* Features */}
                <div className="flex flex-col gap-2.5">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}
                      >
                        <Check size={10} style={{ color: '#10b981' }} />
                      </div>
                      <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4" ref={faqRef}>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate={faqInView ? 'visible' : 'hidden'}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <div className="badge-brand inline-flex mb-4">
              <Shield size={11} />
              Got questions?
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Frequently asked{' '}
              <span className="gradient-text">questions</span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                animate={faqInView ? 'visible' : 'hidden'}
                variants={fadeUp}
                custom={i}
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid var(--border-default)', background: 'var(--surface-2)' }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-all duration-200 hover:bg-white hover:bg-opacity-[0.02]"
                >
                  <span
                    className="text-sm font-semibold pr-4"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-6 pb-5 text-sm leading-relaxed"
                        style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)' }}
                      >
                        <div className="pt-4">{faq.a}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4" ref={ctaRef}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate={ctaInView ? 'visible' : 'hidden'}
            variants={scaleUp}
            className="relative rounded-2xl overflow-hidden text-center px-8 py-16"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-default)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            }}
          >
            {/* Background glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(124,110,245,0.15), transparent)',
              }}
            />

            <div className="relative z-10">
              <div className="badge-brand inline-flex mb-6">
                <Zap size={11} />
                Start for free today
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">
                Ready to{' '}
                <span className="gradient-text">grow faster?</span>
              </h2>

              <p
                className="text-lg max-w-xl mx-auto mb-8 leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                Join over 24,000 creators and brands already using AIXMedia to dominate their
                niche. Start free — no credit card required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="btn-brand px-8 py-3.5 text-base font-semibold"
                >
                  Get Started Free
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="btn-ghost px-6 py-3.5 text-base"
                >
                  Sign in to your account
                </Link>
              </div>

              <p className="mt-5 text-xs" style={{ color: 'var(--text-muted)' }}>
                Free plan forever · Pro includes 14-day trial · Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer
        className="py-14 px-4 border-t"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand col */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7c6ef5 0%, #a855f7 100%)' }}
                >
                  <Zap size={14} className="text-white" />
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  AIX<span className="gradient-text">Media</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                The AI-powered social media analytics platform built for creators and brands who
                want to grow smarter, not harder.
              </p>
              <div className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#10b981', boxShadow: '0 0 6px #10b981' }}
                />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  All systems operational
                </span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Product
              </h4>
              <ul className="flex flex-col gap-2.5">
                {['Features', 'Pricing', 'Changelog', 'Roadmap', 'API Docs'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-150"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')
                      }
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Company
              </h4>
              <ul className="flex flex-col gap-2.5">
                {['About', 'Blog', 'Careers', 'Press Kit', 'Contact'].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-150"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')
                      }
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Legal
              </h4>
              <ul className="flex flex-col gap-2.5">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security', 'GDPR'].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm transition-colors duration-150"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={(e) =>
                          ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')
                        }
                        onMouseLeave={(e) =>
                          ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')
                        }
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} AIXMedia. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Globe, label: 'Website' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="transition-colors duration-150"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = '#7c6ef5')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')
                  }
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
