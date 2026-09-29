import { BarChart3, TrendingUp } from 'lucide-react';

const ScoreBreakdownChart = ({ scores = {} }) => {
  const categories = [
    { key: 'collection', label: 'Data Collection', score: scores.collection ?? 6.5, avg: 5.8 },
    { key: 'sharing', label: 'Data Sharing', score: scores.sharing ?? 5.8, avg: 5.2 },
    { key: 'tracking', label: 'Cookies & Tracking', score: scores.tracking ?? 6.0, avg: 5.4 },
    { key: 'retention', label: 'Data Retention', score: scores.retention ?? 7.5, avg: 6.8 },
    { key: 'rights', label: 'User Rights', score: scores.rights ?? 8.2, avg: 7.0 },
    { key: 'security', label: 'Security & Encryption', score: scores.security ?? 9.0, avg: 8.1 },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Score Breakdown by Category</h3>
            <p className="text-xs text-text-tertiary">Detailed privacy rating compared with industry benchmark</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-text-secondary font-medium">This Policy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-border" />
            <span className="text-text-tertiary">Industry Benchmark</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((item) => {
          const scoreColor =
            item.score >= 8
              ? 'bg-success'
              : item.score >= 5
              ? 'bg-warning'
              : 'bg-danger';

          return (
            <div key={item.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-text-tertiary hidden sm:inline">
                    Industry avg: {item.avg.toFixed(1)}
                  </span>
                  <span className="font-bold text-text-primary bg-page-bg px-2 py-0.5 rounded border border-border">
                    {item.score.toFixed(1)} / 10
                  </span>
                </div>
              </div>

              {/* Progress bars container */}
              <div className="relative w-full h-3 bg-page-bg rounded-full overflow-hidden border border-border-light">
                {/* Industry average marker line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-text-tertiary/40 z-10"
                  style={{ left: `${item.avg * 10}%` }}
                  title={`Industry average: ${item.avg}`}
                />
                {/* Score bar */}
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${scoreColor}`}
                  style={{ width: `${item.score * 10}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreBreakdownChart;
