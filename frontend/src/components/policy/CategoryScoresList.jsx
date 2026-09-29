import { BarChart3, ShieldCheck, AlertCircle } from 'lucide-react';

const CATEGORY_DEFINITIONS = [
  {
    key: 'collection',
    label: 'Data Collection',
    description: 'Scope and necessity of data gathered from users and devices.',
    icon: '📦',
  },
  {
    key: 'sharing',
    label: 'Third-Party Sharing',
    description: 'Disclosures to parent companies, advertisers, and partners.',
    icon: '🤝',
  },
  {
    key: 'tracking',
    label: 'Cookies & Telemetry',
    description: 'Persistent behavioral trackers, web beacons, and pixels.',
    icon: '🍪',
  },
  {
    key: 'retention',
    label: 'Data Retention',
    description: 'Storage duration limits and automatic purge timelines.',
    icon: '⏳',
  },
  {
    key: 'rights',
    label: 'User Rights & Deletion',
    description: 'Self-serve export, correction tools, and account erasure.',
    icon: '⚖️',
  },
  {
    key: 'security',
    label: 'Security & Encryption',
    description: 'Signal protocol, TLS 1.3, and access controls applied.',
    icon: '🛡️',
  },
];

const getScoreColor = (val) => {
  if (val >= 8.0) return { bar: 'bg-emerald-500', text: 'text-emerald-600', label: 'Strong' };
  if (val >= 5.0) return { bar: 'bg-amber-500', text: 'text-amber-600', label: 'Moderate' };
  return { bar: 'bg-red-500', text: 'text-red-600', label: 'High Risk' };
};

const CategoryScoresList = ({ scores = {} }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-text-primary tracking-tight">
              Privacy Pillars Breakdown
            </h3>
            <p className="text-xs text-text-secondary">
              Granular evaluation across the 6 primary data privacy benchmarks.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-text-tertiary bg-page-bg px-2.5 py-1 rounded-lg border border-border">
          Scale 0 - 10
        </span>
      </div>

      {/* Category Items Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {CATEGORY_DEFINITIONS.map((cat) => {
          const scoreVal = scores[cat.key] !== undefined ? scores[cat.key] : 7.0;
          const percentage = Math.min(Math.max((scoreVal / 10) * 100, 0), 100);
          const { bar, text, label } = getScoreColor(scoreVal);

          return (
            <div
              key={cat.key}
              className="p-3 rounded-xl border border-border/80 bg-page-bg/40 hover:bg-page-bg/80 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none shrink-0">{cat.icon}</span>
                  <span className="text-xs font-bold text-text-primary">{cat.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-black ${text}`}>
                    {scoreVal.toFixed(1)}
                    <span className="text-[10px] text-text-tertiary font-normal ml-0.5">/10</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      scoreVal >= 8
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : scoreVal >= 5
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-text-secondary leading-snug mb-2 font-medium">
                {cat.description}
              </p>

              {/* Progress Bar */}
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full ${bar} transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryScoresList;
