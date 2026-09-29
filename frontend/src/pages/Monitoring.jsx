import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  MONITORED_POLICIES,
  MONITORING_ACTIVITY,
  MONITORING_STATS,
  CRITICAL_CHANGE,
} from '../data/mockMonitoring';
import {
  MonitoringHeader,
  MonitoringStatsBar,
  ChangeDetectionAlert,
  MonitoredPoliciesGrid,
  MonitoringActivityTimeline,
} from '../components/monitoring';

const Monitoring = () => {
  // Local state for policy monitoring statuses
  const [policies, setPolicies] = useState(MONITORED_POLICIES);

  const handleToggleStatus = useCallback((policyId) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.policyId !== policyId) return p;
        // Toggle between active and paused (alert stays as alert until resolved)
        const newStatus = p.status === 'paused' ? 'active' : 'paused';
        return { ...p, status: newStatus };
      })
    );
  }, []);

  const handleChangeFrequency = useCallback((policyId, frequency) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.policyId === policyId ? { ...p, checkFrequency: frequency } : p
      )
    );
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-bold">Monitoring</span>
      </nav>

      {/* 1. Page Header */}
      <MonitoringHeader />

      {/* 2. Critical Change Alert Banner */}
      <ChangeDetectionAlert change={CRITICAL_CHANGE} />

      {/* 3. Stats Bar */}
      <MonitoringStatsBar stats={MONITORING_STATS} />

      {/* 4. Monitored Policies Grid */}
      <MonitoredPoliciesGrid
        policies={policies}
        onToggleStatus={handleToggleStatus}
        onChangeFrequency={handleChangeFrequency}
      />

      {/* 5. Activity Timeline */}
      <MonitoringActivityTimeline events={MONITORING_ACTIVITY} />
    </div>
  );
};

export default Monitoring;
