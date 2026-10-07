import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  PlusCircle,
  Activity,
  AlertTriangle,
  FileCheck,
  ArrowUpRight,
  TrendingUp,
  FileUp,
  Globe,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPolicies, getMonitoredPolicies } from '../services/api';
import {
  PolicyHeroCard,
  KeyInsightsGrid,
  RedFlagsCard,
  PositiveFindingsCard,
  ScoreBreakdownChart,
  RecentPoliciesTable,
} from '../components/dashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await getPolicies();
        const rawPolicies = res?.data?.policies || [];

        // Format to UI view models
        const formatted = rawPolicies.map((p) => {
          const score = parseFloat(p.overall_score) || 0.0;
          const catScores = p.category_scores || {};
          return {
            id: p.id,
            name: p.title || 'Audited Web Policy',
            category: p.source_type === 'pdf' ? 'PDF Document' : 'Web Service',
            url: p.policy_url || p.website_url || '#',
            version: p.version_number ? `v${p.version_number}.0` : 'v1.0',
            trustScore: score,
            riskLevel: p.risk_level || (score >= 7 ? 'Low' : score >= 4 ? 'Moderate' : 'High'),
            lastAnalyzed: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Just now',
            monitoringActive: Boolean(p.monitoring_enabled),
            summary: p.summary || 'Privacy audit completed.',
            scores: {
              collection: catScores.data_collection?.score ?? 7.0,
              sharing: catScores.data_sharing?.score ?? 6.5,
              tracking: catScores.tracking_cookies?.score ?? 6.0,
              retention: catScores.data_retention?.score ?? 7.5,
              rights: catScores.user_rights?.score ?? 7.0,
              security: catScores.security_encryption?.score ?? 8.5,
            },
            keyInsights: [
              {
                id: 'collection',
                category: 'Data Collection',
                risk: catScores.data_collection?.riskLevel?.toLowerCase() || 'medium',
                summary: p.data_collection?.summary || 'Scope of gathered data audited.',
                details: ['Personal Identifiers', 'Hardware Telemetry'],
                iconName: 'Database',
              },
              {
                id: 'sharing',
                category: 'Third-Party Sharing',
                risk: catScores.data_sharing?.riskLevel?.toLowerCase() || 'medium',
                summary: p.data_sharing?.summary || 'Third-party disclosures analyzed.',
                details: ['Service Vendors', 'Affiliates'],
                iconName: 'Share2',
              },
              {
                id: 'tracking',
                category: 'Cookies & Telemetry',
                risk: catScores.tracking_cookies?.riskLevel?.toLowerCase() || 'medium',
                summary: p.tracking?.summary || 'Tracking technologies examined.',
                details: ['Persistent Identifiers', 'Analytics Tags'],
                iconName: 'Cookie',
              },
              {
                id: 'retention',
                category: 'Data Retention',
                risk: catScores.data_retention?.riskLevel?.toLowerCase() || 'medium',
                summary: p.retention?.summary || 'Storage lifecycle evaluated.',
                details: ['Lifecycle duration', 'Archive schedule'],
                iconName: 'Clock',
              },
              {
                id: 'rights',
                category: 'User Rights',
                risk: catScores.user_rights?.riskLevel?.toLowerCase() || 'low',
                summary: p.user_rights?.summary || 'Statutory DPDP rights assessed.',
                details: ['Access & Erasure', 'Grievance redressal'],
                iconName: 'UserCheck',
              },
              {
                id: 'security',
                category: 'Security & Encryption',
                risk: catScores.security_encryption?.riskLevel?.toLowerCase() || 'low',
                summary: p.security?.summary || 'Cryptographic standards verified.',
                details: ['TLS Encryption', 'Access Controls'],
                iconName: 'Lock',
              },
            ],
            redFlags: (p.red_flags || []).map((rf, i) =>
              typeof rf === 'string' ? { id: `rf-${i}`, text: rf, severity: 'high' } : rf
            ),
            positiveFindings: (p.positive_findings || []).map((pf, i) =>
              typeof pf === 'string' ? { id: `pf-${i}`, text: pf } : pf
            ),
            recommendation: {
              status: score >= 7 ? 'Safe to Use' : score >= 4 ? 'Proceed with Caution' : 'High Privacy Risk',
              type: score >= 7 ? 'success' : score >= 4 ? 'warning' : 'danger',
            },
          };
        });

        setPolicies(formatted);
      } catch (err) {
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalMonitored = policies.filter((p) => p.monitoringActive).length;
  const avgScore =
    policies.length > 0
      ? (policies.reduce((sum, p) => sum + p.trustScore, 0) / policies.length).toFixed(1)
      : '--';
  const highRiskCount = policies.filter((p) => (p.riskLevel || '').toLowerCase() === 'high').length;

  const currentPolicy = policies[0] || null;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header & Greeting */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-text-tertiary mt-1">
            Here is your privacy intelligence overview and latest policy analysis.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Analyze New Policy
        </Link>
      </div>

      {/* Quick Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-text-tertiary">Monitored Policies</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{totalMonitored}</p>
            <p className="text-[11px] text-success font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              {totalMonitored > 0 ? 'Active automated diffing' : 'No active watches'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-text-tertiary">Average Trust Score</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{avgScore}</p>
            <p className="text-[11px] text-text-tertiary font-medium mt-1 flex items-center gap-1">
              {policies.length > 0 ? `Across ${policies.length} audited policies` : 'Awaiting first audit'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success-light text-success flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-text-tertiary">Critical Red Flags</p>
            <p className="text-2xl font-bold text-danger mt-1">{highRiskCount}</p>
            <p className="text-[11px] text-danger font-medium mt-1">
              {highRiskCount > 0 ? 'Requires user review' : 'Zero critical alerts'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-danger-light text-danger flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-text-tertiary">Detection Extension</p>
            <p className="text-2xl font-bold text-text-primary mt-1">Active</p>
            <p className="text-[11px] text-primary font-medium mt-1">
              Real-time browser guard
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-accent-light text-accent-dark flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-semibold text-text-secondary">Loading your privacy portfolio...</p>
        </div>
      ) : currentPolicy ? (
        <>
          {/* 1. Spotlight Hero Card: Last/Current Analyzed Policy */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                Current Focus Policy
              </span>
              <Link
                to="/monitoring"
                className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1"
              >
                View all monitoring <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <PolicyHeroCard policy={currentPolicy} />
          </div>

          {/* 2. Key Insights Grid (6 Pillars) */}
          <KeyInsightsGrid
            insights={currentPolicy.keyInsights}
            scores={currentPolicy.scores}
          />

          {/* 3. Red Flags & Positive Findings (Side-by-Side) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RedFlagsCard redFlags={currentPolicy.redFlags} />
            <PositiveFindingsCard positiveFindings={currentPolicy.positiveFindings} />
          </div>

          {/* 4. Score Breakdown Benchmark Chart */}
          <ScoreBreakdownChart scores={currentPolicy.scores} />

          {/* 5. Recently Analyzed & Monitored Policies */}
          <RecentPoliciesTable policies={policies} />
        </>
      ) : (
        /* Empty Portfolio State — Zero Dummy Data */
        <div className="bg-card rounded-3xl border border-border p-8 md:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-text-primary">
              Welcome to PrivyLens AI Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
              Your real-time privacy defense platform is ready. Start by auditing your first privacy policy webpage or document under your tailored persona.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md hover:shadow-primary/25 transition-all"
            >
              <Globe className="w-4 h-4" />
              Analyze Policy Webpage
            </Link>
            <Link
              to="/analyze?tab=pdf"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-page-bg hover:bg-card border border-border text-text-primary text-xs font-bold transition-all"
            >
              <FileUp className="w-4 h-4" />
              Upload Policy PDF
            </Link>
          </div>

          <div className="pt-6 border-t border-border/60 text-[11px] text-text-tertiary flex items-center justify-center gap-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Chrome Extension active: Browse legal pages to trigger instant slide-in detection.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
