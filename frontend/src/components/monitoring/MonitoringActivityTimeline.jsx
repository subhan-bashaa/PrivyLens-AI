import { Link } from 'react-router-dom';
import {
  Activity,
  Eye,
  AlertTriangle,
  Bell,
  FileBarChart,
  ArrowRight,
} from 'lucide-react';

const EVENT_CONFIG = {
  check: {
    icon: Eye,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    label: 'Scan Complete',
  },
  change_detected: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    label: 'Change Detected',
  },
  alert: {
    icon: Bell,
    color: 'text-danger',
    bg: 'bg-danger/10',
    border: 'border-danger/20',
    label: 'Alert',
  },
  report: {
    icon: FileBarChart,
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/20',
    label: 'Report',
  },
};

const SEVERITY_DOT = {
  none: 'bg-primary',
  minor: 'bg-info',
  moderate: 'bg-warning',
  major: 'bg-danger',
};

const MonitoringActivityTimeline = ({ events = [] }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Activity className="w-4 h-4 text-secondary" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-text-primary tracking-tight">
              Activity Timeline
            </h3>
            <p className="text-xs text-text-secondary">
              Recent monitoring events and detected changes
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-text-tertiary bg-page-bg px-2.5 py-1 rounded-lg border border-border">
          {events.length} Events
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-1">
          {events.map((event, idx) => {
            const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.check;
            const EventIcon = config.icon;
            const severityDot = SEVERITY_DOT[event.severity] || SEVERITY_DOT.none;
            const timeAgo = getRelativeTime(event.timestamp);

            return (
              <div
                key={event.eventId}
                className="relative flex items-start gap-3 pl-0 py-3 group animate-fade-in"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Timeline Node */}
                <div className={`relative z-10 w-[30px] h-[30px] rounded-full ${config.bg} border ${config.border} flex items-center justify-center shrink-0`}>
                  <EventIcon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  {/* Top Meta */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold text-text-primary">
                      {event.serviceIcon} {event.serviceName}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${config.bg} ${config.color}`}>
                      {config.label}
                    </span>
                    {event.severity && event.severity !== 'none' && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-text-tertiary">
                        <span className={`w-1.5 h-1.5 rounded-full ${severityDot}`} />
                        {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                      </span>
                    )}
                    <span className="text-[10px] text-text-tertiary font-medium ml-auto shrink-0">
                      {timeAgo}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {event.description}
                  </p>

                  {/* View Details Link (for changes/alerts) */}
                  {(event.type === 'change_detected' || event.type === 'alert') && (
                    <Link
                      to={`/policy/${event.policyId}/details`}
                      className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      View details
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function getRelativeTime(isoString) {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default MonitoringActivityTimeline;
