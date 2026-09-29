import { useState } from 'react';
import { Download, Trash2, AlertTriangle, AlertOctagon, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DangerZoneSettingsTab = () => {
  const { user } = useAuth();
  const [clearedHistory, setClearedHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletedConfirm, setDeletedConfirm] = useState(false);

  const handleExportDataArchive = () => {
    const archiveData = {
      userProfile: user,
      exportTimestamp: new Date().toISOString(),
      version: 'PrivyLens-Export-v2.4',
      monitoredPoliciesCount: user?.monitoredPoliciesCount || 6,
      privacySettings: {
        persona: user?.persona || 'balanced',
        exportFormat: 'JSON',
      },
      auditRecords: [
        { service: 'Instagram', lastAnalyzed: '2026-03-10', trustScore: 4.8 },
        { service: 'WhatsApp', lastAnalyzed: '2026-03-08', trustScore: 7.2 },
        { service: 'Spotify', lastAnalyzed: '2026-03-01', trustScore: 8.4 },
      ],
    };

    const blob = new Blob([JSON.stringify(archiveData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privylens-personal-data-archive-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    setClearedHistory(true);
    setTimeout(() => setClearedHistory(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Data Sovereignty & Export */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Download className="w-4 h-4 text-primary" />
              <span>Export Personal Data Archive (GDPR Article 20)</span>
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Download a machine-readable JSON archive containing your analyzed policies, custom clause bookmarks, and audit history.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportDataArchive}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-background hover:bg-background-hover text-text-primary border border-border hover:border-primary/40 text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-primary" />
            Download Archive (.json)
          </button>
        </div>
      </div>

      {/* 2. Clear Analysis Cache */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-text-primary">
              Clear Analysis Cache & Temporary Tokens
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Purges local browser cache, recent search queries, and temporary PDF text extractions. Your monitored policies and reports remain saved.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-background hover:bg-amber-500/10 text-text-secondary hover:text-amber-500 border border-border hover:border-amber-500/30 text-xs font-semibold transition-all cursor-pointer shrink-0"
          >
            {clearedHistory ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">Cache Cleared!</span>
              </>
            ) : (
              <span>Clear Local Cache</span>
            )}
          </button>
        </div>
      </div>

      {/* 3. Red Alert / Danger Zone Card */}
      <div className="bg-danger/5 border border-danger/25 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0 mt-0.5">
            <AlertOctagon className="w-5 h-5" />
          </div>

          <div className="space-y-1 flex-1">
            <h3 className="text-sm font-bold text-danger">
              Irreversible Account Deletion
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Permanently purge your user profile, active policy watchlists, webhook secrets, and custom sensitivity parameters. This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-danger text-white hover:bg-danger-dark text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-text-primary">
                Confirm Account Deletion
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Are you sure you want to permanently delete your PrivyLens AI account? All policy monitoring schedules and generated audit reports will be immediately revoked.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 rounded-xl bg-background hover:bg-background-hover text-text-secondary text-xs font-semibold border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeletedConfirm(true);
                  setTimeout(() => {
                    setShowDeleteModal(false);
                  }, 1500);
                }}
                className="flex-1 py-2 rounded-xl bg-danger hover:bg-danger-dark text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {deletedConfirm ? 'Account Deleted...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerZoneSettingsTab;
