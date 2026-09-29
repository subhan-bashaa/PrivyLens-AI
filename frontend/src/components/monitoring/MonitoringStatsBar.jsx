import {
  Eye,
  Shield,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react';

const MonitoringStatsBar = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Monitored',
      value: stats.totalMonitored,
      icon: Eye,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Active Alerts',
      value: stats.activeAlerts,
      icon: AlertTriangle,
      color: stats.activeAlerts > 0 ? 'text-danger' : 'text-primary',
      bg: stats.activeAlerts > 0 ? 'bg-danger/10' : 'bg-primary/10',
    },
    {
      label: 'Changes This Month',
      value: stats.changesThisMonth,
      icon: TrendingUp,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Active Monitoring',
      value: stats.activeMonitoring,
      icon: Shield,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Avg. Frequency',
      value: stats.avgCheckFrequency,
      icon: Clock,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider leading-tight">
                {stat.label}
              </span>
            </div>
            <span className={`text-2xl font-extrabold ${stat.color}`}>
              {stat.isText ? stat.value : stat.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default MonitoringStatsBar;
