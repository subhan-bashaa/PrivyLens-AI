import {
  Columns2,
  ListFilter,
  Sparkles,
  Search,
  SlidersHorizontal,
  PlusCircle,
  FileEdit,
  MinusCircle,
  Equal,
} from 'lucide-react';

const VIEW_MODES = [
  { id: 'split', label: 'Side-by-Side', icon: Columns2 },
  { id: 'unified', label: 'Unified Diff', icon: ListFilter },
  { id: 'highlights', label: 'AI Highlights', icon: Sparkles },
];

const CHANGE_TYPES = [
  { id: 'all', label: 'All Clauses', icon: null },
  { id: 'added', label: 'Added', icon: PlusCircle, color: 'text-emerald-500' },
  { id: 'modified', label: 'Modified', icon: FileEdit, color: 'text-amber-500' },
  { id: 'removed', label: 'Removed', icon: MinusCircle, color: 'text-rose-500' },
  { id: 'unchanged', label: 'Unchanged', icon: Equal, color: 'text-text-tertiary' },
];

const SEVERITIES = [
  { id: 'all', label: 'All Severities' },
  { id: 'critical', label: 'Critical' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

const CompareFilterBar = ({
  viewMode,
  onViewModeChange,
  changeType,
  onChangeTypeChange,
  severity,
  onSeverityChange,
  searchQuery,
  onSearchChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Row: View Mode Tabs + Search Input + Severity Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* View Mode Toggle Buttons */}
        <div className="inline-flex items-center bg-background p-1 rounded-xl border border-border shrink-0 self-start">
          {VIEW_MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = viewMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onViewModeChange(mode.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-card text-primary shadow-xs border border-border/80'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {mode.label}
              </button>
            );
          })}
        </div>

        {/* Search & Severity (Only shown when not in highlights mode) */}
        {viewMode !== 'highlights' && (
          <div className="flex items-center gap-2.5 flex-1 max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search clause title, text, or section..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-primary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-text-tertiary hover:text-text-primary"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1.5 shrink-0">
              <SlidersHorizontal className="w-3 h-3 text-text-tertiary" />
              <select
                value={severity}
                onChange={(e) => onSeverityChange(e.target.value)}
                className="bg-transparent text-xs font-semibold text-text-primary focus:outline-hidden cursor-pointer"
              >
                {SEVERITIES.map((s) => (
                  <option key={s.id} value={s.id} className="bg-card text-text-primary">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Counter */}
            <span className="text-[11px] font-medium text-text-tertiary bg-background px-2.5 py-1.5 rounded-xl border border-border shrink-0 hidden sm:inline-block">
              {filteredCount} of {totalCount}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Row: Change Type Tabs (Only shown when not in highlights mode) */}
      {viewMode !== 'highlights' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-border/50 pt-3">
          {CHANGE_TYPES.map((tab) => {
            const Icon = tab.icon;
            const isActive = changeType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTypeChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs font-bold'
                    : 'bg-background hover:bg-background-hover text-text-secondary border border-border'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color}`} />}
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompareFilterBar;
