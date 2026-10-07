import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSearch,
  GitCompare,
  MessageSquare,
  Download,
  Share2,
  Check,
  Sparkles,
  Trash2,
  Loader2,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { deletePolicy } from '../../services/api';

const PolicyActionsBar = ({ policy, onOpenChat }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { openChatWithPolicy } = useChat();

  const handleChatClick = () => {
    openChatWithPolicy(policy.id);
    if (onOpenChat) onOpenChat();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeletePolicy = async () => {
    setDeleting(true);
    try {
      await deletePolicy(policy.id);
      navigate('/policies');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete policy.');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleExportPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      // Create a downloadable audit report
      const element = document.createElement('a');
      const file = new Blob(
        [
          `PrivyLens AI — Executive Privacy Report\nService: ${policy.name}\nTrust Score: ${policy.trustScore}/10\nRisk Profile: ${policy.riskLevel}\nAnalyzed: ${policy.lastAnalyzed}\n\nSummary:\n${policy.recommendation?.summary || 'Policy analyzed by PrivyLens AI engine.'}\n\nGenerated automatically via PrivyLens AI.`,
        ],
        { type: 'text/plain' }
      );
      element.href = URL.createObjectURL(file);
      element.download = `${policy.name.toLowerCase()}-privacy-report.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Quick Prompts */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-text-primary">Next Steps & Deep Dive</h4>
              <p className="text-[11px] text-text-secondary">
                Review specific legal quotes, compare previous terms, or chat with AI.
              </p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Detailed Clauses */}
            <Link
              to={`/policy/${policy.id}/details`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-sm hover:shadow-primary/20 transition-all duration-200 cursor-pointer"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>View All Clauses</span>
            </Link>

            {/* Compare Versions */}
            <Link
              to={`/policy/${policy.id}/compare`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-text-secondary bg-card-hover border border-border hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-pointer"
            >
              <GitCompare className="w-3.5 h-3.5 text-secondary" />
              <span>Compare Versions</span>
            </Link>

            {/* Ask AI Assistant */}
            <button
              type="button"
              onClick={handleChatClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-text-secondary bg-card-hover border border-border hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-accent" />
              <span>Ask AI</span>
            </button>

            {/* Export Report */}
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary bg-card-hover border border-border hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="Download report"
            >
              {downloading ? (
                <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-text-tertiary" />
              )}
              <span>Export</span>
            </button>

            {/* Share Link */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary bg-card-hover border border-border hover:border-primary/40 hover:text-primary transition-all duration-200 cursor-pointer"
              title="Copy shareable summary link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-text-tertiary" />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* Delete Policy */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary bg-card-hover border border-border hover:border-danger/40 hover:text-danger transition-all duration-200 cursor-pointer"
              title="Delete this policy"
            >
              <Trash2 className="w-3.5 h-3.5 text-text-tertiary hover:text-danger" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
              Are you sure you want to delete <span className="font-bold text-text-primary">"{policy.name}"</span>? All associated analyses, versions, and audit history will be permanently deleted.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-background-hover border border-border transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeletePolicy}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-danger hover:bg-danger/90 text-white transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
              >
                {deleting ? (
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
    </>
  );
};

export default PolicyActionsBar;
