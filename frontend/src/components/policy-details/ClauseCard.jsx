import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Quote,
  Brain,
  Zap,
  CheckCircle2,
  XCircle,
  Database,
  Share2,
  Cookie,
  Clock,
  UserCheck,
  Lock,
} from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: {
    bg: 'bg-red-600',
    text: 'text-white',
    label: 'Critical',
    border: 'border-red-500/30',
    lightBg: 'bg-red-500/5',
    accentBorder: 'border-l-red-600',
  },
  high: {
    bg: 'bg-danger',
    text: 'text-white',
    label: 'High',
    border: 'border-danger/30',
    lightBg: 'bg-danger/5',
    accentBorder: 'border-l-danger',
  },
  medium: {
    bg: 'bg-warning',
    text: 'text-white',
    label: 'Medium',
    border: 'border-warning/30',
    lightBg: 'bg-warning/5',
    accentBorder: 'border-l-warning',
  },
  low: {
    bg: 'bg-primary',
    text: 'text-white',
    label: 'Low',
    border: 'border-primary/30',
    lightBg: 'bg-primary/5',
    accentBorder: 'border-l-primary',
  },
};

const CATEGORY_ICONS = {
  collection: Database,
  sharing: Share2,
  tracking: Cookie,
  retention: Clock,
  rights: UserCheck,
  security: Lock,
};

const CATEGORY_LABELS = {
  collection: 'Data Collection',
  sharing: 'Data Sharing',
  tracking: 'Cookies & Tracking',
  retention: 'Data Retention',
  rights: 'User Rights',
  security: 'Security & Encryption',
};

const ClauseCard = ({ clause, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const severity = SEVERITY_CONFIG[clause.severity] || SEVERITY_CONFIG.medium;
  const CategoryIcon = CATEGORY_ICONS[clause.category] || Database;
  const categoryLabel = CATEGORY_LABELS[clause.category] || clause.category;

  return (
    <div
      className={`border ${severity.border} rounded-xl ${severity.lightBg} hover:shadow-sm transition-all duration-200 border-l-4 ${severity.accentBorder} overflow-hidden animate-fade-in`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="p-4 sm:p-5">
        {/* Top Row: Section Reference + Severity Badge + Category */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {/* Severity Badge */}
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${severity.bg} ${severity.text}`}
            >
              {severity.label}
            </span>
            {/* Category Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-card border border-border text-text-secondary">
              <CategoryIcon className="w-3 h-3" />
              {categoryLabel}
            </span>
          </div>
          {/* Section Reference */}
          <span className="text-[10px] font-medium text-text-tertiary shrink-0">
            {clause.section}
          </span>
        </div>

        {/* Clause Title */}
        <h4 className="text-sm font-bold text-text-primary mb-2">
          {clause.title}
        </h4>

        {/* AI Interpretation */}
        <div className="flex items-start gap-2.5 mb-3 p-3 rounded-lg bg-card border border-border">
          <Brain className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1">
              AI Interpretation
            </span>
            <p className="text-xs text-text-secondary leading-relaxed">
              {clause.aiInterpretation}
            </p>
          </div>
        </div>

        {/* Impact Description */}
        <div className="flex items-start gap-2.5 mb-3">
          <Zap className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            <span className="font-bold text-text-primary">Real-World Impact: </span>
            {clause.impactDescription}
          </p>
        </div>

        {/* Compliance Tags */}
        {clause.complianceStandards && (
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
              Compliance:
            </span>
            {Object.entries(clause.complianceStandards).map(([standard, isCompliant]) => (
              <span
                key={standard}
                className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                  isCompliant ? 'text-primary' : 'text-danger'
                }`}
              >
                {isCompliant ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {standard.toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* Expand/Collapse Original Text Toggle */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-text-tertiary hover:text-primary transition-colors cursor-pointer"
        >
          <Quote className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'Hide Original Clause' : 'View Original Policy Text'}</span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Collapsible Original Text */}
        {isExpanded && (
          <div className="mt-3 p-4 rounded-lg bg-card border border-border animate-fade-in">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block mb-2">
              Original Policy Text — {clause.section}
            </span>
            <blockquote className="text-xs text-text-secondary italic leading-relaxed border-l-2 border-primary/30 pl-3">
              &ldquo;{clause.originalText}&rdquo;
            </blockquote>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClauseCard;
