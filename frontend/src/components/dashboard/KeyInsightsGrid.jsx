import {
  Database,
  Share2,
  Cookie,
  Clock,
  UserCheck,
  Lock,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useState } from 'react';

const iconMap = {
  Database,
  Share2,
  Cookie,
  Clock,
  UserCheck,
  Lock,
};

const riskBadges = {
  low: {
    label: 'Low Risk',
    bg: 'bg-success-light',
    text: 'text-success-dark',
    border: 'border-success/30',
  },
  medium: {
    label: 'Medium Risk',
    bg: 'bg-warning-light',
    text: 'text-warning-dark',
    border: 'border-warning/30',
  },
  high: {
    label: 'High Risk',
    bg: 'bg-danger-light',
    text: 'text-danger-dark',
    border: 'border-danger/30',
  },
};

const KeyInsightsGrid = ({ insights = [], scores = {} }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const categoryScores = {
    collection: scores?.collection ?? 6.5,
    sharing: scores?.sharing ?? 5.8,
    tracking: scores?.tracking ?? 6.0,
    retention: scores?.retention ?? 7.5,
    rights: scores?.rights ?? 8.2,
    security: scores?.security ?? 9.0,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Key Privacy Insights</h3>
          <p className="text-xs text-text-tertiary">
            Automated deep analysis across the 6 primary data privacy categories
          </p>
        </div>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          6 Pillars Analyzed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => {
          const Icon = iconMap[insight.iconName] || Info;
          const badge = riskBadges[insight.risk] || riskBadges.medium;
          const isExpanded = expandedId === insight.id;
          const score = categoryScores[insight.id] || 7.0;

          return (
            <div
              key={insight.id}
              className="bg-card rounded-2xl border border-border p-5 flex flex-col justify-between hover:border-primary/30 hover:shadow-sm transition-all duration-200"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-page-bg border border-border flex items-center justify-center text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      {insight.category}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Score Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-[11px] text-text-tertiary mb-1 font-medium">
                    <span>Category Score</span>
                    <span className="font-semibold text-text-secondary">{score.toFixed(1)} / 10</span>
                  </div>
                  <div className="w-full h-1.5 bg-page-bg rounded-full overflow-hidden border border-border-light">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        score >= 8 ? 'bg-success' : score >= 5 ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: `${score * 10}%` }}
                    />
                  </div>
                </div>

                {/* Summary Text */}
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {insight.summary}
                </p>

                {/* Detailed Findings list */}
                {insight.details && insight.details.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-border-light">
                    {(isExpanded ? insight.details : insight.details.slice(0, 2)).map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-text-tertiary leading-normal">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* View More Toggle Button */}
              {insight.details && insight.details.length > 2 && (
                <button
                  type="button"
                  onClick={() => toggleExpand(insight.id)}
                  className="mt-3 pt-2 text-[11px] font-semibold text-primary hover:text-primary-dark flex items-center gap-1 cursor-pointer transition-colors border-t border-border/50"
                >
                  {isExpanded ? 'Show less' : `+${insight.details.length - 2} more details`}
                  <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KeyInsightsGrid;
