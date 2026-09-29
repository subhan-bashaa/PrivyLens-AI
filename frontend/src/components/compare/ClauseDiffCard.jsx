import {
  PlusCircle,
  FileEdit,
  MinusCircle,
  Equal,
  Sparkles,
  AlertTriangle,
  Flame,
  Info,
  ShieldAlert,
} from 'lucide-react';

const CHANGE_BADGES = {
  added: {
    label: '+ Added',
    icon: PlusCircle,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    border: 'border-l-emerald-500',
  },
  modified: {
    label: '~ Modified',
    icon: FileEdit,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    border: 'border-l-amber-500',
  },
  removed: {
    label: '- Removed',
    icon: MinusCircle,
    color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    border: 'border-l-rose-500',
  },
  unchanged: {
    label: '= Unchanged',
    icon: Equal,
    color: 'text-text-tertiary bg-background-subtle border-border',
    border: 'border-l-border',
  },
};

const SEVERITY_STYLES = {
  critical: {
    badge: 'bg-danger/10 text-danger border-danger/20',
    icon: ShieldAlert,
  },
  high: {
    badge: 'bg-warning/10 text-warning border-warning/20',
    icon: Flame,
  },
  medium: {
    badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    icon: AlertTriangle,
  },
  low: {
    badge: 'bg-info/10 text-info border-info/20',
    icon: Info,
  },
};

const ClauseDiffCard = ({
  clause,
  viewMode = 'split',
  baseVersionLabel = 'Base Version',
  targetVersionLabel = 'Target Version',
}) => {
  const changeMeta = CHANGE_BADGES[clause.changeType] || CHANGE_BADGES.modified;
  const ChangeIcon = changeMeta.icon;

  const severityStyle =
    SEVERITY_STYLES[clause.severity] || SEVERITY_STYLES.low;
  const SeverityIcon = severityStyle.icon;

  return (
    <div
      className={`bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4 border-l-4 ${changeMeta.border}`}
    >
      {/* Header: Section + Title + Change Type + Severity */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Section badge */}
          <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-background-subtle border border-border text-text-secondary">
            {clause.section}
          </span>

          <h3 className="text-sm sm:text-base font-bold text-text-primary">
            {clause.title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Change Type Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${changeMeta.color}`}
          >
            <ChangeIcon className="w-3 h-3" />
            {changeMeta.label}
          </span>

          {/* Severity Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border capitalize ${severityStyle.badge}`}
          >
            <SeverityIcon className="w-3 h-3" />
            {clause.severity}
          </span>
        </div>
      </div>

      {/* AI Interpretation Box */}
      <div className="bg-background p-3.5 rounded-xl border border-border/80 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PrivyLens AI Clause Analysis</span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          {clause.aiInterpretation}
        </p>
        {clause.impact && (
          <div className="text-[11px] font-medium text-danger bg-danger/5 px-2.5 py-1 rounded-lg border border-danger/15 flex items-center gap-1.5">
            <span className="font-bold">Privacy Impact:</span>
            <span>{clause.impact}</span>
          </div>
        )}
      </div>

      {/* DIFF DISPLAY: Side-by-Side View */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Left Panel: Base Version */}
          <div className="bg-background rounded-xl p-3.5 border border-border space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-text-tertiary pb-1 border-b border-border/60">
              <span className="font-semibold text-rose-500/90 flex items-center gap-1">
                <MinusCircle className="w-3 h-3" /> {baseVersionLabel}
              </span>
              <span className="font-mono text-[10px]">PREVIOUS</span>
            </div>

            {clause.oldText ? (
              <p className="text-xs text-text-secondary leading-relaxed font-sans font-normal pt-1 whitespace-pre-line">
                {clause.oldText}
              </p>
            ) : (
              <div className="py-6 text-center text-xs italic text-text-tertiary">
                Clause did not exist in {baseVersionLabel}
              </div>
            )}
          </div>

          {/* Right Panel: Target Version */}
          <div className="bg-background rounded-xl p-3.5 border border-border space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-text-tertiary pb-1 border-b border-border/60">
              <span className="font-semibold text-emerald-500 flex items-center gap-1">
                <PlusCircle className="w-3 h-3" /> {targetVersionLabel}
              </span>
              <span className="font-mono text-[10px]">CURRENT</span>
            </div>

            {clause.newText ? (
              <p className="text-xs text-text-primary leading-relaxed font-sans font-normal pt-1 whitespace-pre-line bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/20">
                {clause.newText}
              </p>
            ) : (
              <div className="py-6 text-center text-xs italic text-text-tertiary">
                Clause was sunsetted / removed in {targetVersionLabel}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIFF DISPLAY: Unified Diff View */}
      {viewMode === 'unified' && (
        <div className="bg-background rounded-xl p-4 border border-border space-y-2.5 font-mono text-xs">
          {/* Removed text block if exists */}
          {clause.oldText && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 p-3 rounded-lg leading-relaxed whitespace-pre-line">
              <div className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1 flex items-center gap-1">
                <MinusCircle className="w-3 h-3" /> Removed from {baseVersionLabel}
              </div>
              - {clause.oldText}
            </div>
          )}

          {/* Added text block if exists */}
          {clause.newText && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 p-3 rounded-lg leading-relaxed whitespace-pre-line">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1 flex items-center gap-1">
                <PlusCircle className="w-3 h-3" /> Added in {targetVersionLabel}
              </div>
              + {clause.newText}
            </div>
          )}

          {/* If clause didn't have oldText or newText */}
          {!clause.oldText && !clause.newText && (
            <div className="text-text-tertiary italic text-center py-2">
              No textual changes recorded
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClauseDiffCard;
