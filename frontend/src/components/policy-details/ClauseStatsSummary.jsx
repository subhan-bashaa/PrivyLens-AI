import {
  BarChart3,
  AlertTriangle,
  ShieldAlert,
  FileText,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: { bg: 'bg-red-600', text: 'text-white', label: 'Critical' },
  high: { bg: 'bg-danger', text: 'text-white', label: 'High' },
  medium: { bg: 'bg-warning', text: 'text-white', label: 'Medium' },
  low: { bg: 'bg-primary', text: 'text-white', label: 'Low' },
};

const ClauseStatsSummary = ({ clauses = [], trustScore = 0 }) => {
  const total = clauses.length;
  const critical = clauses.filter((c) => c.severity === 'critical').length;
  const high = clauses.filter((c) => c.severity === 'high').length;
  const medium = clauses.filter((c) => c.severity === 'medium').length;
  const low = clauses.filter((c) => c.severity === 'low').length;

  const stats = [
    {
      label: 'Total Clauses',
      value: total,
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Critical Issues',
      value: critical,
      icon: ShieldAlert,
      color: 'text-red-600',
      bg: 'bg-red-500/10',
    },
    {
      label: 'High Risk',
      value: high,
      icon: AlertTriangle,
      color: 'text-danger',
      bg: 'bg-danger/10',
    },
    {
      label: 'Medium Risk',
      value: medium,
      icon: TrendingDown,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Low Risk',
      value: low,
      icon: CheckCircle2,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  // Severity distribution bar
  const severityDistribution = [
    { key: 'critical', count: critical, color: 'bg-red-600' },
    { key: 'high', count: high, color: 'bg-danger' },
    { key: 'medium', count: medium, color: 'bg-warning' },
    { key: 'low', count: low, color: 'bg-primary' },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-text-primary tracking-tight">
            Analysis Overview
          </h3>
          <p className="text-xs text-text-secondary">
            AI-powered clause breakdown and risk distribution
          </p>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-3 rounded-xl border border-border bg-page-bg/50 hover:bg-page-bg/80 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-6 h-6 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                </div>
                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <span className={`text-2xl font-extrabold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Severity Distribution Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-text-secondary">
            Severity Distribution
          </span>
          <span className="text-[10px] font-semibold text-text-tertiary">
            {total} clauses analyzed
          </span>
        </div>
        <div className="flex h-3 rounded-full overflow-hidden bg-page-bg border border-border gap-0.5">
          {severityDistribution.map((item) =>
            item.count > 0 ? (
              <div
                key={item.key}
                className={`${item.color} transition-all duration-500 rounded-full`}
                style={{ width: `${(item.count / total) * 100}%` }}
                title={`${SEVERITY_CONFIG[item.key].label}: ${item.count}`}
              />
            ) : null
          )}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-2">
          {severityDistribution.map((item) => (
            <div key={item.key} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-[10px] font-medium text-text-tertiary">
                {SEVERITY_CONFIG[item.key].label} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClauseStatsSummary;
