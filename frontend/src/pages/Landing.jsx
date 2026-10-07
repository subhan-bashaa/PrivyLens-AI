import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  Eye,
  AlertTriangle,
  FileSearch,
  Lock,
  Globe,
  Zap,
  MessageSquare,
  BarChart3,
  Bell,
  FileText,
  CheckCircle2,
  Sparkles,
  ScanSearch,
  ShieldCheck,
  TrendingUp,
  Users,
  Cookie,
  ChevronRight,
  BrainCircuit,
  Share2,
  Gauge,
  RefreshCw,
  Scale,
} from 'lucide-react';
import LandingNavbar from '../components/layout/LandingNavbar';
import Footer from '../components/layout/Footer';

// Chrome icon SVG component (since not present in recent lucide-react)
const Chrome = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="21.17" y1="8" x2="12" y2="8" />
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
  </svg>
);

/* ============================================
   Keyword Marquee Component — Infinite Right-to-Left
   ============================================ */
const MARQUEE_ITEMS = [
  { label: 'Privacy Analysis', Icon: ShieldCheck },
  { label: 'AI Risk Score', Icon: Sparkles },
  { label: 'Policy Insights', Icon: FileSearch },
  { label: 'Cookie Detection', Icon: Cookie },
  { label: 'Tracking Detection', Icon: Eye },
  { label: 'Data Sharing', Icon: Share2 },
  { label: 'Privacy Alerts', Icon: Bell },
  { label: 'Risk Assessment', Icon: Gauge },
  { label: 'Policy Monitoring', Icon: RefreshCw },
  { label: 'Compliance Check', Icon: Scale },
];

const KeywordCard = ({ label, Icon }) => (
  <div className="flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-card/60 border border-border/60 backdrop-blur-sm shadow-sm shadow-primary/5 flex-shrink-0">
    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary/70 flex-shrink-0" />
    <span className="text-[11px] sm:text-xs font-medium text-text-secondary whitespace-nowrap tracking-wide">
      {label}
    </span>
  </div>
);

const KeywordMarquee = () => (
  <div
    className="relative w-full overflow-hidden select-none pointer-events-none"
    aria-hidden="true"
  >
    {/* Edge fade masks */}
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        background:
          'linear-gradient(to right, var(--color-page-bg) 0%, transparent 8%, transparent 92%, var(--color-page-bg) 100%)',
      }}
    />

    {/* Scrolling track — items are duplicated for seamless looping */}
    <div className="keyword-marquee-track">
      {/* First copy */}
      {MARQUEE_ITEMS.map((item) => (
        <KeywordCard key={`a-${item.label}`} label={item.label} Icon={item.Icon} />
      ))}
      {/* Second copy (for seamless infinite loop) */}
      {MARQUEE_ITEMS.map((item) => (
        <KeywordCard key={`b-${item.label}`} label={item.label} Icon={item.Icon} />
      ))}
    </div>
  </div>
);

/* ============================================
   Section: Hero
   ============================================ */
const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    {/* Background Gradient Orbs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary/8 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
    </div>

    <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">AI-Powered Privacy Intelligence</span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-primary leading-tight mb-6 animate-fade-in">
        Understand Privacy
        <br />
        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Before You Accept
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
        AI-powered privacy policy analysis that turns complex legal language into
        simple, actionable privacy insights. Know what you're agreeing to.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in">
        <Link
          to="/register"
          className="
            inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold
            text-white bg-primary rounded-2xl
            hover:bg-primary-dark shadow-lg shadow-primary/25
            hover:shadow-xl hover:shadow-primary/30
            transition-all duration-300 hover:-translate-y-0.5
          "
        >
          Get Started Free
          <ArrowRight className="w-5 h-5" />
        </Link>
        <a
          href="#extension"
          className="
            inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold
            text-text-primary bg-card border border-border rounded-2xl
            hover:border-primary/30 hover:shadow-lg
            transition-all duration-300 hover:-translate-y-0.5
          "
        >
          <Chrome className="w-5 h-5 text-primary" />
          Install Extension
        </a>
      </div>

      {/* ===== Keyword Marquee ===== */}
      <div className="mb-10 animate-fade-in">
        <KeywordMarquee />
      </div>

      {/* Hero Visual — Floating Dashboard Preview */}
      <div className="relative max-w-4xl mx-auto animate-fade-in">
        <div className="bg-card rounded-2xl border border-border shadow-2xl p-6 md:p-8">
          {/* Mock Dashboard Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">WhatsApp Privacy Policy</p>
                <p className="text-xs text-text-tertiary">Last analyzed 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold bg-warning-light text-warning-dark rounded-full">
                ⚠ Medium Risk
              </span>
            </div>
          </div>

          {/* Mock Score + Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Privacy Score */}
            <div className="bg-page-bg rounded-xl p-5 border border-border-light text-center">
              <p className="text-xs font-medium text-text-tertiary mb-2 uppercase tracking-wide">Privacy Score</p>
              <p className="text-4xl font-extrabold bg-gradient-to-r from-warning to-warning-dark bg-clip-text text-transparent">
                7.2
              </p>
              <p className="text-xs text-text-tertiary mt-1">out of 10</p>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-2 grid grid-cols-3 gap-3">
              {[
                { label: 'Data Collected', value: '6 types', color: 'text-danger' },
                { label: 'Third Parties', value: '5 found', color: 'text-warning' },
                { label: 'User Rights', value: '4 available', color: 'text-success' },
              ].map((stat) => (
                <div key={stat.label} className="bg-page-bg rounded-xl p-4 border border-border-light">
                  <p className="text-xs font-medium text-text-tertiary mb-1">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
              {/* Key Findings Preview */}
              <div className="col-span-3 bg-page-bg rounded-xl p-4 border border-border-light">
                <p className="text-xs font-medium text-text-tertiary mb-2">Key Findings</p>
                <div className="space-y-1.5">
                  {[
                    '• Collects name, email, and device information',
                    '• Shares data with analytics and ad partners',
                    '• Users can request data deletion',
                  ].map((finding, i) => (
                    <p key={i} className="text-xs text-text-secondary">{finding}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glow effect behind card */}
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl blur-2xl -z-10" />
      </div>
    </div>
  </section>
);

/* ============================================
   Section: Problem (Scroll-Driven Stack Deck Style)
   ============================================ */
const Problem = () => {
  const PROBLEM_CARDS = [
    {
      id: 'problem-01',
      step: '01',
      stat: '4,000+',
      label: 'Average Words',
      title: '4,000+ Average Words',
      desc: 'Most privacy policies are longer than the US Constitution. A typical policy requires 45+ minutes of legal deciphering that nobody has time to read.',
      icon: FileText,
      tag1: 'VOLUME',
      tag2: 'EXCESSIVE',
      tag2Color: 'bg-danger/15 text-danger border-danger/30',
      highlight: '45+ minutes required to read dense legal clauses',
      meta: 'Industry Benchmark: 4,000 to 7,500 words',
      personaAvatars: ['bg-red-500', 'bg-orange-500', 'bg-amber-500'],
    },
    {
      id: 'problem-02',
      step: '02',
      stat: '91%',
      label: 'Don\'t Read',
      title: "91% Don't Read",
      desc: 'Users accept privacy terms without reading a single word, routinely surrendering sensitive biometric, location, and behavioral tracking permissions.',
      icon: Users,
      tag1: 'BEHAVIOR',
      tag2: 'BLIND TRUST',
      tag2Color: 'bg-warning/15 text-warning-dark border-warning/30',
      highlight: 'Users blindly consent to sweeping telemetry rights',
      meta: '9 out of 10 users click "Accept All"',
      personaAvatars: ['bg-amber-500', 'bg-yellow-500', 'bg-red-500'],
    },
    {
      id: 'problem-03',
      step: '03',
      stat: '73%',
      label: 'Over-Collect',
      title: '73% Over-Collect',
      desc: 'Three out of four digital apps and web services collect significantly more personal data, device identifiers, and network telemetry than needed.',
      icon: Eye,
      tag1: 'SURVEILLANCE',
      tag2: 'HIGH RISK',
      tag2Color: 'bg-danger/15 text-danger border-danger/30',
      highlight: 'Unnecessary behavioral telemetry sent to 3rd parties',
      meta: 'Audited across 5,000+ popular apps',
      personaAvatars: ['bg-rose-500', 'bg-red-500', 'bg-pink-500'],
    },
  ];

  const scrollToCard = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="py-24 bg-card relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger-light text-danger-dark text-xs font-semibold mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            The Problem
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Privacy Policies Are Designed to Confuse
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            The average privacy policy is 4,000+ words of dense legal language.
            Nobody reads them — but everyone clicks &quot;Accept.&quot;
          </p>

          {/* Quick Deck Filter / Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {PROBLEM_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => scrollToCard(card.id)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-page-bg border border-border text-text-secondary hover:text-text-primary hover:border-danger/40 transition-all cursor-pointer shadow-sm"
              >
                <span className="text-danger font-bold mr-1.5">{card.step}</span>
                <span>{card.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll-Driven Stacked Card Deck */}
        <div className="relative space-y-10 pb-16">
          {PROBLEM_CARDS.map((card, index) => (
            <div
              key={card.title}
              id={card.id}
              className="sticky transition-all duration-300"
              style={{
                top: `calc(105px + ${index * 30}px)`,
                zIndex: index + 10,
              }}
            >
              <div className="bg-page-bg rounded-[2rem] sm:rounded-[2.5rem] border border-border/80 shadow-2xl shadow-black/25 p-7 sm:p-9 md:p-10 backdrop-blur-xl hover:border-danger/30 transition-all duration-300">
                {/* Card Header matching reference image */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  {/* Left: Circle icon + Title/Stat */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-danger/30 flex items-center justify-center bg-danger-light shrink-0 shadow-sm">
                      <card.icon className="w-5 h-5 text-danger" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                        {card.title}
                      </h3>
                      <span className="text-xs font-semibold text-danger uppercase tracking-wider">
                        {card.label}
                      </span>
                    </div>
                  </div>

                  {/* Right: Sleek tag pills matching reference */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-3.5 py-1 rounded-xl bg-card border border-border text-[11px] font-bold text-text-tertiary tracking-wider uppercase">
                      {card.tag1}
                    </span>
                    <span
                      className={`px-3.5 py-1 rounded-xl border text-[11px] font-bold tracking-wider uppercase ${card.tag2Color}`}
                    >
                      {card.tag2}
                    </span>
                  </div>
                </div>

                {/* Card Description */}
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-6 max-w-3xl font-normal">
                  {card.desc}
                </p>

                {/* Highlight feature pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card/80 border border-border/60 text-xs font-medium text-danger mb-6">
                  <AlertTriangle className="w-3.5 h-3.5 text-danger shrink-0" />
                  <span>{card.highlight}</span>
                </div>

                {/* Card Footer matching screenshot (Avatars on left, Meta note on right) */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      {card.personaAvatars.map((bg, aIdx) => (
                        <div
                          key={aIdx}
                          className={`inline-block w-8 h-8 rounded-full ring-2 ring-page-bg ${bg} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                        >
                          {aIdx === 0 ? '!' : aIdx === 1 ? '⚠' : '×'}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-text-tertiary hidden sm:inline-block">
                      Consumer Privacy Impact
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-medium text-text-tertiary">
                    {card.meta}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   Section: Solution
   ============================================ */
const Solution = () => (
  <section className="py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-light text-success-dark text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            The Solution
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            AI That Reads Privacy Policies
            <span className="text-primary"> So You Don't Have To</span>
          </h2>
          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            PrivyLens AI uses advanced language models to analyze, summarize, and score
            privacy policies in seconds. Get clear, evidence-backed insights about what
            any app or website does with your data.
          </p>

          <div className="space-y-4">
            {[
              'Instant AI-powered summaries of any privacy policy',
              'Privacy Trust Score from 1–10 with risk level',
              'Evidence-backed findings linked to original clauses',
              'Continuous monitoring for policy changes',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Visual Card Stack */}
        <div className="relative">
          <div className="space-y-4">
            {[
              {
                icon: ScanSearch,
                color: 'bg-primary/10 text-primary',
                title: 'Analyze',
                desc: 'Paste a URL or upload a policy — AI handles the rest.',
              },
              {
                icon: Sparkles,
                color: 'bg-secondary/10 text-secondary',
                title: 'Understand',
                desc: 'Get a clear summary with risk score and key findings.',
              },
              {
                icon: ShieldCheck,
                color: 'bg-accent/10 text-accent',
                title: 'Decide',
                desc: 'Make informed privacy decisions with real evidence.',
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex items-start gap-5"
              >
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center shrink-0`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-text-primary mb-1">{card.title}</h4>
                  <p className="text-sm text-text-tertiary">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10" />
        </div>
      </div>
    </div>
  </section>
);

/* ============================================
   Section: How It Works (Scroll-Driven Stack Deck Style)
   ============================================ */
const HowItWorks = () => {
  const STEPS = [
    {
      id: 'step-01',
      step: '01',
      icon: Globe,
      title: 'Browse Normally',
      color: 'primary',
      tag1: 'AUTO-SNIFFER',
      tag2: 'ZERO EFFORT',
      tag2Color: 'bg-primary/15 text-primary border-primary/30',
      desc: 'Our Chrome extension automatically detects privacy policies and cookie consent banners as you browse. No copy-pasting or manual steps needed.',
      highlight: 'Passive real-time radar runs silently in the background',
      meta: 'Automated Detection • Zero Configuration',
      personaAvatars: ['bg-emerald-500', 'bg-teal-500', 'bg-cyan-500'],
    },
    {
      id: 'step-02',
      step: '02',
      icon: BrainCircuit,
      title: 'AI Analyzes',
      color: 'secondary',
      tag1: '11 PILLARS',
      tag2: '1.8S INFERENCE',
      tag2Color: 'bg-secondary/15 text-secondary border-secondary/30',
      desc: 'Advanced statutory AI reads and extracts key facts across 45,000+ characters, scoring data collection, tracking, retention, and erasure rights in seconds.',
      highlight: 'Every finding anchored directly to exact legal clauses',
      meta: 'NIST Framework & DPDP Act 2023 Benchmarked',
      personaAvatars: ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500'],
    },
    {
      id: 'step-03',
      step: '03',
      icon: ShieldCheck,
      title: 'You Decide',
      color: 'accent',
      tag1: 'TRUST SCORE',
      tag2: 'VERDICT',
      tag2Color: 'bg-accent/15 text-accent border-accent/30',
      desc: 'Get an objective 1–10 Privacy Score, plain-language bullet points, highlighted red flags, and trust recommendations before you accept terms.',
      highlight: 'Simple summary with one-click deep link to full web audit',
      meta: 'Informed Consent Without Confusion',
      personaAvatars: ['bg-cyan-500', 'bg-emerald-500', 'bg-amber-500'],
    },
  ];

  const scrollToCard = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="how-it-works" className="py-24 bg-card relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Zap className="w-3.5 h-3.5" />
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            From Confusion to Clarity in Seconds
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Three simple steps to understand any privacy policy.
          </p>

          {/* Quick Deck Filter / Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {STEPS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => scrollToCard(card.id)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-page-bg border border-border text-text-secondary hover:text-text-primary hover:border-primary/40 transition-all cursor-pointer shadow-sm"
              >
                <span className="text-primary font-bold mr-1.5">{card.step}</span>
                <span>{card.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll-Driven Stacked Card Deck */}
        <div className="relative space-y-10 pb-16">
          {STEPS.map((stepItem, index) => (
            <div
              key={stepItem.title}
              id={stepItem.id}
              className="sticky transition-all duration-300"
              style={{
                top: `calc(105px + ${index * 30}px)`,
                zIndex: index + 10,
              }}
            >
              <div className="bg-page-bg rounded-[2rem] sm:rounded-[2.5rem] border border-border/80 shadow-2xl shadow-black/25 p-7 sm:p-9 md:p-10 backdrop-blur-xl hover:border-primary/40 transition-all duration-300">
                {/* Card Header matching reference image */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  {/* Left: Circle icon + Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-border/80 flex items-center justify-center bg-card shrink-0 shadow-sm">
                      <stepItem.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                        {stepItem.title}
                      </h3>
                      <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                        Step {stepItem.step}
                      </span>
                    </div>
                  </div>

                  {/* Right: Sleek tag pills */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-3.5 py-1 rounded-xl bg-card border border-border text-[11px] font-bold text-text-tertiary tracking-wider uppercase">
                      {stepItem.tag1}
                    </span>
                    <span
                      className={`px-3.5 py-1 rounded-xl border text-[11px] font-bold tracking-wider uppercase ${stepItem.tag2Color}`}
                    >
                      {stepItem.tag2}
                    </span>
                  </div>
                </div>

                {/* Card Description */}
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-6 max-w-3xl font-normal">
                  {stepItem.desc}
                </p>

                {/* Highlight feature pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-card/80 border border-border/60 text-xs font-medium text-text-primary mb-6">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{stepItem.highlight}</span>
                </div>

                {/* Card Footer matching screenshot (Avatars on left, Meta note on right) */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      {stepItem.personaAvatars.map((bg, aIdx) => (
                        <div
                          key={aIdx}
                          className={`inline-block w-8 h-8 rounded-full ring-2 ring-page-bg ${bg} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                        >
                          {aIdx === 0 ? '1' : aIdx === 1 ? '2' : '3'}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-text-tertiary hidden sm:inline-block">
                      Autonomous Intelligence Pipeline
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm font-medium text-text-tertiary">
                    {stepItem.meta}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   Section: Key Features (Scroll-Driven Stack Deck Style)
   ============================================ */
const KeyFeatures = () => {
  const FEATURE_CARDS = [
    {
      id: 'feature-01',
      step: '01',
      title: 'Smart Analysis',
      desc: 'Analyze any privacy policy by URL, PDF upload, or app search. AI extracts key privacy details, data collection, and sharing practices instantly.',
      icon: ScanSearch,
      tag1: 'INGESTION',
      tag2: 'INSTANT',
      tag2Color: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
      highlight: 'URL, PDF & App Name Ingestion',
      meta: 'Audited in under 1.8s',
      personaAvatars: ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500'],
    },
    {
      id: 'feature-02',
      step: '02',
      title: 'Privacy Trust Score',
      desc: 'A clear 1–10 score that tells you how privacy-friendly an app or service really is, grounded in NIST and statutory data privacy frameworks.',
      icon: BarChart3,
      tag1: 'BENCHMARK',
      tag2: 'SCORE 1-10',
      tag2Color: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
      highlight: 'Deterministic 11-category privacy rating',
      meta: 'Calibrated across 12,000+ policies',
      personaAvatars: ['bg-amber-500', 'bg-emerald-500', 'bg-indigo-500'],
    },
    {
      id: 'feature-03',
      step: '03',
      title: 'Evidence-Based',
      desc: 'Every AI finding is linked to the exact clause in the original policy for full transparency. No guesswork or LLM hallucinations.',
      icon: FileSearch,
      tag1: 'CITATIONS',
      tag2: 'VERIFIED',
      tag2Color: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
      highlight: '100% Verbatim statutory clause links',
      meta: 'Full legal transparency',
      personaAvatars: ['bg-blue-500', 'bg-cyan-500', 'bg-violet-500'],
    },
    {
      id: 'feature-04',
      step: '04',
      title: 'Policy Monitoring',
      desc: 'Automatic monitoring detects changes in policies you care about and alerts you immediately when terms or third-party scopes change.',
      icon: Eye,
      tag1: 'SURVEILLANCE',
      tag2: 'REAL-TIME',
      tag2Color: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30',
      highlight: 'Automated policy drift alerts',
      meta: 'Continuous background radar',
      personaAvatars: ['bg-cyan-500', 'bg-emerald-500', 'bg-pink-500'],
    },
    {
      id: 'feature-05',
      step: '05',
      title: 'AI Assistant',
      desc: 'Ask natural language questions about any policy: "Does this app share my location?" or "Can I request account erasure?"',
      icon: MessageSquare,
      tag1: 'INTERACTIVE',
      tag2: 'RAG CHAT',
      tag2Color: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
      highlight: 'Context-grounded privacy question answering',
      meta: 'Powered by Gemini RAG',
      personaAvatars: ['bg-purple-500', 'bg-blue-500', 'bg-amber-500'],
    },
    {
      id: 'feature-06',
      step: '06',
      title: 'Version Comparison',
      desc: 'See exactly what changed between policy versions with clear diff visualization, highlighted clause revisions, and risk deltas.',
      icon: Lock,
      tag1: 'AUDIT TRAIL',
      tag2: 'DIFF VIEW',
      tag2Color: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
      highlight: 'Side-by-side clause additions and removals',
      meta: 'Historical change timeline',
      personaAvatars: ['bg-rose-500', 'bg-indigo-500', 'bg-emerald-500'],
    },
  ];

  const scrollToCard = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Everything You Need for Privacy Intelligence
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Powerful tools designed to give you complete control over your privacy.
          </p>

          {/* Quick Deck Filter / Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {FEATURE_CARDS.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => scrollToCard(card.id)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-card border border-border text-text-secondary hover:text-text-primary hover:border-primary/40 transition-all cursor-pointer shadow-sm"
              >
                <span className="text-primary font-bold mr-1.5">{card.step}</span>
                <span>{card.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scroll-Driven Stacked Card Deck */}
        <div className="relative space-y-10 pb-20">
          {FEATURE_CARDS.map((feature, index) => (
            <div
              key={feature.title}
              id={feature.id}
              className="sticky transition-all duration-300"
              style={{
                top: `calc(105px + ${index * 30}px)`,
                zIndex: index + 10,
              }}
            >
              <div className="bg-card rounded-[2rem] sm:rounded-[2.5rem] border border-border/80 shadow-2xl shadow-black/25 p-7 sm:p-9 md:p-10 backdrop-blur-xl hover:border-primary/40 transition-all duration-300">
                {/* Card Header matching reference image */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  {/* Left: Circle icon + Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-2 border-border/80 flex items-center justify-center bg-page-bg shrink-0 shadow-sm">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Right: Sleek tag pills matching STRATEGY / MEDIUM pills */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-3.5 py-1 rounded-xl bg-page-bg border border-border text-[11px] font-bold text-text-tertiary tracking-wider uppercase">
                      {feature.tag1}
                    </span>
                    <span
                      className={`px-3.5 py-1 rounded-xl border text-[11px] font-bold tracking-wider uppercase ${feature.tag2Color}`}
                    >
                      {feature.tag2}
                    </span>
                  </div>
                </div>

                {/* Card Description */}
                <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-6 max-w-3xl font-normal">
                  {feature.desc}
                </p>

                {/* Highlight feature pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-page-bg/80 border border-border/60 text-xs font-medium text-text-primary mb-6">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{feature.highlight}</span>
                </div>

                {/* Card Footer matching screenshot (Avatars on left, Edited timestamp/tag on right) */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  {/* Overlapping circular avatars */}
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      {feature.personaAvatars.map((bg, aIdx) => (
                        <div
                          key={aIdx}
                          className={`inline-block w-8 h-8 rounded-full ring-2 ring-card ${bg} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                        >
                          {aIdx === 0 ? 'P' : aIdx === 1 ? 'E' : 'U'}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-text-tertiary hidden sm:inline-block">
                      Personalized Privacy Intelligence
                    </span>
                  </div>

                  {/* Right: Timestamp / Meta tag like "Edited 2 days ago" */}
                  <div className="text-xs sm:text-sm font-medium text-text-tertiary">
                    {feature.meta}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   Section: Chrome Extension
   ============================================ */
const ChromeExtension = () => (
  <section id="extension" className="py-24 bg-card">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Extension Preview */}
        <div className="relative">
          <div className="bg-page-bg rounded-2xl border border-border p-6 max-w-sm mx-auto lg:mx-0">
            {/* Browser Mockup */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-danger/60" />
                <div className="w-3 h-3 rounded-full bg-warning/60" />
                <div className="w-3 h-3 rounded-full bg-success/60" />
              </div>
              <div className="flex-1 bg-card rounded-lg px-3 py-1.5 mx-2">
                <p className="text-xs text-text-tertiary truncate">whatsapp.com/legal/privacy-policy</p>
              </div>
            </div>

            {/* Extension Popup */}
            <div className="bg-card rounded-xl border border-border shadow-lg p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">PrivyLens AI</p>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 mb-4 border border-primary/10">
                <p className="text-sm font-semibold text-text-primary mb-1">
                  🔍 Privacy Policy Detected
                </p>
                <p className="text-xs text-text-tertiary">
                  Get an AI summary in under 5 seconds.
                </p>
              </div>

              <button className="w-full py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition-colors mb-2 cursor-pointer">
                View AI Summary
              </button>
              <button className="w-full py-2.5 text-text-secondary text-sm font-medium rounded-xl hover:bg-card-hover transition-colors cursor-pointer">
                Later
              </button>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-3xl -z-10" />
        </div>

        {/* Right: Description */}
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Chrome className="w-3.5 h-3.5" />
            Chrome Extension
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Protection That Comes to You
          </h2>
          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            No need to open the extension manually. PrivyLens automatically detects
            privacy policies and cookie consent dialogs as you browse, showing a
            non-intrusive popup with instant insights.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: Zap,
                title: 'Automatic Detection',
                desc: 'Recognizes privacy policy pages by URL, title, headings, and content.',
              },
              {
                icon: Cookie,
                title: 'Cookie Consent Awareness',
                desc: 'Detects cookie consent interfaces and provides risk assessment.',
              },
              {
                icon: ArrowRight,
                title: 'Seamless Web App Flow',
                desc: 'One click opens the full PrivyLens analysis in the web app.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-0.5">{item.title}</h4>
                  <p className="text-sm text-text-tertiary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ============================================
   Section: Privacy Monitoring
   ============================================ */
const PrivacyMonitoring = () => (
  <section id="monitoring" className="py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Description */}
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent-dark text-xs font-semibold mb-4">
            <Eye className="w-3.5 h-3.5" />
            Privacy Monitoring
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Stay Protected,
            <span className="text-accent"> Even After You Accept</span>
          </h2>
          <p className="text-text-secondary text-lg mb-8 leading-relaxed">
            Privacy policies change — often without warning. PrivyLens monitors
            the policies you care about and alerts you the moment something changes.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: TrendingUp,
                title: 'Continuous Monitoring',
                desc: 'Automatic daily, weekly, or monthly policy checks.',
              },
              {
                icon: Bell,
                title: 'Instant Alerts',
                desc: 'Email and in-app notifications when policies change.',
              },
              {
                icon: Lock,
                title: 'Version Comparison',
                desc: 'See exactly what was added, removed, or modified.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-0.5">{item.title}</h4>
                  <p className="text-sm text-text-tertiary">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Alert Cards */}
        <div className="space-y-4">
          {[
            {
              app: 'WhatsApp',
              change: 'Privacy Policy Updated',
              detail: '3 changes detected • Risk Score: 6.8 → 7.4',
              type: 'warning',
              time: '2 hours ago',
            },
            {
              app: 'Instagram',
              change: 'New Third Party Detected',
              detail: 'Analytics partner "DataMetrics Inc." added',
              type: 'danger',
              time: '1 day ago',
            },
            {
              app: 'Spotify',
              change: 'Monitoring Check Complete',
              detail: 'No changes detected • Next check: Jan 20',
              type: 'success',
              time: '3 days ago',
            },
          ].map((alert) => (
            <div
              key={alert.app}
              className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      alert.type === 'warning'
                        ? 'bg-warning'
                        : alert.type === 'danger'
                          ? 'bg-danger'
                          : 'bg-success'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{alert.app}</p>
                    <p className="text-xs text-text-tertiary">{alert.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-text-tertiary" />
              </div>
              <p className="text-sm font-medium text-text-primary ml-5.5 mb-1">
                {alert.change}
              </p>
              <p className="text-xs text-text-tertiary ml-5.5">{alert.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ============================================
   Section: AI Assistant
   ============================================ */
const AIAssistant = () => (
  <section id="ai-assistant" className="py-24 bg-card">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-4">
          <MessageSquare className="w-3.5 h-3.5" />
          AI Assistant
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Ask Anything About Any Policy
        </h2>
        <p className="text-text-secondary max-w-2xl mx-auto text-lg">
          Natural language questions, evidence-backed answers. Powered by RAG technology.
        </p>
      </div>

      {/* Chat Preview */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-page-bg rounded-2xl border border-border p-6 space-y-4">
          {/* Suggested Questions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              'Does this app share my location?',
              'Can I delete my data?',
              'What cookies are used?',
            ].map((q) => (
              <span
                key={q}
                className="px-3 py-1.5 text-xs font-medium bg-card border border-border rounded-full text-text-secondary hover:border-primary/30 hover:text-primary transition-colors cursor-pointer"
              >
                {q}
              </span>
            ))}
          </div>

          {/* Mock Chat */}
          <div className="space-y-4">
            {/* User Question */}
            <div className="flex justify-end">
              <div className="bg-primary text-white rounded-2xl rounded-tr-md px-4 py-3 max-w-md">
                <p className="text-sm">Does WhatsApp share my data with Facebook?</p>
              </div>
            </div>

            {/* AI Answer */}
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 max-w-md shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-xs font-semibold text-secondary">PrivyLens AI</span>
                </div>
                <p className="text-sm text-text-primary mb-3">
                  Yes. WhatsApp shares certain data with Meta (Facebook) companies, including
                  account information and usage data for advertising and service improvement.
                </p>
                <div className="bg-page-bg rounded-lg p-3 border border-border-light">
                  <p className="text-xs font-medium text-text-tertiary mb-1">📎 Evidence — Section 4.2, Paragraph 1</p>
                  <p className="text-xs text-text-tertiary italic">
                    "We share information with Meta Companies to operate, provide, improve..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ============================================
   Section: CTA
   ============================================ */
const CTA = () => (
  <section className="py-24">
    <div className="max-w-7xl mx-auto px-6">
      <div className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary rounded-3xl p-12 md:p-16 text-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Understand Your Privacy?
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-10">
            Join thousands of users who make informed privacy decisions with PrivyLens AI.
            Start analyzing policies in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="
                inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold
                text-primary bg-white rounded-2xl
                hover:bg-gray-50 shadow-lg
                transition-all duration-300 hover:-translate-y-0.5
              "
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#extension"
              className="
                inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold
                text-white border-2 border-white/30 rounded-2xl
                hover:bg-white/10 hover:border-white/50
                transition-all duration-300 hover:-translate-y-0.5
              "
            >
              <Chrome className="w-5 h-5" />
              Install Extension
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ============================================
   Landing Page Assembly
   ============================================ */
const Landing = () => {
  return (
    <div className="min-h-screen bg-page-bg">
      <LandingNavbar />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <KeyFeatures />
      <ChromeExtension />
      <PrivacyMonitoring />
      <AIAssistant />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
