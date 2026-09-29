import { useState } from 'react';
import {
  Database,
  Share2,
  Cookie,
  Clock,
  UserCheck,
  Lock,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
} from 'lucide-react';

const CATEGORY_ICONS = {
  Database,
  Share2,
  Cookie,
  Clock,
  UserCheck,
  Lock,
};

const RISK_BADGES = {
  low: {
    bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
    label: 'Low Risk',
  },
  medium: {
    bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600',
    label: 'Medium Risk',
  },
  high: {
    bg: 'bg-red-500/10 border-red-500/20 text-red-600',
    label: 'High Risk',
  },
};

const BulletSummaryCard = ({ policy }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Default insights fallback if policy keyInsights array is empty
  const insights = policy.keyInsights?.length > 0 ? policy.keyInsights : [
    {
      id: 'collection',
      category: 'Data Collection',
      risk: 'medium',
      summary: 'Collects account registration details, device hardware info, IP address, and interaction metrics.',
      details: [
        'User profile info (display name, email, credentials)',
        'Device telemetry, OS version, and network identifiers',
        'Usage logs, feature engagement frequency, and session timestamps',
      ],
      iconName: 'Database',
    },
    {
      id: 'sharing',
      category: 'Data Sharing',
      risk: 'medium',
      summary: 'Discloses aggregate statistics and payment transaction data to verified third-party vendors.',
      details: [
        'Cloud hosting providers and infrastructure partners',
        'Analytics processors for service optimization',
        'Payment gateway integration partners',
      ],
      iconName: 'Share2',
    },
    {
      id: 'tracking',
      category: 'Cookies & Tracking',
      risk: 'medium',
      summary: 'Deploys first-party cookies for session management and third-party tracking beacons.',
      details: [
        'Essential cookies required for platform security and authentication',
        'Performance metrics cookies for crash analysis',
      ],
      iconName: 'Cookie',
    },
    {
      id: 'retention',
      category: 'Data Retention',
      risk: 'low',
      summary: 'Retains data for the duration of the active account; purges backups within 90 days.',
      details: [
        'Account credentials preserved until voluntary user deletion',
        'Routine backups cycled and deleted after 90 days',
      ],
      iconName: 'Clock',
    },
    {
      id: 'rights',
      category: 'User Rights',
      risk: 'low',
      summary: 'Provides self-serve data export, correction requests, and direct account termination options.',
      details: [
        'One-click JSON / PDF archive download tool',
        'Direct right to be forgotten (account removal)',
      ],
      iconName: 'UserCheck',
    },
    {
      id: 'security',
      category: 'Security & Encryption',
      risk: 'low',
      summary: 'Enforces standard TLS 1.3 encryption in transit and AES-256 encryption at rest.',
      details: [
        'Zero plain-text transmission across public networks',
        'Two-factor authentication support',
      ],
      iconName: 'Lock',
    },
  ];

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-text-primary tracking-tight">
              Plain-Language Policy Breakdown
            </h3>
            <p className="text-xs text-text-secondary">
              What this policy means for you in plain English — no legal jargon.
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-text-tertiary bg-page-bg px-2.5 py-1 rounded-lg border border-border">
          {insights.length} Key Domains
        </span>
      </div>

      {/* Domain Cards Grid */}
      <div className="space-y-3">
        {insights.map((item, idx) => {
          const IconComponent = CATEGORY_ICONS[item.iconName] || Database;
          const riskConfig = RISK_BADGES[item.risk] || RISK_BADGES.medium;
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={item.id || idx}
              className="border border-border/80 hover:border-primary/40 rounded-xl p-4 bg-page-bg/40 hover:bg-page-bg/80 transition-all duration-200"
            >
              {/* Top Row: Icon, Title, Summary, Risk, and Expand Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-text-primary tracking-wide">
                        {item.category}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${riskConfig.bg}`}
                      >
                        {riskConfig.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed font-medium">
                      {item.summary}
                    </p>
                  </div>
                </div>

                {/* Expand / Collapse Details Button */}
                {item.details && item.details.length > 0 && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-tertiary hover:text-primary transition-colors self-end sm:self-center cursor-pointer shrink-0"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Specifics'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Collapsible Details Drawer */}
              {isExpanded && item.details && (
                <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5 pl-11 animate-fade-in">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary block mb-1">
                    Specific Clause Disclosures:
                  </span>
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2 text-xs text-text-secondary">
                      <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BulletSummaryCard;
