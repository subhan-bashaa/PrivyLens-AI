import { Search, Filter, SlidersHorizontal, ShieldAlert, Sparkles, Scale, FileText, LayoutGrid } from 'lucide-react';

const TYPE_TABS = [
  { id: 'all', label: 'All Alerts', icon: LayoutGrid },
  { id: 'policy_change', label: 'Policy Changes', icon: FileText },
  { id: 'risk_score_change', label: 'Score Shifts', icon: Sparkles },
  { id: 'compliance_breach', label: 'Compliance', icon: Scale },
  { id: 'monitoring_report', label: 'Reports', icon: ShieldAlert },
];

const SEVERITY_OPTIONS = [
  { id: 'all', label: 'All Severities' },
  { id: 'critical', label: 'Critical', color: 'text-danger' },
  { id: 'high', label: 'High', color: 'text-warning' },
  { id: 'medium', label: 'Medium', color: 'text-amber-500' },
  { id: 'low', label: 'Low', color: 'text-info' },
];

const STATUS_OPTIONS = [
  { id: 'all', label: 'All Status' },
  { id: 'unread', label: 'Unread Only' },
  { id: 'resolved', label: 'Resolved' },
];

const AlertsFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSeverity,
  onSeverityChange,
  selectedStatus,
  onStatusChange,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top row: Search input + Status & Severity dropdowns */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search alerts by service, keyword, or change title..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-background border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-tertiary hover:text-text-primary px-1.5 py-0.5 rounded-md hover:bg-background-subtle"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Filters dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-text-tertiary" />
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-text-primary focus:outline-hidden cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-card text-text-primary">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Severity filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-text-tertiary" />
            <select
              value={selectedSeverity}
              onChange={(e) => onSeverityChange(e.target.value)}
              className="bg-transparent text-xs font-medium text-text-primary focus:outline-hidden cursor-pointer"
            >
              {SEVERITY_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id} className="bg-card text-text-primary">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Counter badge */}
          <span className="text-[11px] font-medium text-text-tertiary px-2 py-1 bg-background-subtle rounded-lg border border-border">
            {filteredCount} of {totalCount}
          </span>
        </div>
      </div>

      {/* Bottom row: Type Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-border/50 pt-3">
        {TYPE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTypeChange(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs font-bold'
                  : 'bg-background hover:bg-background-hover text-text-secondary border border-border hover:border-primary/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsFilterBar;
