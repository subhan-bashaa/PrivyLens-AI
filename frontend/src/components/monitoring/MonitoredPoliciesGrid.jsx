import { useState } from 'react';
import {
  Eye,
  AlertTriangle,
  Pause,
  LayoutGrid,
} from 'lucide-react';
import PolicyMonitorCard from './PolicyMonitorCard';

const FILTER_TABS = [
  { key: 'all', label: 'All', icon: LayoutGrid },
  { key: 'active', label: 'Active', icon: Eye },
  { key: 'alert', label: 'Alerts', icon: AlertTriangle },
  { key: 'paused', label: 'Paused', icon: Pause },
];

const MonitoredPoliciesGrid = ({ policies, onToggleStatus, onChangeFrequency }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredPolicies = policies.filter((p) => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  const tabCounts = {
    all: policies.length,
    active: policies.filter((p) => p.status === 'active').length,
    alert: policies.filter((p) => p.status === 'alert').length,
    paused: policies.filter((p) => p.status === 'paused').length,
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-text-primary tracking-tight">
              Monitored Policies
            </h3>
            <p className="text-xs text-text-secondary">
              {policies.length} policies under active surveillance
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-page-bg rounded-xl p-1 border border-border">
          {FILTER_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const count = tabCounts[tab.key];

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-card text-primary shadow-sm border border-primary/20'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-primary/10 text-primary' : 'bg-border text-text-tertiary'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Policies Grid */}
      {filteredPolicies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPolicies.map((policy, idx) => (
            <div
              key={policy.policyId}
              className="animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <PolicyMonitorCard
                policy={policy}
                onToggleStatus={onToggleStatus}
                onChangeFrequency={onChangeFrequency}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-text-tertiary font-medium mb-1">
            No policies match this filter.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className="text-xs font-semibold text-primary hover:text-primary-dark cursor-pointer transition-colors"
          >
            Show all policies
          </button>
        </div>
      )}
    </div>
  );
};

export default MonitoredPoliciesGrid;
