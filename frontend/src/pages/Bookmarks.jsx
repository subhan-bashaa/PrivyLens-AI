import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bookmark,
  Search,
  Trash2,
  ExternalLink,
  ArrowRight,
  Shield,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles,
  Download,
  Share2,
  Tag,
} from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('privylens_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  const handleDelete = (id) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem('privylens_bookmarks', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
    setToastMessage('Bookmark removed');
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookmarks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'privylens_saved_bookmarks.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToastMessage('Bookmarks exported to JSON');
    setTimeout(() => setToastMessage(''), 2500);
  };

  const filtered = bookmarks.filter((b) => {
    const matchesSearch =
      b.policyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clauseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.explanation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = selectedRisk === 'All' || b.riskLevel.toLowerCase() === selectedRisk.toLowerCase();

    return matchesSearch && matchesRisk;
  });

  const highRiskCount = bookmarks.filter((b) => b.riskLevel === 'high').length;
  const mediumRiskCount = bookmarks.filter((b) => b.riskLevel === 'medium').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-primary" />
            Saved Clauses & Bookmarks
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Review and reference flagged legal clauses and critical privacy provisions you have pinned.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {toastMessage && (
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl animate-fade-in">
              ✓ {toastMessage}
            </span>
          )}

          <button
            type="button"
            onClick={handleExport}
            disabled={bookmarks.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-background hover:bg-background-hover border border-border text-text-primary text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-text-tertiary" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Total Bookmarks</div>
          <div className="text-2xl font-black text-text-primary mt-1">{bookmarks.length}</div>
          <div className="text-[11px] text-text-secondary mt-0.5">Saved legal clauses</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Critical Red Flags</div>
          <div className="text-2xl font-black text-danger mt-1">{highRiskCount}</div>
          <div className="text-[11px] text-text-secondary mt-0.5">High severity provisions</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Medium Risks</div>
          <div className="text-2xl font-black text-warning mt-1">{mediumRiskCount}</div>
          <div className="text-[11px] text-text-secondary mt-0.5">Discretionary terms</div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Monitored Policies</div>
          <div className="text-2xl font-black text-primary mt-1">4</div>
          <div className="text-[11px] text-text-secondary mt-0.5">Covered by bookmarks</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search within clause text, title, or policy name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-background border border-border text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-primary/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary font-medium">Risk:</span>
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-background border border-border text-text-primary focus:outline-hidden focus:border-primary/50 cursor-pointer"
          >
            <option value="All">All Risk Severities</option>
            <option value="high">High Risk Flags</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Bookmarks List */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">No bookmarks match your search</h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            You can bookmark specific clauses when inspecting any policy details page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isHigh = item.riskLevel === 'high';
            const isMedium = item.riskLevel === 'medium';

            return (
              <div
                key={item.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-all space-y-3.5 group"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold text-xs">
                      {item.policyName}
                    </span>
                    <span className="text-xs text-text-tertiary flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {item.category}
                    </span>
                    <span className="text-[11px] text-text-tertiary">• Saved {item.savedAt}</span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-danger/10 text-danger border-danger/20'
                          : isMedium
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}
                    >
                      {item.riskLevel.toUpperCase()} RISK
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      title="Remove bookmark"
                      className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Clause Title */}
                <h3 className="text-sm font-bold text-text-primary">
                  {item.clauseTitle}
                </h3>

                {/* Verbatim Excerpt */}
                <div className="p-3.5 rounded-xl bg-background border-l-4 border-l-primary/70 border border-border text-xs text-text-secondary font-mono leading-relaxed">
                  "{item.originalText}"
                </div>

                {/* Plain English AI Takeaway */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2.5 text-xs text-text-primary">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-primary">Plain-English Translation: </span>
                    <span className="text-text-secondary leading-relaxed">{item.explanation}</span>
                  </div>
                </div>

                {/* Action Link */}
                <div className="flex justify-end pt-1">
                  <Link
                    to={`/policy/${item.policyId}/details`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark hover:underline cursor-pointer"
                  >
                    <span>View Clause in Full Document Inspector</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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

export default Bookmarks;
