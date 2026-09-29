import { Shield, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  Compliant: {
    icon: CheckCircle2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    ring: 'stroke-primary',
    trackRing: 'stroke-primary/15',
  },
  Partial: {
    icon: AlertCircle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    ring: 'stroke-warning',
    trackRing: 'stroke-warning/15',
  },
  'Non-Compliant': {
    icon: XCircle,
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/20',
    ring: 'stroke-danger',
    trackRing: 'stroke-danger/15',
  },
};

const STANDARD_LABELS = {
  gdpr: { name: 'GDPR', full: 'General Data Protection Regulation (EU)' },
  ccpa: { name: 'CCPA', full: 'California Consumer Privacy Act (US)' },
  coppa: { name: 'COPPA', full: "Children's Online Privacy Protection Act (US)" },
};

// Mini circular progress component
const CircularProgress = ({ percentage, config, size = 60, strokeWidth = 5 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className={config.trackRing}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={config.ring}
        style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
      />
    </svg>
  );
};

const ComplianceDashboard = ({ complianceSummary }) => {
  if (!complianceSummary) return null;

  const standards = Object.entries(complianceSummary);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-text-primary tracking-tight">
              Regulatory Compliance
            </h3>
            <p className="text-xs text-text-secondary">
              Alignment with major privacy regulations
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {standards.map(([key, data]) => {
          const standardInfo = STANDARD_LABELS[key] || { name: key.toUpperCase(), full: key };
          const config = STATUS_CONFIG[data.status] || STATUS_CONFIG.Partial;
          const StatusIcon = config.icon;

          return (
            <div
              key={key}
              className={`relative p-4 rounded-xl border ${config.border} ${config.bg} transition-all duration-200 hover:shadow-sm`}
            >
              {/* Top Row: Progress Ring + Score */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative shrink-0">
                  <CircularProgress percentage={data.score} config={config} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-sm font-extrabold ${config.color}`}>
                      {data.score}%
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-text-primary">
                    {standardInfo.name}
                  </h4>
                  <p className="text-[10px] text-text-tertiary leading-tight truncate">
                    {standardInfo.full}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 mb-2">
                <StatusIcon className={`w-3.5 h-3.5 ${config.color}`} />
                <span className={`text-xs font-bold ${config.color}`}>
                  {data.status}
                </span>
              </div>

              {/* Gap Summary */}
              <p className="text-[11px] text-text-secondary leading-relaxed">
                {data.gaps}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplianceDashboard;
