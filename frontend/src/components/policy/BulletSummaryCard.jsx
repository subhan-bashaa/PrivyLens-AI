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
  FileText,
  Copy,
  CheckCheck,
} from 'lucide-react';

const CATEGORY_ICONS = {
  Database,
  Share2,
  Cookie,
  Clock,
  UserCheck,
  Lock,
  Sparkles,
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
  const [activeTab, setActiveTab] = useState('domains'); // 'domains' | 'structured'
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [copied, setCopied] = useState(false);

  const insights = policy.keyInsights?.length > 0 ? policy.keyInsights : [];
  const structuredSummary = policy.structuredSummary || {
    data_collected: 'Personal information, contact details, device telemetry, and usage patterns.',
    purpose_of_data_use: 'To provide, maintain, and secure online platform services.',
    data_sharing: 'Authorized service providers and statutory compliance.',
    data_retention: 'Retained as needed for core service delivery.',
    user_rights: 'Access, correction, and consent withdrawal rights.',
    security: 'Standard transport encryption and secure storage safeguards.',
    other_important_points: 'Standard terms, minimum age compliance, and dispute resolution.',
  };

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(structuredSummary, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const structuredSummaryEntries = [
    { key: 'data_collected', label: 'Data Collected', value: structuredSummary.data_collected },
    { key: 'purpose_of_data_use', label: 'Purpose of Data Use', value: structuredSummary.purpose_of_data_use },
    { key: 'data_sharing', label: 'Data Sharing & Third Parties', value: structuredSummary.data_sharing },
    { key: 'data_retention', label: 'Data Retention & Deletion', value: structuredSummary.data_retention },
    { key: 'user_rights', label: 'User Statutory Rights', value: structuredSummary.user_rights },
    { key: 'security', label: 'Security & Encryption Safeguards', value: structuredSummary.security },
    { key: 'other_important_points', label: 'Other Important Highlights', value: structuredSummary.other_important_points },
  ].filter((entry) => Boolean(entry.value));

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Card Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-text-primary tracking-tight">
              Plain-Language Policy Breakdown
            </h3>
            <p className="text-xs text-text-secondary">
              What this policy means for you in plain English — synthesized from raw legal terms.
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1 bg-page-bg p-1 rounded-xl border border-border self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('domains')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'domains'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Key Domains ({insights.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('structured')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'structured'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Full Summary
          </button>
        </div>
      </div>

      {/* View 1: Domain Cards Grid */}
      {activeTab === 'domains' && (
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
      )}

      {/* View 2: Full Structured Policy Summary (matching sample test output) */}
      {activeTab === 'structured' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
              Operative Policy Executive Digest
            </span>
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-page-bg border border-border hover:border-primary/40 text-[11px] font-semibold text-text-secondary hover:text-primary transition-all"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary JSON</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {structuredSummaryEntries.map((entry) => (
              <div
                key={entry.key}
                className="p-3.5 rounded-xl bg-page-bg/60 border border-border/70 space-y-1"
              >
                <div className="text-[11px] font-extrabold text-primary uppercase tracking-wide">
                  {entry.label}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                  {entry.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletSummaryCard;
