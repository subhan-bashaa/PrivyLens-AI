import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, FileQuestion, RotateCcw } from 'lucide-react';
import {
  getAvailableComparisonPolicies,
  getComparisonData,
} from '../data/mockVersions';
import {
  CompareHeader,
  CompareDeltaStats,
  CompareFilterBar,
  ClauseDiffCard,
  CompareHighlightsView,
} from '../components/compare';

const CompareVersions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Selected policy ID (default to 'instagram' if none in URL)
  const currentPolicyId = id || 'instagram';

  const availablePolicies = useMemo(() => getAvailableComparisonPolicies(), []);

  // Comparison dataset
  const [selectedBaseVersion, setSelectedBaseVersion] = useState(null);
  const [selectedTargetVersion, setSelectedTargetVersion] = useState(null);

  // View & filter state
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'unified' | 'highlights'
  const [changeTypeFilter, setChangeTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset version selections when switching policy
  useEffect(() => {
    setSelectedBaseVersion(null);
    setSelectedTargetVersion(null);
  }, [currentPolicyId]);

  // Load comparison data
  const comparison = useMemo(() => {
    return getComparisonData(
      currentPolicyId,
      selectedBaseVersion,
      selectedTargetVersion
    );
  }, [currentPolicyId, selectedBaseVersion, selectedTargetVersion]);

  // Handle service switch
  const handleSelectPolicy = useCallback(
    (newPolicyId) => {
      navigate(`/policy/${newPolicyId}/compare`);
    },
    [navigate]
  );

  // Handle version swap
  const handleSwapVersions = useCallback(() => {
    setSelectedBaseVersion(comparison.targetVersion);
    setSelectedTargetVersion(comparison.baseVersion);
  }, [comparison.baseVersion, comparison.targetVersion]);

  // Filtered clauses
  const filteredClauses = useMemo(() => {
    if (!comparison.clauses) return [];

    return comparison.clauses.filter((clause) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = clause.title.toLowerCase().includes(q);
        const matchesSection = clause.section.toLowerCase().includes(q);
        const matchesAI = clause.aiInterpretation.toLowerCase().includes(q);
        const matchesOld = clause.oldText?.toLowerCase().includes(q);
        const matchesNew = clause.newText?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSection && !matchesAI && !matchesOld && !matchesNew) {
          return false;
        }
      }

      // 2. Change type filter
      if (changeTypeFilter !== 'all' && clause.changeType !== changeTypeFilter) {
        return false;
      }

      // 3. Severity filter
      if (severityFilter !== 'all' && clause.severity !== severityFilter) {
        return false;
      }

      return true;
    });
  }, [comparison.clauses, searchQuery, changeTypeFilter, severityFilter]);

  const baseLabel =
    comparison.versions?.find((v) => v.versionId === comparison.baseVersion)
      ?.label || comparison.baseVersion;
  const targetLabel =
    comparison.versions?.find((v) => v.versionId === comparison.targetVersion)
      ?.label || comparison.targetVersion;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/policy/${comparison.policy.id}/summary`}
          className="hover:text-primary transition-colors"
        >
          {comparison.policy.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-bold">Compare Versions</span>
      </nav>

      {/* 1. Compare Header */}
      <CompareHeader
        policy={comparison.policy}
        availablePolicies={availablePolicies}
        selectedPolicyId={currentPolicyId}
        onSelectPolicy={handleSelectPolicy}
        versions={comparison.versions}
        baseVersion={comparison.baseVersion}
        targetVersion={comparison.targetVersion}
        onSelectBaseVersion={setSelectedBaseVersion}
        onSelectTargetVersion={setSelectedTargetVersion}
        onSwapVersions={handleSwapVersions}
      />

      {/* 2. Delta KPI Stats */}
      <CompareDeltaStats
        scoreShift={comparison.scoreShift}
        stats={comparison.stats}
        overallSeverity={comparison.overallSeverity}
      />

      {/* 3. Controls & Filter Bar */}
      <CompareFilterBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        changeType={changeTypeFilter}
        onChangeTypeChange={setChangeTypeFilter}
        severity={severityFilter}
        onSeverityChange={setSeverityFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredCount={filteredClauses.length}
        totalCount={comparison.clauses?.length || 0}
      />

      {/* 4. Main Body: Highlights View vs. Clause Diff Cards */}
      {viewMode === 'highlights' ? (
        <CompareHighlightsView
          executiveSummary={comparison.executiveSummary}
          keyTakeaways={comparison.keyTakeaways}
          recommendedActions={comparison.recommendedActions}
          onSwitchToDiffs={() => setViewMode('split')}
        />
      ) : filteredClauses.length > 0 ? (
        <div className="space-y-4">
          {filteredClauses.map((clause) => (
            <ClauseDiffCard
              key={clause.clauseId}
              clause={clause}
              viewMode={viewMode}
              baseVersionLabel={baseLabel}
              targetVersionLabel={targetLabel}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-background-subtle border border-border flex items-center justify-center mx-auto mb-3 text-text-tertiary">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary mb-1">
            No clauses match your filter
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
            Try adjusting your search terms, changing the modification type, or resetting filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setChangeTypeFilter('all');
              setSeverityFilter('all');
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-background hover:bg-background-hover border border-border text-text-primary transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-primary" />
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CompareVersions;
