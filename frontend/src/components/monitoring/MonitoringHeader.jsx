import { Eye, Plus, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const MonitoringHeader = () => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Title + Description */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                Policy Monitoring
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Live
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Track real-time privacy policy changes across all your monitored services
            </p>
          </div>
        </div>

        {/* Right: Add Policy CTA */}
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Policy to Monitor
        </Link>
      </div>
    </div>
  );
};

export default MonitoringHeader;
