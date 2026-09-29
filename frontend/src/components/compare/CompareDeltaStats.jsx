import {
  TrendingDown,
  TrendingUp,
  PlusCircle,
  FileEdit,
  MinusCircle,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical Privacy Impact',
    icon: ShieldAlert,
    bg: 'bg-danger/10',
    text: 'text-danger',
    border: 'border-danger/20',
  },
  high: {
    label: 'High Privacy Impact',
    icon: AlertTriangle,
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/20',
  },
  medium: {
    label: 'Moderate Impact',
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
  },
  low: {
    label: 'Minor/Low Impact',
    icon: ShieldCheck,
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
};

const CompareDeltaStats = ({ scoreShift, stats, overallSeverity }) => {
  if (!stats) return null;

  const severityInfo =
    SEVERITY_CONFIG[overallSeverity] || SEVERITY_CONFIG.medium;
  const SeverityIcon = severityInfo.icon;

  const isScoreDown = scoreShift?.direction === 'down';
  const deltaText = scoreShift?.delta
    ? `${scoreShift.delta > 0 ? '+' : ''}${scoreShift.delta}`
    : '0.0';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* 1. Score Shift Card */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isScoreDown ? 'bg-danger/10 text-danger' : 'bg-emerald-500/10 text-emerald-500'
            }`}
          >
            {isScoreDown ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <TrendingUp className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="text-[11px] font-medium text-text-tertiary">
            Trust Score Delta
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-text-primary">
            {scoreShift?.current ?? '--'}
          </span>
          <span className="text-xs text-text-tertiary line-through font-semibold">
            {scoreShift?.previous ?? '--'}
          </span>
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
              isScoreDown ? 'bg-danger/10 text-danger' : 'bg-emerald-500/10 text-emerald-500'
            }`}
          >
            {deltaText}
          </span>
        </div>
      </div>

      {/* 2. Added Clauses */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-500">
            <PlusCircle className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-medium text-text-tertiary">
            New Clauses
          </span>
        </div>
        <div className="text-xl font-extrabold text-emerald-500 tracking-tight">
          +{stats.added}
          <span className="text-xs font-medium text-text-tertiary ml-1.5">
            added
          </span>
        </div>
      </div>

      {/* 3. Modified Clauses */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-500">
            <FileEdit className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-medium text-text-tertiary">
            Modified Clauses
          </span>
        </div>
        <div className="text-xl font-extrabold text-amber-500 tracking-tight">
          ~{stats.modified}
          <span className="text-xs font-medium text-text-tertiary ml-1.5">
            revised
          </span>
        </div>
      </div>

      {/* 4. Removed Clauses */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center shrink-0 text-rose-500">
            <MinusCircle className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-medium text-text-tertiary">
            Removed Clauses
          </span>
        </div>
        <div className="text-xl font-extrabold text-rose-500 tracking-tight">
          -{stats.removed}
          <span className="text-xs font-medium text-text-tertiary ml-1.5">
            sunsetted
          </span>
        </div>
      </div>

      {/* 5. Severity Rating */}
      <div
        className={`bg-card border rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-3 lg:col-span-1 border-l-4 ${severityInfo.border}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${severityInfo.bg} ${severityInfo.text}`}
          >
            <SeverityIcon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-medium text-text-tertiary">
            Severity Assessment
          </span>
        </div>
        <div className={`text-sm font-bold truncate ${severityInfo.text}`}>
          {severityInfo.label}
        </div>
      </div>
    </div>
  );
};

export default CompareDeltaStats;
