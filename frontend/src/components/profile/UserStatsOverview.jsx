import { FileSearch, Eye, ShieldAlert, FileBarChart } from 'lucide-react';

const UserStatsOverview = ({ user }) => {
  const stats = [
    {
      label: 'Policies Analyzed',
      value: user?.analyzedCount || 12,
      icon: FileSearch,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Monitored Services',
      value: user?.monitoredPoliciesCount || 6,
      icon: Eye,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: 'Red Flags Identified',
      value: user?.redFlagsPrevented || 28,
      icon: ShieldAlert,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Audit Reports Exported',
      value: user?.reportsCount || 5,
      icon: FileBarChart,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat) => {
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

export default UserStatsOverview;
