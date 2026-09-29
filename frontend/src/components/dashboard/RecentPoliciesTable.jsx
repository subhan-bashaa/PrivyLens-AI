import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Search,
  ExternalLink,
  ChevronRight,
  GitCompare,
  FileText,
  Activity,
} from 'lucide-react';

const riskBadges = {
  Low: 'bg-success-light text-success-dark border-success/30',
  Medium: 'bg-warning-light text-warning-dark border-warning/30',
  High: 'bg-danger-light text-danger-dark border-danger/30',
};

const RecentPoliciesTable = ({ policies = [] }) => {
  const [search, setSearch] = useState('');
  const [monitoredState, setMonitoredState] = useState(() => {
    const map = {};
    policies.forEach((p) => {
      map[p.id] = p.monitoringActive ?? true;
    });
    return map;
  });

  const toggleMonitoring = (id) => {
    setMonitoredState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filtered = policies.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-text-primary">Recent Analyzed Policies</h3>
          <p className="text-xs text-text-tertiary">All policies monitored under your account</p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-page-bg border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-text-tertiary uppercase text-[10px] tracking-wider">
              <th className="pb-3 font-semibold">Service / App</th>
              <th className="pb-3 font-semibold">Version</th>
              <th className="pb-3 font-semibold">Trust Score</th>
              <th className="pb-3 font-semibold">Risk Level</th>
              <th className="pb-3 font-semibold">Monitoring</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((policy) => {
              const isMonitored = monitoredState[policy.id];
              const badgeStyle = riskBadges[policy.riskLevel] || riskBadges.Medium;

              return (
                <tr key={policy.id} className="hover:bg-page-bg/70 transition-colors group">
                  {/* Service */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <Link
                          to={`/policy/${policy.id}/summary`}
                          className="font-bold text-text-primary hover:text-primary transition-colors flex items-center gap-1"
                        >
                          {policy.name}
                        </Link>
                        <span className="text-[11px] text-text-tertiary block mt-0.5">
                          {policy.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Version */}
                  <td className="py-4 pr-4 text-text-secondary font-medium">
                    {policy.version}
                  </td>

                  {/* Trust Score */}
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-text-primary text-sm">
                        {policy.trustScore.toFixed(1)}
                      </span>
                      <span className="text-[10px] text-text-tertiary">/ 10</span>
                    </div>
                  </td>

                  {/* Risk Level */}
                  <td className="py-4 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle}`}>
                      {policy.riskLevel} Risk
                    </span>
                  </td>

                  {/* Monitoring Toggle */}
                  <td className="py-4 pr-4">
                    <button
                      type="button"
                      onClick={() => toggleMonitoring(policy.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                        isMonitored
                          ? 'bg-success-light text-success-dark hover:bg-success/20'
                          : 'bg-page-bg text-text-tertiary hover:text-text-secondary border border-border'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isMonitored ? 'bg-success' : 'bg-text-tertiary'}`} />
                      {isMonitored ? 'Active' : 'Paused'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/policy/${policy.id}/summary`}
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-primary hover:bg-primary/10 transition-colors"
                        title="View Summary"
                      >
                        <FileText className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/policy/${policy.id}/compare`}
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-primary hover:bg-primary/10 transition-colors"
                        title="Compare Versions"
                      >
                        <GitCompare className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPoliciesTable;
