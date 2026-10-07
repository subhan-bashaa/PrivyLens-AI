import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { getMonitoredPolicies, enableMonitoring, disableMonitoring } from '../services/api';
import {
  MonitoringHeader,
  MonitoringStatsBar,
  ChangeDetectionAlert,
  MonitoredPoliciesGrid,
  MonitoringActivityTimeline,
} from '../components/monitoring';

const Monitoring = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonitored = async () => {
      setLoading(true);
      try {
        const res = await getMonitoredPolicies();
        const raw = res?.data?.monitoredPolicies || [];
        const formatted = raw.map((m) => ({
          policyId: m.policy_id,
          policyName: m.title || 'Monitored Policy',
          serviceName: m.title || 'Web Service',
          url: m.policy_url || m.website_url || '#',
          status: m.status || (m.is_active ? 'active' : 'paused'),
          checkFrequency: m.check_frequency || 'Every 6 Hours',
          lastChecked: m.last_checked ? new Date(m.last_checked).toLocaleString() : 'Pending sweep',
          trustScore: parseFloat(m.overall_score) || 7.0,
          driftCount: parseInt(m.drift_count || 0, 10),
        }));
        setPolicies(formatted);
      } catch (err) {
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMonitored();
  }, []);

  const handleToggleStatus = useCallback(async (policyId) => {
    const target = policies.find((p) => p.policyId === policyId);
    if (!target) return;
    const newStatus = target.status === 'paused' ? 'active' : 'paused';

    setPolicies((prev) =>
      prev.map((p) => (p.policyId === policyId ? { ...p, status: newStatus } : p))
    );

    try {
      if (newStatus === 'active') {
        await enableMonitoring(policyId);
      } else {
        await disableMonitoring(policyId);
      }
    } catch (e) {
      // Revert on error
      setPolicies((prev) =>
        prev.map((p) => (p.policyId === policyId ? { ...p, status: target.status } : p))
      );
    }
  }, [policies]);

  const handleChangeFrequency = useCallback((policyId, frequency) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.policyId === policyId ? { ...p, checkFrequency: frequency } : p
      )
    );
  }, []);

  const stats = {
    totalMonitored: policies.length,
    activeAlerts: policies.reduce((acc, p) => acc + (p.driftCount || 0), 0),
    changesThisMonth: 0,
    activeMonitoring: policies.filter((p) => p.status === 'active').length,
    avgCheckFrequency: 'Every 6 Hours',
  };

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

      {/* 2. Stats Bar */}
      <MonitoringStatsBar stats={stats} />

      {/* 3. Monitored Policies Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-text-secondary">Loading monitored domains...</p>
        </div>
      ) : policies.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-12 text-center space-y-3 shadow-sm">
          <p className="text-sm font-bold text-text-primary">No policies currently monitored</p>
          <p className="text-xs text-text-secondary max-w-sm mx-auto">
            Enable monitoring when analyzing a policy to receive automated background drift sweeps.
          </p>
          <div className="pt-2">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all"
            >
              Analyze & Monitor New Policy
            </Link>
          </div>
        </div>
      ) : (
        <MonitoredPoliciesGrid
          policies={policies}
          onToggleStatus={handleToggleStatus}
          onChangeFrequency={handleChangeFrequency}
        />
      )}
    </div>
  );
};

export default Monitoring;
