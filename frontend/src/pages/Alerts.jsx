import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BellOff, CheckCircle, RotateCcw, Loader2 } from 'lucide-react';
import { getAlerts, markAlertAsRead } from '../services/api';
import {
  AlertsHeader,
  AlertsStatsBar,
  AlertsFilterBar,
  AlertCard,
  AlertDetailModal,
} from '../components/alerts';

const Alerts = () => {
  // Master alerts list state
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const res = await getAlerts();
        const raw = res?.data?.alerts || [];
        const formatted = raw.map((a) => ({
          id: a.id,
          title: a.title,
          policyName: a.policy_title || 'Monitored Policy',
          serviceName: a.policy_title || 'Web Service',
          description: a.message,
          severity: (a.severity || 'medium').toLowerCase(),
          type: a.type || 'drift',
          timestamp: a.created_at ? new Date(a.created_at).toLocaleString() : 'Recently',
          isRead: Boolean(a.is_read),
          isResolved: Boolean(a.is_resolved),
        }));
        setAlerts(formatted);
      } catch (err) {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Modal state
  const [selectedAlertForModal, setSelectedAlertForModal] = useState(null);

  // Dynamic statistics based on current alerts state
  const stats = useMemo(() => {
    const total = alerts.length;
    const unread = alerts.filter((a) => !a.isRead && !a.isResolved).length;
    const critical = alerts.filter((a) => a.severity === 'critical' && !a.isResolved).length;
    const high = alerts.filter((a) => a.severity === 'high' && !a.isResolved).length;
    const resolved = alerts.filter((a) => a.isResolved).length;
    return { total, unread, critical, high, resolved };
  }, [alerts]);

  // Handle stat card filter click
  const handleStatCardClick = useCallback((filterKey) => {
    if (filterKey === 'all') {
      setSelectedStatus('all');
      setSelectedSeverity('all');
    } else if (filterKey === 'unread') {
      setSelectedStatus('unread');
      setSelectedSeverity('all');
    } else if (filterKey === 'critical') {
      setSelectedSeverity('critical');
      setSelectedStatus('all');
    } else if (filterKey === 'high') {
      setSelectedSeverity('high');
      setSelectedStatus('all');
    } else if (filterKey === 'resolved') {
      setSelectedStatus('resolved');
      setSelectedSeverity('all');
    }
  }, []);

  // Filter alerts based on active controls
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      // 1. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = alert.title.toLowerCase().includes(q);
        const matchesDesc = alert.description.toLowerCase().includes(q);
        const matchesService = alert.serviceName.toLowerCase().includes(q);
        const matchesClauses = alert.affectedClauses?.some((c) =>
          c.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesDesc && !matchesService && !matchesClauses) {
          return false;
        }
      }

      // 2. Type filter
      if (selectedType !== 'all' && alert.type !== selectedType) {
        return false;
      }

      // 3. Severity filter
      if (selectedSeverity !== 'all' && alert.severity !== selectedSeverity) {
        return false;
      }

      // 4. Status filter
      if (selectedStatus === 'unread' && (alert.isRead || alert.isResolved)) {
        return false;
      }
      if (selectedStatus === 'resolved' && !alert.isResolved) {
        return false;
      }

      return true;
    });
  }, [alerts, searchQuery, selectedType, selectedSeverity, selectedStatus]);

  // Actions
  const handleToggleRead = useCallback((alertId) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.alertId === alertId) {
          const updated = { ...a, isRead: !a.isRead };
          return updated;
        }
        return a;
      })
    );

    // Also update modal alert if open
    setSelectedAlertForModal((prev) =>
      prev && prev.alertId === alertId ? { ...prev, isRead: !prev.isRead } : prev
    );
  }, []);

  const handleToggleResolved = useCallback((alertId) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.alertId === alertId) {
          const updated = { ...a, isResolved: !a.isResolved, isRead: true };
          return updated;
        }
        return a;
      })
    );

    // Also update modal alert if open
    setSelectedAlertForModal((prev) =>
      prev && prev.alertId === alertId
        ? { ...prev, isResolved: !prev.isResolved, isRead: true }
        : prev
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  }, []);

  const handleClearResolved = useCallback(() => {
    setAlerts((prev) => prev.filter((a) => !a.isResolved));
    if (selectedAlertForModal?.isResolved) {
      setSelectedAlertForModal(null);
    }
  }, [selectedAlertForModal]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedSeverity('all');
    setSelectedStatus('all');
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-bold">Alerts</span>
      </nav>

      {/* 1. Page Header */}
      <AlertsHeader
        unreadCount={stats.unread}
        resolvedCount={stats.resolved}
        onMarkAllRead={handleMarkAllRead}
        onClearResolved={handleClearResolved}
      />

      {/* 2. Stats Bar */}
      <AlertsStatsBar
        stats={stats}
        activeFilter={selectedStatus === 'unread' ? 'unread' : selectedStatus === 'resolved' ? 'resolved' : selectedSeverity !== 'all' ? selectedSeverity : 'all'}
        onSelectFilter={handleStatCardClick}
      />

      {/* 3. Filter Bar */}
      <AlertsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedSeverity={selectedSeverity}
        onSeverityChange={setSelectedSeverity}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        filteredCount={filteredAlerts.length}
        totalCount={alerts.length}
      />

      {/* 4. Alert Cards List / Empty State */}
      {filteredAlerts.length > 0 ? (
        <div className="space-y-3.5">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.alertId}
              alert={alert}
              onToggleRead={handleToggleRead}
              onToggleResolved={handleToggleResolved}
              onOpenDetails={setSelectedAlertForModal}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-background-subtle border border-border flex items-center justify-center mx-auto mb-4">
            {alerts.length === 0 ? (
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            ) : (
              <BellOff className="w-7 h-7 text-text-tertiary" />
            )}
          </div>
          <h3 className="text-base font-bold text-text-primary mb-1">
            {alerts.length === 0
              ? 'Inbox Zero! No alerts remaining'
              : 'No alerts match your filters'}
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4 leading-relaxed">
            {alerts.length === 0
              ? 'All policy alerts and notifications have been cleared or resolved.'
              : 'Try broadening your search term, clearing status filters, or selecting a different alert category.'}
          </p>
          {alerts.length > 0 && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-background hover:bg-background-hover border border-border text-text-primary hover:border-primary/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-primary" />
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* 5. Detail Modal */}
      <AlertDetailModal
        alert={selectedAlertForModal}
        isOpen={Boolean(selectedAlertForModal)}
        onClose={() => setSelectedAlertForModal(null)}
        onToggleRead={handleToggleRead}
        onToggleResolved={handleToggleResolved}
      />
    </div>
  );
};

export default Alerts;
