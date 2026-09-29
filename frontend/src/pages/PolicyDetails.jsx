import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getPolicyById } from '../data/mockPolicies';
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
  const { id = 'whatsapp' } = useParams();
  const policy = getPolicyById(id);

  // Filter & sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('severity');

  const clauses = policy.clauses || [];

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
