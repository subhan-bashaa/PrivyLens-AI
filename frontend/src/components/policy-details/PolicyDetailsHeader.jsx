import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  FileSearch,
  Calendar,
  Hash,
  ExternalLink,
  Shield,
} from 'lucide-react';

const RISK_BADGES = {
  Low: { bg: 'bg-primary/10 border-primary/20 text-primary', dot: 'bg-primary' },
  Medium: { bg: 'bg-warning/10 border-warning/20 text-warning', dot: 'bg-warning' },
  High: { bg: 'bg-danger/10 border-danger/20 text-danger', dot: 'bg-danger' },
};

const PolicyDetailsHeader = ({ policy }) => {
  const riskConfig = RISK_BADGES[policy.riskLevel] || RISK_BADGES.Medium;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Top Row: Back Link + External Link */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to={`/policy/${policy.id}/summary`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-tertiary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Summary
        </Link>
        <a
          href={policy.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-tertiary hover:text-primary transition-colors"
        >
          Original Policy
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Service Name + Badges */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FileSearch className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                {policy.name}
              </h1>
              <span className="text-[10px] font-bold text-text-tertiary bg-page-bg px-2 py-0.5 rounded-md border border-border">
                {policy.version}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${riskConfig.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${riskConfig.dot}`} />
                {policy.riskLevel} Risk
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Detailed Clause-by-Clause Privacy Analysis
            </p>
          </div>
        </div>

        {/* Right: Meta Info Pills */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-page-bg border border-border text-[10px] font-semibold text-text-secondary">
            <Shield className="w-3 h-3 text-primary" />
            Score: {policy.trustScore}/10
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-page-bg border border-border text-[10px] font-semibold text-text-secondary">
            <Calendar className="w-3 h-3 text-text-tertiary" />
            {policy.lastAnalyzed}
          </span>
          {policy.wordCount && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-page-bg border border-border text-[10px] font-semibold text-text-secondary">
              <Hash className="w-3 h-3 text-text-tertiary" />
              {policy.wordCount.toLocaleString()} words
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyDetailsHeader;
