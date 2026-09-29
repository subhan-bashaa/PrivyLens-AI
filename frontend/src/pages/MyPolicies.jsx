import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Shield,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ExternalLink,
  SlidersHorizontal,
  GitCompare,
} from 'lucide-react';
import { MOCK_POLICIES } from '../data/mockPolicies';

const CATEGORIES = ['All', 'Messaging & Social', 'Music & Media', 'AI & Assistants', 'Productivity'];

const MyPolicies = () => {
  const [policies, setPolicies] = useState(MOCK_POLICIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');

  // Toggle monitoring status
  const handleToggleMonitoring = (id) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, monitoringActive: !p.monitoringActive } : p))
    );
  };

  // Filter policies
  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || p.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesRisk = selectedRisk === 'All' || p.riskLevel.toLowerCase() === selectedRisk.toLowerCase();

    return matchesSearch && matchesCategory && matchesRisk;
  });

  const totalMonitored = policies.filter((p) => p.monitoringActive).length;
  const highRiskCount = policies.filter((p) => p.riskLevel.toLowerCase() === 'high').length;
  const avgScore = (policies.reduce((sum, p) => sum + p.trustScore, 0) / policies.length).toFixed(1);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-primary" />
            My Policies
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Browse, manage, and monitor the privacy policies in your active intelligence portfolio.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Analyze New Policy
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Total Saved</div>
          <div className="text-2xl font-black text-text-primary mt-1">{policies.length}</div>
          <div className="text-[11px] text-text-secondary mt-0.5">Policies analyzed</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Live Monitoring</div>
          <div className="text-2xl font-black text-primary mt-1">{totalMonitored}</div>
          <div className="text-[11px] text-text-secondary mt-0.5">Automated diff checks</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">High Risk Flags</div>
          <div className="text-2xl font-black text-danger mt-1">{highRiskCount}</div>
          <div className="text-[11px] text-text-secondary mt-0.5">Requires user action</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Average Trust</div>
          <div className="text-2xl font-black text-secondary mt-1">{avgScore} <span className="text-xs font-normal text-text-tertiary">/10</span></div>
          <div className="text-[11px] text-text-secondary mt-0.5">Portfolio hygiene</div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by company, service, or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-background border border-border text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-primary/50"
            />
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-text-tertiary" />
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-background border border-border text-text-primary focus:outline-hidden focus:border-primary/50 cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk (Safe)</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-border/60">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'bg-background hover:bg-background-hover text-text-secondary border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">No matching policies found</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Try adjusting your search query or reset the category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPolicies.map((policy) => {
            const isHigh = policy.riskLevel.toLowerCase() === 'high';
            const isLow = policy.riskLevel.toLowerCase() === 'low';

            return (
              <div
                key={policy.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Row: Category & Risk Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider truncate">
                      {policy.category}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-danger/10 text-danger border-danger/20'
                          : isLow
                          ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-warning/10 text-warning border-warning/20'
                      }`}
                    >
                      {policy.riskLevel} Risk
                    </span>
                  </div>

                  {/* Policy Name & URL */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                        {policy.name}
                      </h3>
                      <a
                        href={policy.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-text-tertiary hover:text-primary transition-colors flex items-center gap-1 mt-0.5 truncate max-w-[200px]"
                      >
                        <span className="truncate">{policy.url.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    </div>

                    {/* Trust Score Box */}
                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-text-primary">
                        {policy.trustScore.toFixed(1)}
                        <span className="text-[10px] text-text-tertiary font-normal">/10</span>
                      </div>
                      <span className="text-[9px] text-text-tertiary font-bold uppercase">Score</span>
                    </div>
                  </div>

                  {/* Recommendation pill */}
                  <div className="p-2.5 rounded-xl bg-background border border-border text-xs text-text-secondary mb-4 leading-relaxed line-clamp-2">
                    {policy.recommendation?.summary || 'Standard data handling and account parameters.'}
                  </div>

                  {/* Monitored Status Switch */}
                  <div className="flex items-center justify-between text-xs py-2 border-t border-border/60 mb-4">
                    <span className="text-text-tertiary font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Analyzed {policy.lastAnalyzed}
                    </span>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-[11px] font-bold text-text-secondary">
                        {policy.monitoringActive ? 'Monitored' : 'Muted'}
                      </span>
                      <input
                        type="checkbox"
                        checked={policy.monitoringActive}
                        onChange={() => handleToggleMonitoring(policy.id)}
                        className="w-3.5 h-3.5 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/80">
                  <Link
                    to={`/policy/${policy.id}/summary`}
                    className="py-2 px-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-center text-xs font-bold transition-all truncate cursor-pointer"
                  >
                    Summary
                  </Link>
                  <Link
                    to={`/policy/${policy.id}/details`}
                    className="py-2 px-2 rounded-xl bg-background hover:bg-background-hover border border-border text-text-primary text-center text-xs font-semibold transition-all truncate cursor-pointer"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/policy/${policy.id}/compare`}
                    className="py-2 px-2 rounded-xl bg-background hover:bg-background-hover border border-border text-text-primary text-center text-xs font-semibold transition-all flex items-center justify-center gap-1 truncate cursor-pointer"
                  >
                    <GitCompare className="w-3 h-3" />
                    Diff
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPolicies;
