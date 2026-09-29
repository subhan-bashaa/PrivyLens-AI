import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from 'lucide-react';

const SEVERITY_CHIPS = [
  { key: 'all', label: 'All', color: 'bg-text-secondary' },
  { key: 'critical', label: 'Critical', color: 'bg-red-600' },
  { key: 'high', label: 'High', color: 'bg-danger' },
  { key: 'medium', label: 'Medium', color: 'bg-warning' },
  { key: 'low', label: 'Low', color: 'bg-primary' },
];

const CATEGORY_OPTIONS = [
  { key: 'all', label: 'All Categories' },
  { key: 'collection', label: 'Data Collection' },
  { key: 'sharing', label: 'Data Sharing' },
  { key: 'tracking', label: 'Cookies & Tracking' },
  { key: 'retention', label: 'Data Retention' },
  { key: 'rights', label: 'User Rights' },
  { key: 'security', label: 'Security & Encryption' },
];

const SORT_OPTIONS = [
  { key: 'severity', label: 'By Severity' },
  { key: 'section', label: 'By Section' },
  { key: 'category', label: 'By Category' },
];

const ClauseFilterBar = ({
  searchTerm,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  filteredCount,
  totalCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Row: Search + Toggle */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search clauses, sections, or keywords..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-border bg-page-bg text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button (mobile) */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:hidden inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-page-bg text-xs font-semibold text-text-secondary hover:border-primary/40 hover:text-primary cursor-pointer transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </button>

        {/* Results Counter */}
        <span className="hidden sm:inline-flex text-[10px] font-bold text-text-tertiary bg-page-bg px-2.5 py-1.5 rounded-lg border border-border shrink-0">
          {filteredCount} of {totalCount}
        </span>
      </div>

      {/* Filters Row (always visible on desktop, toggleable on mobile) */}
      <div className={`space-y-3 ${isExpanded ? 'block' : 'hidden sm:block'}`}>
        {/* Severity Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider shrink-0">
            Severity:
          </span>
          {SEVERITY_CHIPS.map((chip) => {
            const isActive = severityFilter === chip.key;
            return (
              <button
                key={chip.key}
                type="button"
                onClick={() => onSeverityChange(chip.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? `${chip.color} text-white shadow-sm`
                    : 'bg-page-bg border border-border text-text-secondary hover:border-primary/40 hover:text-primary'
                }`}
              >
                {!isActive && <div className={`w-1.5 h-1.5 rounded-full ${chip.color}`} />}
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Category + Sort Row */}
        <div className="flex items-center gap-3">
          {/* Category Dropdown */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider shrink-0">
              Category:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-border bg-page-bg text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-page-bg text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Results Counter */}
        <div className="sm:hidden text-center">
          <span className="text-[10px] font-bold text-text-tertiary bg-page-bg px-2.5 py-1 rounded-lg border border-border">
            Showing {filteredCount} of {totalCount} clauses
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClauseFilterBar;
