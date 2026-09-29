import { useState } from 'react';
import {
  Shield,
  ExternalLink,
  Bell,
  BellOff,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BRAND_COLORS = {
  whatsapp: 'from-emerald-500 to-green-600',
  spotify: 'from-green-500 to-emerald-600',
  chatgpt: 'from-teal-500 to-cyan-600',
  tiktok: 'from-rose-500 to-pink-600',
  twitter: 'from-cyan-500 to-blue-600',
  netflix: 'from-red-600 to-rose-700',
  notion: 'from-gray-700 to-gray-900',
};

const PolicySummaryHeader = ({ policy, persona = 'General' }) => {
  const [monitoring, setMonitoring] = useState(policy.monitoringActive ?? true);
  const [toggleFeedback, setToggleFeedback] = useState('');

  const brandGradient = BRAND_COLORS[policy.id] || 'from-emerald-600 to-teal-600';

  const handleToggleMonitoring = () => {
    const nextState = !monitoring;
    setMonitoring(nextState);
    setToggleFeedback(nextState ? 'Active monitoring enabled' : 'Monitoring paused');
    setTimeout(() => setToggleFeedback(''), 2500);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden transition-all duration-300">
      {/* Ambient background highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Top navigation link */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Link
          to="/analyze"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-tertiary hover:text-primary transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Analyze another policy</span>
        </Link>

        {/* Persona perspective pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <Sparkles className="w-3 h-3" />
          <span>{persona} Perspective</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
        {/* Left: Brand Avatar & Core Metadata */}
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${brandGradient} flex items-center justify-center text-white text-2xl font-black shadow-md shadow-primary/20 shrink-0 select-none`}
          >
            {policy.name.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                {policy.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                AI Analyzed
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-text-secondary border border-border">
                {policy.version || 'v2026.1'}
              </span>
            </div>

            <p className="text-sm text-text-secondary">
              Official Privacy Policy & Terms of Service Assessment
            </p>

            {/* Micro Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary pt-0.5">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                {policy.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
                Analyzed {policy.lastAnalyzed || 'Recently'}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                <Shield className="w-3.5 h-3.5" />
                100% Clauses Extracted
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions (Original Policy Link & Monitoring Toggle) */}
        <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
          {/* Read Original Policy */}
          {policy.url && (
            <a
              href={policy.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-text-secondary bg-card-hover border border-border hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-pointer shadow-sm"
              title="Open official policy document in a new tab"
            >
              <span>Read Original Policy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Active Monitoring Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={handleToggleMonitoring}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm ${
                monitoring
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/25'
                  : 'bg-card border border-border text-text-secondary hover:border-text-tertiary'
              }`}
            >
              {monitoring ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Monitoring Active</span>
                </>
              ) : (
                <>
                  <BellOff className="w-3.5 h-3.5 text-text-tertiary" />
                  <span>Monitoring Paused</span>
                </>
              )}
            </button>

            {toggleFeedback && (
              <div className="absolute right-0 top-full mt-1.5 px-3 py-1 bg-gray-900 text-white text-[11px] rounded-lg shadow-lg whitespace-nowrap animate-fade-in z-20">
                {toggleFeedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicySummaryHeader;
