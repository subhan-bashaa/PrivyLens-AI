import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import { getPolicy } from '../services/api';
import {
  PolicyDetailsHeader,
  ClauseStatsSummary,
  ComplianceDashboard,
  ClauseFilterBar,
  ClauseCard,
  DetailedRedFlagsSection,
  DetailedPositivesSection,
} from '../components/policy-details';

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

const PolicyDetails = () => {
  const { id } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const res = await getPolicy(id);
        const p = res?.data?.policy;
        if (!p) {
          setError('Policy details not found.');
          setLoading(false);
          return;
        }

        const catScores = p.category_scores || {};
        const evidence = p.evidence_records || [];

        // Build clauses from real evidence records
        const clausesList = evidence.map((ev, i) => ({
          clauseId: `cl-${i + 1}`,
          title: ev.category ? `${ev.category} Clause` : `Section ${i + 1}`,
          section: ev.source_section || `Section ${i + 1}`,
          severity: ev.confidence > 0.85 ? 'high' : ev.confidence > 0.6 ? 'medium' : 'low',
          category: ev.category || 'Data Protection',
          originalText: ev.quote || ev.text || '',
          aiInterpretation: ev.context || 'Audited against DPDP Act 2023 & NIST Framework standards.',
          impactDescription: 'Identified by PrivyLens deterministic fact extraction engine.',
        }));

        // If no evidence records stored, generate clauses from red flags & positive findings
        if (clausesList.length === 0) {
          (p.red_flags || []).forEach((rf, i) => {
            const text = typeof rf === 'string' ? rf : rf.text;
            clausesList.push({
              clauseId: `rf-cl-${i + 1}`,
              title: 'Risk Clause Alert',
              section: `Risk Finding #${i + 1}`,
              severity: 'high',
              category: 'Risk Indicator',
              originalText: text,
              aiInterpretation: 'Flagged potential risk factor.',
              impactDescription: 'Exceeds standard risk tolerance baseline.',
            });
          });
        }

        const viewPolicy = {
          id: p.id,
          name: p.title || 'Audited Policy',
          url: p.policy_url || p.website_url || '#',
          trustScore: parseFloat(p.overall_score) || 0.0,
          riskLevel: p.risk_level || 'Moderate',
          summary: p.summary,
          lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Recent',
          clauses: clausesList,
          redFlags: (p.red_flags || []).map((rf, i) =>
            typeof rf === 'string' ? { id: `rf-${i}`, text: rf, severity: 'high' } : rf
          ),
          positiveFindings: (p.positive_findings || []).map((pf, i) =>
            typeof pf === 'string' ? { id: `pf-${i}`, text: pf } : pf
          ),
          complianceSummary: {
            dpdp: catScores.user_rights?.score >= 6.0 ? 'Compliant' : 'Needs Review',
            gdpr: catScores.security_encryption?.score >= 6.5 ? 'Compliant' : 'Needs Review',
            nist: catScores.data_collection?.score >= 6.0 ? 'Tier 3' : 'Tier 2',
          },
        };
        setPolicy(viewPolicy);
      } catch (err) {
        setError(err?.response?.data?.message || 'Error loading policy details.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [id]);

  // Filter & sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('severity');

  const clauses = policy?.clauses || [];

  // Filtered & sorted clauses
  const filteredClauses = useMemo(() => {
    let result = [...clauses];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.section.toLowerCase().includes(term) ||
          c.aiInterpretation.toLowerCase().includes(term) ||
          c.originalText.toLowerCase().includes(term) ||
          c.impactDescription.toLowerCase().includes(term)
      );
    }

    // Severity filter
    if (severityFilter !== 'all') {
      result = result.filter((c) => c.severity === severityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter((c) => c.category === categoryFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'severity') {
        return (
          (SEVERITY_ORDER[a.severity] ?? 99) - (SEVERITY_ORDER[b.severity] ?? 99)
        );
      }
      if (sortBy === 'section') {
        return a.section.localeCompare(b.section);
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return result;
  }, [clauses, searchTerm, severityFilter, categoryFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">Loading Detailed Clause Audit...</p>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Policy Not Found</h2>
        <p className="text-xs text-text-secondary">{error || 'This policy audit does not exist in your repository.'}</p>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all"
        >
          Analyze a New Policy
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/policy/${policy.id}/summary`}
          className="hover:text-primary transition-colors"
        >
          {policy.name} Summary
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-bold">Detailed Analysis</span>
      </nav>

      {/* 1. Policy Details Header */}
      <PolicyDetailsHeader policy={policy} />

      {/* 2. Clause Stats Summary */}
      <ClauseStatsSummary clauses={clauses} trustScore={policy.trustScore} />

      {/* 3. Compliance Dashboard */}
      <ComplianceDashboard complianceSummary={policy.complianceSummary} />

      {/* 4. Filter Bar */}
      <ClauseFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        filteredCount={filteredClauses.length}
        totalCount={clauses.length}
      />

      {/* 5. Clause Cards List */}
      <div className="space-y-4">
        {filteredClauses.length > 0 ? (
          filteredClauses.map((clause, idx) => (
            <ClauseCard
              key={clause.clauseId}
              clause={clause}
              index={idx}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <p className="text-sm text-text-tertiary font-medium">
              No clauses match your current filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSeverityFilter('all');
                setCategoryFilter('all');
              }}
              className="mt-2 text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* 6. Red Flags & Positive Findings — Two-Column on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailedRedFlagsSection redFlags={policy.redFlags} />
        <DetailedPositivesSection positiveFindings={policy.positiveFindings} />
      </div>
    </div>
  );
};

export default PolicyDetails;
