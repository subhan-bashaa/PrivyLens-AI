import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  AlertTriangle,
  Flame,
  Info,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Check,
  FileText,
  Sparkles,
  Scale,
  ShieldAlert,
} from 'lucide-react';

const SEVERITY_STYLES = {
  critical: {
    badge: 'bg-danger/10 text-danger border-danger/20',
    icon: AlertTriangle,
    bar: 'bg-danger',
  },
  high: {
    badge: 'bg-warning/10 text-warning border-warning/20',
    icon: Flame,
    bar: 'bg-warning',
  },
  medium: {
    badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: AlertTriangle,
    bar: 'bg-amber-500',
  },
  low: {
    badge: 'bg-info/10 text-info border-info/20',
    icon: Info,
    bar: 'bg-info',
  },
  info: {
    badge: 'bg-primary/10 text-primary border-primary/20',
    icon: Info,
    bar: 'bg-primary',
  },
};

const TYPE_ICONS = {
  policy_change: FileText,
  risk_score_change: Sparkles,
  compliance_breach: Scale,
  monitoring_report: ShieldAlert,
};

const AlertDetailModal = ({
  alert,
  isOpen,
  onClose,
  onToggleRead,
  onToggleResolved,
}) => {
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !alert) return null;

  const severityStyle =
    SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
  const SeverityIcon = severityStyle.icon;
  const TypeIcon = TYPE_ICONS[alert.type] || Info;

  const formattedDate = new Date(alert.timestamp).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl z-10 overflow-hidden animate-scale-in">
        {/* Severity Color Strip */}
        <div className={`h-1.5 w-full ${severityStyle.bar}`} />

        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {/* Service Pill */}
              <div className="flex items-center gap-1.5 bg-background px-2.5 py-1 rounded-lg border border-border">
                <span className="text-sm">{alert.serviceIcon}</span>
                <span className="text-xs font-bold text-text-primary">
                  {alert.serviceName}
                </span>
              </div>

              {/* Severity Pill */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border capitalize ${severityStyle.badge}`}
              >
                <SeverityIcon className="w-3.5 h-3.5" />
                {alert.severity} Priority
              </span>

              {/* Resolved Pill */}
              {alert.isResolved && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resolved
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-text-primary leading-snug">
              {alert.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-text-tertiary">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <TypeIcon className="w-3.5 h-3.5" />
                {alert.type.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-background transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Detailed Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">
              Alert Summary
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed bg-background p-4 rounded-xl border border-border">
              {alert.description}
            </p>
          </div>

          {/* Values Shift (if applicable) */}
          {(alert.previousValue || alert.newValue) && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">
                Metric Shift Detected
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background p-3 rounded-xl border border-border">
                  <span className="text-[11px] text-text-tertiary">Previous Value</span>
                  <div className="text-lg font-bold text-text-secondary line-through mt-0.5">
                    {alert.previousValue}
                  </div>
                </div>
                <div className="bg-danger/5 border border-danger/20 p-3 rounded-xl">
                  <span className="text-[11px] text-danger font-semibold">New Value</span>
                  <div className="text-lg font-bold text-danger mt-0.5">
                    {alert.newValue}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Affected Clauses */}
          {alert.affectedClauses && alert.affectedClauses.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">
                Affected Policy Clauses ({alert.affectedClauses.length})
              </h4>
              <div className="space-y-2">
                {alert.affectedClauses.map((clause, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-background border border-border text-xs text-text-secondary"
                  >
                    <span className="w-2 h-2 rounded-full bg-danger mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{clause}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Actions Guidance */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-bold text-primary">
                PrivyLens Recommended Action
              </h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Verify your privacy settings on {alert.serviceName} to confirm whether data sharing preferences align with your consent profile. You can also inspect the clause diffs or download the compliance assessment.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-background-subtle border-t border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleRead(alert.alertId)}
              className="text-xs font-semibold text-text-secondary hover:text-text-primary px-3 py-2 rounded-xl bg-card border border-border hover:bg-background transition-all cursor-pointer"
            >
              {alert.isRead ? 'Mark as Unread' : 'Mark as Read'}
            </button>

            <button
              onClick={() => onToggleResolved(alert.alertId)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                alert.isResolved
                  ? 'bg-card border-border text-text-secondary hover:border-border-hover'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {alert.isResolved ? 'Reopen Alert' : 'Resolve Alert'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {alert.actionLink && (
              <Link
                to={alert.actionLink}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm"
              >
                <span>{alert.actionLabel || 'Inspect Policy'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-background border border-transparent transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetailModal;
