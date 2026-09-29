import { useState } from 'react';
import { AlertTriangle, ChevronDown, Quote, ExternalLink } from 'lucide-react';

const RedFlagsCard = ({ redFlags = [] }) => {
  const [expandedClauseId, setExpandedClauseId] = useState(null);

  if (!redFlags || redFlags.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-danger-light text-danger flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Important Red Flags</h3>
            <p className="text-xs text-text-tertiary">Critical issues requiring caution before accepting</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-danger-light text-danger border border-danger/20">
          {redFlags.length} Identified
        </span>
      </div>

      <div className="space-y-3">
        {redFlags.map((flag) => {
          const isExpanded = expandedClauseId === flag.id;
          const isHigh = flag.severity.toLowerCase() === 'high';

          return (
            <div
              key={flag.id}
              className="p-4 rounded-xl border border-border bg-page-bg/60 hover:bg-page-bg transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
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
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    {flag.description}
                  </p>
                </div>
              </div>

              {/* Clause Reference & Evidence Toggle */}
              {flag.quote && (
                <div className="mt-3 pt-2.5 border-t border-border/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-tertiary font-medium">
                      Source: <span className="text-text-secondary">{flag.clause}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setExpandedClauseId(isExpanded ? null : flag.id)}
                      className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Quote className="w-3 h-3" />
                      {isExpanded ? 'Hide clause text' : 'View policy clause'}
                      <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 p-3 rounded-lg bg-card border border-border text-xs text-text-secondary italic leading-relaxed animate-fade-in">
                      "{flag.quote}"
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

export default RedFlagsCard;
