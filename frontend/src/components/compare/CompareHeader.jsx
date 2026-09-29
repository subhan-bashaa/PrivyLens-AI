import { GitCompare, ArrowLeftRight, FileSearch, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const CompareHeader = ({
  policy,
  availablePolicies = [],
  selectedPolicyId,
  onSelectPolicy,
  versions = [],
  baseVersion,
  targetVersion,
  onSelectBaseVersion,
  onSelectTargetVersion,
  onSwapVersions,
}) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Service & Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
            <GitCompare className="w-5 h-5 text-info" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                Policy Version Comparison
              </h1>
              {/* Service switcher dropdown */}
              <div className="inline-flex items-center bg-background border border-border rounded-lg px-2.5 py-1">
                <span className="mr-1.5 text-sm">{policy.icon}</span>
                <select
                  value={selectedPolicyId}
                  onChange={(e) => onSelectPolicy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-text-primary focus:outline-hidden cursor-pointer"
                >
                  {availablePolicies.map((p) => (
                    <option key={p.id} value={p.id} className="bg-card text-text-primary">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Compare clause revisions, track score shifts, and identify new data collection clauses
            </p>
          </div>
        </div>

        {/* Right: Version Selectors & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Version Comparator Bar */}
          <div className="flex items-center gap-2 bg-background p-1.5 rounded-xl border border-border">
            {/* Base Version */}
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-wider pl-2">
                Base (Older)
              </span>
              <select
                value={baseVersion}
                onChange={(e) => onSelectBaseVersion(e.target.value)}
                className="bg-card text-xs font-semibold text-text-primary px-2.5 py-1.5 rounded-lg border border-border/80 focus:outline-hidden cursor-pointer"
              >
                {versions.map((v) => (
                  <option key={v.versionId} value={v.versionId}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={onSwapVersions}
              title="Swap versions"
              className="p-2 rounded-lg bg-card hover:bg-background-subtle text-text-tertiary hover:text-text-primary border border-border transition-colors cursor-pointer self-end mb-0.5"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>

            {/* Target Version */}
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-wider pl-2">
                Target (Newer)
              </span>
              <select
                value={targetVersion}
                onChange={(e) => onSelectTargetVersion(e.target.value)}
                className="bg-card text-xs font-semibold text-text-primary px-2.5 py-1.5 rounded-lg border border-border/80 focus:outline-hidden cursor-pointer"
              >
                {versions.map((v) => (
                  <option key={v.versionId} value={v.versionId}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick links to Summary / Details */}
          <div className="flex items-center gap-2">
            <Link
              to={`/policy/${policy.id}/summary`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-background hover:bg-background-hover text-text-secondary hover:text-text-primary border border-border hover:border-primary/30 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-primary" />
              Summary
            </Link>
            <Link
              to={`/policy/${policy.id}/details`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-background hover:bg-background-hover text-text-secondary hover:text-text-primary border border-border hover:border-primary/30 transition-all"
            >
              <FileSearch className="w-3.5 h-3.5 text-secondary" />
              Clauses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareHeader;
