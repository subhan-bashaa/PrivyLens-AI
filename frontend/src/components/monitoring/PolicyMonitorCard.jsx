import { Link } from 'react-router-dom';
import {
  Eye,
  Pause,
  Play,
  AlertTriangle,
  Clock,
  ArrowRight,
  Shield,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    dot: 'bg-primary',
  },
  paused: {
    label: 'Paused',
    color: 'text-text-tertiary',
    bg: 'bg-page-bg',
    border: 'border-border',
    dot: 'bg-text-tertiary',
  },
  alert: {
    label: 'Alert',
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/20',
    dot: 'bg-danger',
  },
};

const SEVERITY_CONFIG = {
  none: { label: 'No Changes', color: 'text-primary', bg: 'bg-primary/10' },
  minor: { label: 'Minor', color: 'text-info', bg: 'bg-info/10' },
  moderate: { label: 'Moderate', color: 'text-warning', bg: 'bg-warning/10' },
  major: { label: 'Major', color: 'text-danger', bg: 'bg-danger/10' },
};

const FREQUENCY_OPTIONS = ['hourly', 'daily', 'weekly', 'monthly'];

const PolicyMonitorCard = ({ policy, onToggleStatus, onChangeFrequency }) => {
  const statusConfig = STATUS_CONFIG[policy.status] || STATUS_CONFIG.active;
  const severityConfig = SEVERITY_CONFIG[policy.changeSeverity] || SEVERITY_CONFIG.none;

  const lastCheckedDate = new Date(policy.lastChecked);
  const lastCheckedFormatted = lastCheckedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`bg-card border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
        policy.status === 'alert'
          ? 'border-danger/30'
          : 'border-border hover:border-primary/30'
      }`}
    >
      {/* Top Row: Icon + Name + Status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{policy.icon}</span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-text-primary truncate">
              {policy.name}
            </h3>
            <p className="text-[10px] text-text-tertiary font-medium">
              {policy.category}
            </p>
          </div>
        </div>

        {/* Status Badge with Pulse */}
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}`}>
          {policy.status === 'active' && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusConfig.dot}`}></span>
            </span>
          )}
          {policy.status !== 'active' && (
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          )}
          {statusConfig.label}
        </div>
      </div>

      {/* Trust Score + Risk Level */}
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-text-secondary">
          <Shield className="w-3 h-3 text-primary" />
          {policy.trustScore}/10
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          policy.riskLevel === 'High'
            ? 'bg-danger/10 text-danger border border-danger/20'
            : policy.riskLevel === 'Medium'
            ? 'bg-warning/10 text-warning border border-warning/20'
            : 'bg-primary/10 text-primary border border-primary/20'
        }`}>
          {policy.riskLevel} Risk
        </span>
      </div>

      {/* Changes Detected + Severity */}
      <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-page-bg border border-border mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-3.5 h-3.5 ${severityConfig.color}`} />
          <span className="text-xs font-semibold text-text-primary">
            {policy.changesDetected} Changes
          </span>
        </div>
        {policy.changesDetected > 0 && (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${severityConfig.bg} ${severityConfig.color}`}>
            {severityConfig.label}
          </span>
        )}
        {policy.changesDetected === 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
            <CheckCircle2 className="w-3 h-3" />
            Clean
          </span>
        )}
      </div>

      {/* Meta Info */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-[10px] text-text-tertiary">
          <Clock className="w-3 h-3" />
          <span>Last checked: <span className="text-text-secondary font-medium">{lastCheckedFormatted}</span></span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-tertiary">
          <Eye className="w-3 h-3" />
          <span>Frequency: </span>
          <select
            value={policy.checkFrequency}
            onChange={(e) => onChangeFrequency?.(policy.policyId, e.target.value)}
            className="px-1.5 py-0.5 rounded-md border border-border bg-card text-[10px] font-medium text-text-secondary cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/30"
          >
            {FREQUENCY_OPTIONS.map((freq) => (
              <option key={freq} value={freq}>
                {freq.charAt(0).toUpperCase() + freq.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          to={`/policy/${policy.policyId}/details`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          type="button"
          onClick={() => onToggleStatus?.(policy.policyId)}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            policy.status === 'paused'
              ? 'bg-primary/10 text-primary hover:bg-primary/20'
              : 'bg-page-bg border border-border text-text-secondary hover:text-warning hover:border-warning/30'
          }`}
        >
          {policy.status === 'paused' ? (
            <>
              <Play className="w-3.5 h-3.5" />
              Resume
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5" />
              Pause
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PolicyMonitorCard;
