import { useState } from 'react';
import { Bell, Mail, Send, Check, Radio, Volume2, Globe } from 'lucide-react';

const EMAIL_OPTIONS = [
  { id: 'instant', label: 'Instant Alerts', desc: 'Receive immediate email whenever a monitored policy triggers a Critical change' },
  { id: 'daily', label: 'Daily Intelligence Digest', desc: 'A consolidated summary sent each morning at 08:00 AM' },
  { id: 'weekly', label: 'Weekly Privacy Brief', desc: 'Sent every Monday summarizing score shifts across your monitored apps' },
  { id: 'off', label: 'Disabled', desc: 'No email notifications; in-app notification center only' },
];

const NotificationSettingsTab = () => {
  const [emailFrequency, setEmailFrequency] = useState('instant');
  const [inAppSound, setInAppSound] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T000/B000/XXXX');
  const [testSent, setTestSent] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const handleTestWebhook = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
      {/* 1. Email Notifications */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Email Alerts & Digest Frequency
          </h3>
          <p className="text-xs text-text-secondary">
            Choose how frequently you receive policy alerts to your registered inbox
          </p>
        </div>

        <div className="space-y-2.5">
          {EMAIL_OPTIONS.map((opt) => {
            const isSelected = emailFrequency === opt.id;
            return (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border bg-background hover:bg-background-hover'
                }`}
              >
                <input
                  type="radio"
                  name="emailFrequency"
                  checked={isSelected}
                  onChange={() => setEmailFrequency(opt.id)}
                  className="mt-1 text-primary focus:ring-primary/20"
                />
                <div className="flex-1">
                  <div className="text-xs font-bold text-text-primary">
                    {opt.label}
                  </div>
                  <div className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                    {opt.desc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. In-App & Browser Notifications */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            In-App & Browser Push Notifications
          </h3>
          <p className="text-xs text-text-secondary">
            Manage alerts inside the PrivyLens web dashboard and browser notifications
          </p>
        </div>

        <div className="space-y-3 bg-background p-4 rounded-xl border border-border">
          <label className="flex items-center justify-between gap-3 text-xs text-text-secondary cursor-pointer hover:text-text-primary">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-text-tertiary" />
              <span>Play subtle audio chime on new critical change notification</span>
            </div>
            <input
              type="checkbox"
              checked={inAppSound}
              onChange={() => setInAppSound(!inAppSound)}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-xs text-text-secondary cursor-pointer hover:text-text-primary pt-3 border-t border-border/60">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-text-tertiary" />
              <span>Enable Browser Native Push Notifications</span>
            </div>
            <input
              type="checkbox"
              checked={pushEnabled}
              onChange={() => setPushEnabled(!pushEnabled)}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
          </label>
        </div>
      </div>

      {/* 3. Webhook Integration (Slack / Discord / Custom) */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>Webhook Alert Dispatch (Slack / Discord / Custom)</span>
          </h3>
          <p className="text-xs text-text-secondary">
            PrivyLens AI sends a JSON payload whenever monitored policies trigger severity alerts
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="flex-1 px-3.5 py-2 text-xs bg-background border border-border rounded-xl text-text-primary font-mono focus:outline-hidden focus:border-primary/50"
          />

          <button
            type="button"
            onClick={handleTestWebhook}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-background hover:bg-background-hover border border-border text-text-primary text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            {testSent ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">Payload Delivered!</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-primary" />
                <span>Send Test Ping</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        {savedToast ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            Notification Rules Saved!
          </span>
        ) : <div />}

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm cursor-pointer"
        >
          <Check className="w-4 h-4" />
          Save Notification Settings
        </button>
      </div>
    </form>
  );
};

export default NotificationSettingsTab;
