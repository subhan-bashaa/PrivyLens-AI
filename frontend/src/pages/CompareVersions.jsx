import { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, FileQuestion, RotateCcw, Loader2, GitCompare, Sparkles } from 'lucide-react';
import { getVersions, compareVersions, getPolicies } from '../services/api';
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

  const [availablePolicies, setAvailablePolicies] = useState([]);
  const [currentPolicyId, setCurrentPolicyId] = useState(id || '');
  const [versions, setVersions] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedBaseVersion, setSelectedBaseVersion] = useState(null);
  const [selectedTargetVersion, setSelectedTargetVersion] = useState(null);

  // View & filter state
  const [viewMode, setViewMode] = useState('split');
  const [changeTypeFilter, setChangeTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync id param to state
  useEffect(() => {
    if (id && id !== currentPolicyId) {
      setCurrentPolicyId(id);
      setSelectedBaseVersion(null);
      setSelectedTargetVersion(null);
    }
  }, [id]);

  // 1. Load user policies on mount
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const res = await getPolicies();
        const pList = (res?.data?.policies || []).map((p) => ({
          id: p.id,
          name: p.title || 'Audited Web Policy',
          icon: '📄',
        }));

        setAvailablePolicies(pList);

        if (!currentPolicyId && pList.length > 0) {
          setCurrentPolicyId(id || pList[0].id);
        }
      } catch (e) {
        setAvailablePolicies([]);
      } finally {
        if (!id && !currentPolicyId) {
          setLoading(false);
        }
      }
    };
    loadPolicies();
  }, [id, currentPolicyId]);

  // 2. Load policy versions and run compare
  useEffect(() => {
    if (!currentPolicyId) {
      setLoading(false);
      return;
    }

    const loadDiff = async () => {
      setLoading(true);
      setError('');
      try {
        const vRes = await getVersions(currentPolicyId);
        const vList = vRes?.data?.versions || [];
        setVersions(vList);

        if (vList.length < 2) {
          setError(
            vList.length === 1
              ? 'This policy currently has 1 recorded revision (v1.0). Version diffs and risk deltas become available once revisions are detected.'
              : 'No recorded revisions found for this policy.'
          );
          setComparison(null);
          setLoading(false);
          return;
        }

        const cmpRes = await compareVersions(currentPolicyId, selectedBaseVersion, selectedTargetVersion);
        const diffData = cmpRes?.data;
        if (diffData) {
          const diffList = (diffData.addedClauses || []).map((c, i) => ({
            clauseId: `add-${i}`,
            title: 'Added Privacy Term',
            changeType: 'added',
            severity: 'medium',
            category: 'Updated Policy Clause',
            baseText: '',
            targetText: c,
            oldText: '',
            newText: c,
            aiAnalysis: 'Clause detected in updated revision.',
            aiInterpretation: 'Clause detected in updated revision.',
          }));

          const vObjList = vList.map((v) => ({
            versionId: String(v.version_number),
            label: `v${v.version_number}.0 (${new Date(v.created_at).toLocaleDateString()})`,
          }));

          setComparison({
            serviceName: diffData.policyTitle || 'Audited Policy',
            policyId: currentPolicyId,
            policy: { id: currentPolicyId, name: diffData.policyTitle || 'Audited Policy', icon: '📄' },
            versions: vObjList,
            baseVersion: String(diffData.versionFrom?.version_number || 1),
            targetVersion: String(diffData.versionTo?.version_number || 2),
            baseDate: diffData.versionFrom?.created_at ? new Date(diffData.versionFrom.created_at).toLocaleDateString() : 'Baseline',
            targetDate: diffData.versionTo?.created_at ? new Date(diffData.versionTo.created_at).toLocaleDateString() : 'Revision',
            scoreShift: {
              delta: diffData.netRiskDelta || 0.0,
              direction: (diffData.netRiskDelta || 0) > 0 ? 'worse' : 'better',
            },
            stats: {
              totalChanges: diffList.length,
              added: diffList.length,
              removed: 0,
              modified: 0,
              unchanged: 0,
            },
            overallSeverity: (diffData.netRiskDelta || 0) > 1 ? 'high' : 'medium',
            diffClauses: diffList,
            clauses: diffList,
            executiveSummary: 'Automated policy diffing completed by PrivyLens AI.',
            keyTakeaways: ['Revisions evaluated against statutory rules.'],
            recommendedActions: ['Review highlighted clause additions.'],
          });
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Policy does not have multiple revisions yet.');
        setComparison(null);
      } finally {
        setLoading(false);
      }
    };

    loadDiff();
  }, [currentPolicyId, selectedBaseVersion, selectedTargetVersion]);

  // Handle service switch
  const handleSelectPolicy = useCallback(
    (newPolicyId) => {
      setCurrentPolicyId(newPolicyId);
      setSelectedBaseVersion(null);
      setSelectedTargetVersion(null);
      navigate(`/policy/${newPolicyId}/compare`);
    },
    [navigate]
  );

  // Handle version swap
  const handleSwapVersions = useCallback(() => {
    if (!comparison) return;
    setSelectedBaseVersion(comparison.targetVersion);
    setSelectedTargetVersion(comparison.baseVersion);
  }, [comparison]);

  // Filtered clauses
  const filteredClauses = useMemo(() => {
    if (!comparison?.diffClauses) return [];

    return comparison.diffClauses.filter((clause) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = clause.title?.toLowerCase().includes(q);
        const matchesText = clause.targetText?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesText) return false;
      }
      if (changeTypeFilter !== 'all' && clause.changeType !== changeTypeFilter) return false;
      if (severityFilter !== 'all' && clause.severity !== severityFilter) return false;
      return true;
    });
  }, [comparison, searchQuery, changeTypeFilter, severityFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">Comparing Policy Revisions...</p>
      </div>
    );
  }

  if (!currentPolicyId && availablePolicies.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <GitCompare className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">No Analyzed Policies to Compare</h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          Analyze a privacy policy first to start tracking versions and comparing clause changes.
        </p>
        <div className="pt-2">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Policy Now
          </Link>
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Policy Version Comparison</h2>
        <p className="text-xs text-text-secondary leading-relaxed">
          {error || 'This policy does not have multiple revisions yet. Our background cron job checks monitored domains every 6 hours and computes risk diffs when updates occur.'}
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Link
            to="/policies"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all"
          >
            Back to My Policies
          </Link>
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-text-primary text-xs font-bold hover:bg-background-hover transition-all"
          >
            Analyze Another Revision
          </Link>
        </div>
      </div>
    );
  }

  const baseLabel =
    comparison?.versions?.find((v) => v.versionId === comparison.baseVersion)?.label ||
    `v${comparison?.baseVersion || 1}.0`;

  const targetLabel =
    comparison?.versions?.find((v) => v.versionId === comparison.targetVersion)?.label ||
    `v${comparison?.targetVersion || 2}.0`;

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/policy/${currentPolicyId}/summary`}
          className="hover:text-primary transition-colors"
        >
          {comparison.serviceName}
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
