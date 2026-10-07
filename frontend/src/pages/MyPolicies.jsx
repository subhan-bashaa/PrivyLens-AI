import { useState, useEffect } from 'react';
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
  Loader2,
  Sparkles,
  Globe,
  Trash2,
} from 'lucide-react';
import { getPolicies, enableMonitoring, disableMonitoring, deletePolicy } from '../services/api';

const CATEGORIES = ['All', 'Web Service', 'PDF Document', 'General'];

const MyPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [policyToDelete, setPolicyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteToast, setDeleteToast] = useState(null);

  useEffect(() => {
    const fetchUserPolicies = async () => {
      setLoading(true);
      try {
        const res = await getPolicies();
        const raw = res?.data?.policies || [];
        const formatted = raw.map((p) => {
          const score = parseFloat(p.overall_score) || 0.0;
          return {
            id: p.id,
            name: p.title || 'Audited Web Policy',
            category: p.source_type === 'pdf' ? 'PDF Document' : 'Web Service',
            url: p.policy_url || p.website_url || '#',
            trustScore: score,
            riskLevel: p.risk_level || (score >= 7 ? 'Low' : score >= 4 ? 'Moderate' : 'High'),
            monitoringActive: Boolean(p.monitoring_enabled),
            lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Recent',
            version: p.version_number ? `v${p.version_number}.0` : 'v1.0',
            summary: p.summary || 'Privacy audit completed.',
          };
        });
        setPolicies(formatted);
      } catch (err) {
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPolicies();
  }, []);

  // Handle Policy Deletion
  const handleConfirmDelete = async () => {
    if (!policyToDelete) return;
    setIsDeleting(true);
    try {
      await deletePolicy(policyToDelete.id);
      setPolicies((prev) => prev.filter((p) => p.id !== policyToDelete.id));
      setDeleteToast({
        type: 'success',
        message: `"${policyToDelete.name}" was successfully deleted.`,
      });
      setPolicyToDelete(null);
    } catch (err) {
      setDeleteToast({
        type: 'error',
        message: err?.response?.data?.message || 'Failed to delete policy. Please try again.',
      });
    } finally {
      setIsDeleting(false);
      setTimeout(() => setDeleteToast(null), 4000);
    }
  };

  // Toggle monitoring status via backend API
  const handleToggleMonitoring = async (id) => {
    const target = policies.find((p) => p.id === id);
    if (!target) return;
    const newState = !target.monitoringActive;

    // Optimistic UI update
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, monitoringActive: newState } : p))
    );

    try {
      if (newState) {
        await enableMonitoring(id);
      } else {
        await disableMonitoring(id);
      }
    } catch (err) {
      // Revert if error
      setPolicies((prev) =>
        prev.map((p) => (p.id === id ? { ...p, monitoringActive: !newState } : p))
      );
    }
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
  const avgScore =
    policies.length > 0
      ? (policies.reduce((sum, p) => sum + p.trustScore, 0) / policies.length).toFixed(1)
      : '--';

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

      {/* Delete/Action Toast Alert */}
      {deleteToast && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold animate-slide-up shadow-md ${
            deleteToast.type === 'error'
              ? 'bg-danger/10 border-danger/30 text-danger'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
          }`}
        >
          <div className="flex items-center gap-2">
            {deleteToast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            <span>{deleteToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setDeleteToast(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

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
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-text-secondary">Loading your audited policies...</p>
        </div>
      ) : filteredPolicies.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">No policies in your portfolio yet</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Analyze a website URL, upload a PDF policy, or browse web pages with the PrivyLens Chrome Extension.
          </p>
          <div className="pt-2">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all"
            >
              <Plus className="w-4 h-4" />
              Analyze First Policy
            </Link>
          </div>
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
                  {/* Top Row: Category, Risk Badge & Delete Action */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider truncate">
                      {policy.category}
                    </span>

                    <div className="flex items-center gap-2">
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

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPolicyToDelete(policy);
                        }}
                        title="Delete policy"
                        className="p-1 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                        aria-label="Delete policy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
                    {policy.summary || 'Standard data handling and account parameters.'}
                  </div>

                  {/* Monitored Status Switch */}
                  <div className="flex items-center justify-between text-xs py-2 border-t border-border/60 mb-4">
                    <span className="text-text-tertiary font-medium flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Analyzed {policy.lastUpdated}
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

      {/* Delete Confirmation Modal */}
      {policyToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">Delete Policy</h3>
                <p className="text-xs text-text-secondary mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-bold text-text-primary">"{policyToDelete.name}"</span>? All
              associated versions, risk analyses, and audit records will be permanently removed.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setPolicyToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-background-hover border border-border transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-danger hover:bg-danger/90 text-white transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Policy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPolicies;
