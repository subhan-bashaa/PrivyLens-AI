import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  X,
  ArrowRight,
  ShieldAlert,
  FileText,
} from 'lucide-react';

const ChangeDetectionAlert = ({ change }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!change || isDismissed) return null;

  const timeAgo = getRelativeTime(change.detectedAt);

  return (
    <div className="relative bg-danger/5 border border-danger/30 rounded-2xl p-5 sm:p-6 shadow-sm animate-fade-in overflow-hidden">
      {/* Accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-danger rounded-l-2xl" />

      <div className="flex items-start gap-4 pl-2">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5 text-danger" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-danger text-white">
                  Major Change Detected
                </span>
                <span className="text-[10px] font-medium text-text-tertiary">
                  {timeAgo}
                </span>
              </div>
              <h3 className="text-sm font-bold text-text-primary">
                {change.serviceIcon} {change.changeTitle}
              </h3>
            </div>

            {/* Dismiss */}
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1.5 rounded-lg hover:bg-danger/10 text-text-tertiary hover:text-danger transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed mb-3">
            {change.changeDescription}
          </p>

          {/* Affected Sections */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
              Affected:
            </span>
            {change.affectedSections.map((section, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-card border border-border text-text-secondary"
              >
                <FileText className="w-2.5 h-2.5" />
                {section}
              </span>
            ))}
          </div>

          {/* Impact + Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-danger/15">
            <p className="text-[11px] text-text-secondary">
              <span className="font-bold text-danger">Impact:</span>{' '}
              {change.impactSummary}
            </p>
            <Link
              to={`/policy/${change.policyId}/details`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-danger text-white text-xs font-bold hover:bg-danger-dark transition-colors shrink-0"
            >
              View Changes
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function getRelativeTime(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export default ChangeDetectionAlert;
