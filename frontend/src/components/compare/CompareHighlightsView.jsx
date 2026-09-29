import {
  Sparkles,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const RISK_BADGES = {
  critical: {
    bg: 'bg-danger/10 text-danger border-danger/20',
    icon: Flame,
  },
  high: {
    bg: 'bg-warning/10 text-warning border-warning/20',
    icon: AlertTriangle,
  },
  medium: {
    bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: AlertTriangle,
  },
  low: {
    bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    icon: ShieldCheck,
  },
};

const CompareHighlightsView = ({
  executiveSummary,
  keyTakeaways = [],
  recommendedActions = [],
  onSwitchToDiffs,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Executive Summary Box */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-2 flex-1">
            <h2 className="text-base font-bold text-text-primary">
              Executive Privacy Impact Assessment
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-background p-4 rounded-xl border border-border">
              {executiveSummary}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Takeaways Grid */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <span>Key Red Flags & Policy Revisions</span>
          <span className="text-xs font-normal text-text-tertiary">
            ({keyTakeaways.length} major items identified)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {keyTakeaways.map((item, idx) => {
            const riskConfig =
              RISK_BADGES[item.risk] || RISK_BADGES.medium;
            const RiskIcon = riskConfig.icon;

            return (
              <div
                key={idx}
                className="bg-background border border-border rounded-xl p-4 space-y-2 hover:border-primary/20 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                    {item.title}
                  </h4>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize shrink-0 ${riskConfig.bg}`}
                  >
                    <RiskIcon className="w-3 h-3" />
                    {item.risk}
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Recommended Actions */}
      {recommendedActions.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-primary">
              Recommended User Defense Actions
            </h3>
          </div>
          <div className="space-y-2">
            {recommendedActions.map((action, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 text-xs text-text-secondary bg-card p-3 rounded-xl border border-primary/10"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Footer CTA to inspect individual clause diffs */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onSwitchToDiffs}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm cursor-pointer"
        >
          <span>Inspect Detailed Clause Diffs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default CompareHighlightsView;
