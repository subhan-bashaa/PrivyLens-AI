import { ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScoreGauge from '../dashboard/ScoreGauge';

const STATUS_CONFIGS = {
  success: {
    badgeBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    bannerBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-300',
    icon: ShieldCheck,
    iconColor: 'text-emerald-500',
  },
  warning: {
    badgeBg: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    bannerBg: 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-300',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
  },
  danger: {
    badgeBg: 'bg-red-500/10 text-red-600 border-red-500/20',
    bannerBg: 'bg-red-500/10 border-red-500/20 text-red-900 dark:text-red-300',
    icon: ShieldAlert,
    iconColor: 'text-red-500',
  },
};

const TrustRecommendationCard = ({ policy }) => {
  const recommendation = policy.recommendation || {
    status: policy.riskLevel === 'Low' ? 'Safe to Use' : policy.riskLevel === 'High' ? 'High Risk' : 'Proceed with Caution',
    type: policy.riskLevel === 'Low' ? 'success' : policy.riskLevel === 'High' ? 'danger' : 'warning',
    summary: 'Evaluate personal data collection and third-party data broker sharing before agreeing.',
    actionText: 'Review Sensitive Clauses',
    actionLink: `/policy/${policy.id}/details`,
  };

  const statusCfg = STATUS_CONFIGS[recommendation.type] || STATUS_CONFIGS.warning;
  const StatusIcon = statusCfg.icon;

  const redFlagsCount = policy.redFlags?.length || 0;
  const positiveCount = policy.positiveFindings?.length || 0;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
      {/* Ambient background aura */}
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Column: Overall Trust Score Gauge */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-page-bg/60 border border-border/80 text-center">
          <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
            Overall Privacy Trust Score
          </span>

          <ScoreGauge score={policy.trustScore} maxScore={10} size="md" />

          {/* Risk Level Badge */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.badgeBg}`}
            >
              <StatusIcon className="w-3.5 h-3.5" />
              {policy.riskLevel} Risk Profile
            </span>
          </div>

          {/* Quick Metrics Counter */}
          <div className="grid grid-cols-2 gap-2 w-full mt-4 pt-3 border-t border-border/60 text-xs">
            <div className="flex flex-col items-center">
              <span className="font-extrabold text-red-500 text-sm">{redFlagsCount}</span>
              <span className="text-[11px] text-text-tertiary">Red Flags</span>
            </div>
            <div className="flex flex-col items-center border-l border-border/60">
              <span className="font-extrabold text-emerald-500 text-sm">{positiveCount}</span>
              <span className="text-[11px] text-text-tertiary">Protections</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Trust Recommendation Synthesis */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>AI Executive Synthesis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight">
              Privacy Verdict & Recommendation
            </h2>
          </div>

          {/* Big Recommendation Banner */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 ${statusCfg.bannerBg}`}
          >
            <StatusIcon className={`w-6 h-6 shrink-0 mt-0.5 ${statusCfg.iconColor}`} />
            <div className="space-y-1">
              <h3 className="text-base font-extrabold tracking-tight">
                {recommendation.status}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                {recommendation.summary}
              </p>
            </div>
          </div>

          {/* Synthesis Points */}
          <div className="space-y-2 text-xs sm:text-sm text-text-secondary leading-relaxed">
            {recommendation.purpose && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Data Processing Purpose:</strong> {recommendation.purpose}
                </span>
              </div>
            )}
            {recommendation.thirdPartyScope && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Third-Party Scope:</strong> {recommendation.thirdPartyScope}
                </span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to={`/policy/${policy.id}/details`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-sm hover:shadow-md hover:shadow-primary/20 transition-all duration-200 group"
            >
              <span>{recommendation.actionText || 'Explore Detailed Clauses'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              to={`/policy/${policy.id}/compare`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-text-secondary bg-card-hover border border-border hover:border-primary/40 hover:text-primary transition-all duration-200"
            >
              <span>Compare Versions</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustRecommendationCard;
