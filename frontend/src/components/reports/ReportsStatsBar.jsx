import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HardDrive,
} from 'lucide-react';

const ReportsStatsBar = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    {
      label: 'Generated Reports',
      value: stats.totalReports,
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Compliance Pass Rate',
      value: stats.compliancePassRate,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Documented Red Flags',
      value: stats.redFlagsDocumented,
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Scheduled Audits',
      value: `${stats.activeSchedules} Active`,
      icon: Clock,
      color: 'text-info',
      bg: 'bg-info/10',
      isText: true,
    },
    {
      label: 'Storage Archive',
      value: stats.storageUsed,
      icon: HardDrive,
      color: 'text-text-secondary',
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
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-7 h-7 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-medium text-text-tertiary truncate">
                {stat.label}
              </span>
            </div>
            <div className="text-xl font-extrabold text-text-primary tracking-tight">
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportsStatsBar;
