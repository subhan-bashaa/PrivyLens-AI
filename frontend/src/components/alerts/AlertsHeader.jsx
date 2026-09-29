import { Bell, CheckCheck, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AlertsHeader = ({ unreadCount, resolvedCount, onMarkAllRead, onClearResolved }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Title + Description */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-warning" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                Alerts Center
              </h1>
              {unreadCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-danger/10 text-danger border border-danger/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
                  </span>
                  {unreadCount} Unread
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  All Caught Up
                </span>
              )}
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Review policy changes, score adjustments, and compliance notifications
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <button
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              unreadCount > 0
                ? 'bg-card border-border hover:bg-background-hover text-text-primary hover:border-primary/30 cursor-pointer shadow-xs'
                : 'bg-background-subtle/50 border-border/50 text-text-tertiary cursor-not-allowed opacity-60'
            }`}
          >
            <CheckCheck className="w-3.5 h-3.5 text-primary" />
            Mark All Read
          </button>

          <button
            onClick={onClearResolved}
            disabled={resolvedCount === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              resolvedCount > 0
                ? 'bg-card border-border hover:bg-background-hover text-text-primary hover:border-danger/30 hover:text-danger cursor-pointer shadow-xs'
                : 'bg-background-subtle/50 border-border/50 text-text-tertiary cursor-not-allowed opacity-60'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Resolved
          </button>

          <Link
            to="/monitoring"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-sm"
          >
            Monitoring
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AlertsHeader;
