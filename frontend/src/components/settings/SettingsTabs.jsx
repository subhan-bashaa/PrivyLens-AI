import { SlidersHorizontal, Bell, KeyRound, AlertOctagon } from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: SlidersHorizontal },
  { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
  { id: 'api', label: 'API & Integrations', icon: KeyRound },
  { id: 'danger', label: 'Data & Privacy Zone', icon: AlertOctagon },
];

const SettingsTabs = ({ activeTab, onSelectTab }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-border">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-b-2 -mb-[2px] ${
              isActive
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-background'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsTabs;
