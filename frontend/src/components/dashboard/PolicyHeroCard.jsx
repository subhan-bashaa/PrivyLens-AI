import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Activity,
  FileText,
  MessageSquare,
  Download,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Bell,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import ScoreGauge from './ScoreGauge';

const PolicyHeroCard = ({ policy }) => {
  const [isMonitoring, setIsMonitoring] = useState(policy?.monitoringActive ?? true);
  const [downloading, setDownloading] = useState(false);

  if (!policy) return null;

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Report for ${policy.name} (${policy.version}) has been generated!`);
    }, 1000);
  };

  const recStatusColors = {
    success: 'bg-success-light border-success/30 text-success-dark',
    warning: 'bg-warning-light border-warning/30 text-warning-dark',
    danger: 'bg-danger-light border-danger/30 text-danger-dark',
  }[policy.recommendation?.type || 'warning'];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-border">
        {/* Policy Identification */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-text-primary">
                {policy.name} Privacy Policy
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                {policy.version}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-page-bg text-text-secondary border border-border">
                {policy.category}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-tertiary mt-1.5 flex-wrap">
              <span>Last analyzed: <strong className="text-text-secondary font-medium">{policy.lastAnalyzed}</strong></span>
              <span>•</span>
              <a
                href={policy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary-dark transition-colors"
              >
                View Official Policy <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Monitoring Toggle & Status */}
        <div className="flex items-center gap-3 bg-page-bg px-4 py-2.5 rounded-xl border border-border self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${isMonitoring ? 'bg-success animate-pulse' : 'bg-text-tertiary'}`} />
            <div>
              <p className="text-xs font-semibold text-text-primary leading-tight">
                Policy Monitoring
              </p>
              <p className="text-[11px] text-text-tertiary">
                {isMonitoring ? 'Tracking active changes' : 'Monitoring paused'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`
              relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
              transition-colors duration-200 ease-in-out focus:outline-none ml-2
              ${isMonitoring ? 'bg-primary' : 'bg-border'}
            `}
            role="switch"
            aria-checked={isMonitoring}
            aria-label="Toggle policy monitoring"
          >
            <span
              className={`
                pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm 
                transition duration-200 ease-in-out
                ${isMonitoring ? 'translate-x-4' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Main Content Grid: Score + AI Recommendation + Action Bar */}
      <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Score Gauge Col */}
        <div className="md:col-span-4 lg:col-span-3 flex justify-center md:border-r border-border md:pr-6">
          <ScoreGauge score={policy.trustScore} maxScore={10} size="md" />
        </div>

        {/* Recommendation & Insights Summary */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between space-y-4">
          {/* AI Recommendation Alert */}
          <div className={`p-4 rounded-xl border ${recStatusColors}`}>
            <div className="flex items-start gap-3">
              {policy.recommendation?.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-success" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-warning" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Recommendation: {policy.recommendation?.status}
                  </span>
                  <span className="text-[11px] font-medium opacity-80 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Synthesis
                  </span>
                </div>
                <p className="text-sm font-medium leading-relaxed">
                  {policy.recommendation?.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/policy/${policy.id}/summary`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              View Full AI Summary
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>

            <Link
              to={`/policy/${policy.id}/details`}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-text-primary bg-card border border-border hover:bg-card-hover rounded-xl transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-primary" />
              Ask AI Assistant
            </Link>

            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-text-secondary hover:text-text-primary bg-card border border-border hover:bg-card-hover rounded-xl transition-all cursor-pointer ml-auto"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Exporting...' : 'Export PDF Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyHeroCard;
