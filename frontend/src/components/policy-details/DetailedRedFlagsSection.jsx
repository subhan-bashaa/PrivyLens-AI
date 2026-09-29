import { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  Quote,
  ShieldAlert,
  Lightbulb,
} from 'lucide-react';

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 };

const DetailedRedFlagsSection = ({ redFlags = [] }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!redFlags || redFlags.length === 0) return null;

  // Sort: High severity first
  const sorted = [...redFlags].sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity.toLowerCase()] ?? 99) -
      (SEVERITY_ORDER[b.severity.toLowerCase()] ?? 99)
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-danger-light text-danger flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-text-primary tracking-tight">
              Red Flags & Critical Concerns
            </h3>
            <p className="text-xs text-text-secondary">
              Issues requiring your attention before accepting this policy
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-danger-light text-danger border border-danger/20 shrink-0">
          {redFlags.length} Found
        </span>
      </div>

      {/* Red Flag Cards */}
      <div className="space-y-3">
        {sorted.map((flag, idx) => {
          const isExpanded = expandedId === flag.id;
          const isHigh = flag.severity.toLowerCase() === 'high';

          return (
            <div
              key={flag.id}
              className={`p-4 rounded-xl border transition-all duration-200 animate-fade-in ${
                isHigh
                  ? 'border-danger/30 bg-danger/5 hover:bg-danger/8'
                  : 'border-warning/30 bg-warning/5 hover:bg-warning/8'
              }`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Title Row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isHigh ? 'text-danger' : 'text-warning'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isHigh ? 'bg-danger text-white' : 'bg-warning text-white'
                        }`}
                      >
                        {flag.severity} Severity
                      </span>
                      <h4 className="text-xs font-bold text-text-primary">
                        {flag.title}
                      </h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {flag.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="flex items-start gap-2 mt-3 p-2.5 rounded-lg bg-card border border-border">
                <Lightbulb className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  <span className="font-bold text-text-primary">Recommended Action: </span>
                  {isHigh
                    ? 'Review your account settings and consider limiting permissions related to this clause. Contact support if you have concerns.'
                    : 'Monitor this behavior and adjust privacy settings to minimize exposure. Review regularly for policy updates.'}
                </p>
              </div>

              {/* Source Clause + Expandable Quote */}
              {flag.quote && (
                <div className="mt-3 pt-2.5 border-t border-border/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-tertiary font-medium">
                      Source:{' '}
                      <span className="text-text-secondary">{flag.clause}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : flag.id)}
                      className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Quote className="w-3 h-3" />
                      {isExpanded ? 'Hide clause' : 'View clause'}
                      <ChevronDown
                        className={`w-3 h-3 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 p-3 rounded-lg bg-card border border-border text-xs text-text-secondary italic leading-relaxed animate-fade-in border-l-2 border-l-danger/40">
                      &ldquo;{flag.quote}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedRedFlagsSection;
