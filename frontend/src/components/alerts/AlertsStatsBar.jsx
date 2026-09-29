import {
  Bell,
  Mail,
  AlertTriangle,
  Flame,
  CheckCircle2,
} from 'lucide-react';

const AlertsStatsBar = ({ stats, activeFilter, onSelectFilter }) => {
  if (!stats) return null;

  const statCards = [
    {
      id: 'all',
      label: 'Total Alerts',
      value: stats.total,
      icon: Bell,
      color: 'text-text-primary',
      bg: 'bg-primary/10',
      activeBorder: 'border-primary/50',
    },
    {
      id: 'unread',
      label: 'Unread Alerts',
      value: stats.unread,
      icon: Mail,
      color: stats.unread > 0 ? 'text-amber-500' : 'text-text-secondary',
      bg: stats.unread > 0 ? 'bg-amber-500/10' : 'bg-background-subtle',
      activeBorder: 'border-amber-500/50',
    },
    {
      id: 'critical',
      label: 'Critical Priority',
      value: stats.critical,
      icon: AlertTriangle,
      color: stats.critical > 0 ? 'text-danger' : 'text-text-secondary',
      bg: stats.critical > 0 ? 'bg-danger/10' : 'bg-background-subtle',
      activeBorder: 'border-danger/50',
    },
    {
      id: 'high',
      label: 'High Priority',
      value: stats.high,
      icon: Flame,
      color: stats.high > 0 ? 'text-warning' : 'text-text-secondary',
      bg: stats.high > 0 ? 'bg-warning/10' : 'bg-background-subtle',
      activeBorder: 'border-warning/50',
    },
    {
      id: 'resolved',
      label: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      activeBorder: 'border-emerald-500/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const isSelected = activeFilter === stat.id;
        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => onSelectFilter && onSelectFilter(stat.id)}
            className={`text-left bg-card border rounded-2xl p-4 shadow-sm transition-all cursor-pointer hover:shadow-md ${
              isSelected
                ? `${stat.activeBorder} ring-2 ring-primary/20 shadow-md`
                : 'border-border hover:border-primary/20'
            }`}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
              </div>
              <span className="text-[11px] font-medium text-text-tertiary truncate">
                {stat.label}
              </span>
            </div>
            <div className="text-xl font-extrabold text-text-primary tracking-tight">
              {stat.value}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AlertsStatsBar;
