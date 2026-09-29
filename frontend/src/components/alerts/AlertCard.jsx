import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Flame,
  Info,
  CheckCircle2,
  FileText,
  Sparkles,
  Scale,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Check,
} from 'lucide-react';

const SEVERITY_STYLES = {
  critical: {
    badge: 'bg-danger/10 text-danger border-danger/20',
    dot: 'bg-danger',
    border: 'border-l-danger',
    icon: AlertTriangle,
  },
  high: {
    badge: 'bg-warning/10 text-warning border-warning/20',
    dot: 'bg-warning',
    border: 'border-l-warning',
    icon: Flame,
  },
  medium: {
    badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    dot: 'bg-amber-500',
    border: 'border-l-amber-500',
    icon: AlertTriangle,
  },
  low: {
    badge: 'bg-info/10 text-info border-info/20',
    dot: 'bg-info',
    border: 'border-l-info',
    icon: Info,
  },
  info: {
    badge: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
    border: 'border-l-primary',
    icon: Info,
  },
};

const TYPE_CONFIG = {
  policy_change: {
    label: 'Policy Change',
    icon: FileText,
  },
  risk_score_change: {
    label: 'Score Shift',
    icon: Sparkles,
  },
  compliance_breach: {
    label: 'Compliance Breach',
    icon: Scale,
  },
  monitoring_report: {
    label: 'Periodic Report',
    icon: ShieldAlert,
  },
};

const AlertCard = ({
  alert,
  onToggleRead,
  onToggleResolved,
  onOpenDetails,
}) => {
  const [isClausesExpanded, setIsClausesExpanded] = useState(false);

  const severityStyle =
    SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
  const typeConfig = TYPE_CONFIG[alert.type] || {
    label: 'Alert',
    icon: Info,
  };
  const TypeIcon = typeConfig.icon;
  const SeverityIcon = severityStyle.icon;

  // Format date readable
  const formattedDate = new Date(alert.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`bg-card border rounded-2xl p-5 transition-all relative overflow-hidden ${
        alert.isResolved
          ? 'border-border/60 bg-card/60 opacity-80'
          : !alert.isRead
          ? 'border-primary/40 shadow-sm ring-1 ring-primary/10'
          : 'border-border hover:border-border-hover'
      } border-l-4 ${severityStyle.border}`}
    >
      {/* Unread indicator ribbon */}
      {!alert.isRead && !alert.isResolved && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          NEW
        </div>
      )}

      {/* Top Header: Service Icon & Name + Type Badge + Severity Badge */}
      <div className="flex flex-wrap items-center gap-2 mb-2.5 pr-14">
        {/* Service */}
        <div className="flex items-center gap-1.5 bg-background-subtle px-2.5 py-1 rounded-lg border border-border">
          <span className="text-sm">{alert.serviceIcon}</span>
          <span className="text-xs font-bold text-text-primary">
            {alert.serviceName}
          </span>
        </div>

        {/* Type Badge */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-background border border-border text-text-secondary">
          <TypeIcon className="w-3 h-3 text-text-tertiary" />
          {typeConfig.label}
        </span>

        {/* Severity Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border capitalize ${severityStyle.badge}`}
        >
          <SeverityIcon className="w-3 h-3" />
          {alert.severity}
        </span>

        {/* Resolved Badge */}
        {alert.isResolved && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Resolved
          </span>
        )}

        {/* Timestamp */}
        <span className="text-[11px] text-text-tertiary ml-auto hidden sm:inline-block">
          {formattedDate}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm sm:text-base font-bold text-text-primary mb-1.5">
        {alert.title}
      </h3>

      {/* Description */}
      <p className="text-xs text-text-secondary line-clamp-2 sm:line-clamp-3 mb-3 leading-relaxed">
        {alert.description}
      </p>

      {/* Before / After score pill if present */}
      {(alert.previousValue || alert.newValue) && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background border border-border text-xs mb-3 font-medium">
          <span className="text-text-tertiary">Previous:</span>
          <span className="font-bold text-text-secondary line-through">
            {alert.previousValue}
          </span>
          <span className="text-text-tertiary">→</span>
          <span className="text-text-tertiary">New:</span>
          <span className="font-bold text-danger">{alert.newValue}</span>
        </div>
      )}

      {/* Affected Clauses Dropdown Preview */}
      {alert.affectedClauses && alert.affectedClauses.length > 0 && (
        <div className="mb-3.5">
          <button
            type="button"
            onClick={() => setIsClausesExpanded(!isClausesExpanded)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            {isClausesExpanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> Hide {alert.affectedClauses.length} Affected Clauses
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> View {alert.affectedClauses.length} Affected Clauses
              </>
            )}
          </button>

          {isClausesExpanded && (
            <div className="mt-2 space-y-1.5 p-3 rounded-xl bg-background border border-border animate-fade-in">
              {alert.affectedClauses.map((clause, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-text-secondary"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                  <span>{clause}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Card Footer: Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Details Modal Trigger */}
          <button
            type="button"
            onClick={() => onOpenDetails(alert)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-background hover:bg-background-hover text-text-primary border border-border hover:border-primary/30 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-primary" />
            Quick View
          </button>

          {/* Action Link to Policy page */}
          {alert.actionLink && (
            <Link
              to={alert.actionLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all"
            >
              <span>{alert.actionLabel || 'Inspect Policy'}</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* State actions: Mark Read/Unread & Resolve/Reopen */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleRead(alert.alertId)}
            className="text-[11px] font-medium text-text-tertiary hover:text-text-primary transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-background"
          >
            {alert.isRead ? 'Mark Unread' : 'Mark Read'}
          </button>

          <button
            type="button"
            onClick={() => onToggleResolved(alert.alertId)}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              alert.isResolved
                ? 'bg-background border-border text-text-secondary hover:border-border-hover'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
            }`}
          >
            <Check className="w-3 h-3" />
            {alert.isResolved ? 'Reopen' : 'Resolve'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
