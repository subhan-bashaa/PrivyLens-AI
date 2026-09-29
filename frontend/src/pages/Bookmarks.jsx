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

const INITIAL_BOOKMARKS = [
  {
    id: 'bm-1',
    policyId: 'whatsapp',
    policyName: 'WhatsApp',
    category: 'Data Sharing',
    clauseTitle: 'Metadata Sharing with Meta Companies',
    originalText:
      'We share information globally, both internally within the Meta Companies and externally with our partners and service providers for telemetry and ad optimization across affiliated networks.',
    explanation:
      'WhatsApp shares non-content metadata (who you message, when, device identifiers, IP address) with Meta platforms to cross-correlate ad profiles.',
    riskLevel: 'high',
    savedAt: '2026-03-08',
  },
  {
    id: 'bm-2',
    policyId: 'tiktok',
    policyName: 'TikTok',
    category: 'Biometrics & Telemetry',
    clauseTitle: 'Device Fingerprinting & Biometric Telemetry',
    originalText:
      'We may collect biometric identifiers and biometric information as defined under U.S. laws, such as faceprints and voiceprints, from your User Content.',
    explanation:
      'Aggressive automated biometric scanning extracts facial topography and audio frequency signatures from uploaded video clips.',
    riskLevel: 'high',
    savedAt: '2026-03-05',
  },
  {
    id: 'bm-3',
    policyId: 'spotify',
    policyName: 'Spotify',
    category: 'Third-Party Sharing',
    clauseTitle: 'Commercial Partner Audio Telemetry Sharing',
    originalText:
      'We share your streaming habits, listening timestamps, and podcast subscriptions with record labels, advertisers, and audio analytics partners.',
    explanation:
      'Your music taste, mood playlists, and playback frequencies are shared with third-party advertising vendors to build demographic profiles.',
    riskLevel: 'medium',
    savedAt: '2026-03-02',
  },
  {
    id: 'bm-4',
    policyId: 'chatgpt',
    policyName: 'OpenAI ChatGPT',
    category: 'Data Retention',
    clauseTitle: 'Model Retraining on Free-Tier Prompts',
    originalText:
      'When you use our Services, we may use your Content to train our models unless you opt out through your account data controls or the privacy request portal.',
    explanation:
      'Prompts and file uploads on default consumer accounts are ingested into future generative model training corpora unless explicitly disabled in settings.',
    riskLevel: 'medium',
    savedAt: '2026-02-28',
  },
  {
    id: 'bm-5',
    policyId: 'whatsapp',
    policyName: 'WhatsApp',
    category: 'User Rights',
    clauseTitle: 'Right to Data Deletion and Account Erase',
    originalText:
      'You may delete your WhatsApp account at any time. It may take up to 90 days from the beginning of the deletion process to delete your WhatsApp information from backup storage.',
    explanation:
      'Full purge from cold backups requires up to 90 calendar days. Log data retention may persist longer for statutory regulatory requirements.',
    riskLevel: 'low',
    savedAt: '2026-02-20',
  },
];

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState(INITIAL_BOOKMARKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  const handleDelete = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
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
