import { Search, Filter, Layers, LayoutGrid } from 'lucide-react';

const FORMAT_TABS = [
  { id: 'all', label: 'All Formats', icon: LayoutGrid },
  { id: 'PDF', label: 'PDF Documents' },
  { id: 'CSV', label: 'CSV Spreadsheets' },
  { id: 'JSON', label: 'JSON Data' },
];

const TYPE_OPTIONS = [
  { id: 'all', label: 'All Report Types' },
  { id: 'executive', label: 'Executive Briefs' },
  { id: 'compliance', label: 'Compliance Audits' },
  { id: 'benchmark', label: 'Competitive Benchmarks' },
  { id: 'manifest', label: 'Clause Manifests' },
];

const ReportsFilterBar = ({
  searchQuery,
  onSearchChange,
  selectedFormat,
  onFormatChange,
  selectedType,
  onTypeChange,
  selectedService,
  onServiceChange,
  availableServices = [],
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
      {/* Top row: Search input + Type & Service Selectors */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search reports by service, keyword, or compliance finding..."
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

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Service filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1.5">
            <Layers className="w-3.5 h-3.5 text-text-tertiary" />
            <select
              value={selectedService}
              onChange={(e) => onServiceChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-text-primary focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="bg-card text-text-primary">
                All Monitored Services
              </option>
              {availableServices.map((svc) => (
                <option key={svc.id} value={svc.id} className="bg-card text-text-primary">
                  {svc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-1.5">
            <Filter className="w-3.5 h-3.5 text-text-tertiary" />
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-text-primary focus:outline-hidden cursor-pointer"
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t.id} value={t.id} className="bg-card text-text-primary">
                  {t.label}
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

      {/* Bottom row: Format Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-border/50 pt-3">
        {FORMAT_TABS.map((tab) => {
          const isActive = selectedFormat === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFormatChange(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-xs font-bold'
                  : 'bg-background hover:bg-background-hover text-text-secondary border border-border'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReportsFilterBar;
