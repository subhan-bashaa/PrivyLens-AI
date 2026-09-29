import { useState } from 'react';
import { KeyRound, Eye, EyeOff, Copy, Check, RefreshCw, Puzzle, ExternalLink } from 'lucide-react';

const ApiKeysSettingsTab = () => {
  const [apiKey, setApiKey] = useState('pl_live_9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [regenToast, setRegenToast] = useState(false);

  const [extensionToken] = useState('ext_pair_77a9c12b');
  const [copiedToken, setCopiedToken] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard?.writeText(extensionToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleRegenerate = () => {
    const newKey = `pl_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    setApiKey(newKey);
    setRegenToast(true);
    setTimeout(() => setRegenToast(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Production API Key */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" />
              <span>PrivyLens Developer API Secret</span>
            </h3>
            <p className="text-xs text-text-secondary">
              Authenticate requests to the policy analysis engine, risk score APIs, and diff engine
            </p>
          </div>

          {regenToast && (
            <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Key Regenerated!
            </span>
          )}
        </div>

        {/* Secret Key Input Box */}
        <div className="flex items-center gap-2 bg-background p-2 rounded-xl border border-border">
          <input
            type={showKey ? 'text' : 'password'}
            readOnly
            value={apiKey}
            className="flex-1 bg-transparent px-2 text-xs font-mono text-text-primary focus:outline-hidden"
          />

          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            title={showKey ? 'Hide key' : 'Show key'}
            className="p-1.5 rounded-lg hover:bg-card text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleCopyKey}
            title="Copy API key"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-background-hover text-text-primary border border-border text-xs font-semibold transition-all cursor-pointer"
          >
            {copiedKey ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-text-tertiary" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Regenerate Action */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-text-tertiary">
            Keep your key secret. Do not expose it in browser client-side code.
          </span>
          <button
            type="button"
            onClick={handleRegenerate}
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-danger text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate Secret
          </button>
        </div>
      </div>

      {/* 2. Monthly Usage Quota Bar */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-text-primary">
            Monthly API Quota Utilization
          </h3>
          <span className="text-xs font-bold text-primary font-mono">
            4,280 / 10,000 (42.8%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-background rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: '42.8%' }}
          />
        </div>

        <p className="text-[11px] text-text-tertiary">
          Resets on the 1st of every month. Includes URL scraping, NLP clause extraction, and telemetry calls.
        </p>
      </div>

      {/* 3. Chrome Extension Pairing Token */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-secondary" />
            <span>PrivyLens Chrome Extension Pairing Token</span>
          </h3>
          <p className="text-xs text-text-secondary">
            Pair your desktop browser extension to automatically sync inspected web policies into your dashboard
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 bg-background p-3 rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold font-mono text-text-primary">
              {extensionToken}
            </span>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold ml-1">
              Active Sync
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyToken}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card hover:bg-background-hover border border-border text-xs font-semibold text-text-primary transition-colors cursor-pointer"
          >
            {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedToken ? 'Copied' : 'Copy Token'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeysSettingsTab;
