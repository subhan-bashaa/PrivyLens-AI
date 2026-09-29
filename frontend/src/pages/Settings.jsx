import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';
import {
  SettingsTabs,
  GeneralSettingsTab,
  NotificationSettingsTab,
  ApiKeysSettingsTab,
  DangerZoneSettingsTab,
} from '../components/settings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-bold">System Settings</span>
      </nav>

      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                System Settings
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck className="w-3 h-3" />
                Active Environment
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Configure app appearance, alert dispatch thresholds, developer API keys, and data sovereignty
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <SettingsTabs activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Tab Content */}
      <div className="pt-2">
        {activeTab === 'general' && <GeneralSettingsTab />}
        {activeTab === 'notifications' && <NotificationSettingsTab />}
        {activeTab === 'api' && <ApiKeysSettingsTab />}
        {activeTab === 'danger' && <DangerZoneSettingsTab />}
      </div>
    </div>
  );
};

export default Settings;
