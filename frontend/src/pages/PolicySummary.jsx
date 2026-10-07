import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Shield,
  Sparkles,
  RefreshCw,
  Compass,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { getPolicy } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  PolicySummaryHeader,
  TrustRecommendationCard,
  BulletSummaryCard,
  CategoryScoresList,
  PolicyActionsBar,
  AskAiAssistantModal,
  PersonaPerspectiveCard,
} from '../components/policy';

const PolicySummary = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Retrieve persona from query or user profile
  const queryPersona = searchParams.get('persona') || user?.role || 'student';
  const [activePersona, setActivePersona] = useState(queryPersona);

  useEffect(() => {
    if (queryPersona && queryPersona !== activePersona) {
      setActivePersona(queryPersona);
    }
  }, [queryPersona]);

  const handlePersonaChange = (newPersona) => {
    setActivePersona(newPersona);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('persona', newPersona);
      return next;
    });
  };

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const res = await getPolicy(id);
        const p = res?.data?.policy;
        if (!p) {
          setError('Policy document not found.');
          setLoading(false);
          return;
        }

        const catScores = p.category_scores || {};
        const pe = p.persona_explanations || {};
        const personaKey = activePersona.toLowerCase();
        const activePersonaData = pe[personaKey] || pe.general || pe.student || {};

        const structuredSummary = p.structured_summary || pe.structured_summary || {
          data_collected: Array.isArray(p.data_collection) ? p.data_collection.join(', ') : p.data_collection?.summary || 'Personal identifiers and telemetry data.',
          purpose_of_data_use: activePersonaData?.personaQuestions?.whyDoesItCollect || 'To provide, maintain, and optimize online platform services.',
          data_sharing: Array.isArray(p.data_sharing) ? p.data_sharing.join(', ') : p.data_sharing?.summary || activePersonaData?.personaQuestions?.whoReceivesIt || 'Authorized vendors and legal compliance.',
          data_retention: p.retention?.duration_statement || p.retention?.summary || activePersonaData?.personaQuestions?.howLongKept || 'Retained as needed for core service delivery.',
          user_rights: Array.isArray(p.user_rights) ? p.user_rights.join(', ') : p.user_rights?.summary || activePersonaData?.personaQuestions?.whatRightsDoIHave || 'Access, correction, and consent withdrawal rights.',
          security: Array.isArray(p.security) ? p.security.join(', ') : p.security?.summary || 'Standard data encryption and storage safeguards.',
          other_important_points: p.other_important_points?.summary || pe.other_important_points?.summary || 'Age assurance and policy update notices.',
        };

        const execSynthesis = p.executive_synthesis || pe.executive_synthesis || {
          verdict: p.risk_level === 'Low' ? 'Safe to Use' : p.risk_level === 'High' ? 'High Risk Profile' : 'Proceed with Caution',
          verdict_summary: p.summary || 'Evaluate personal data collection and third-party data broker sharing before agreeing.',
          data_processing_purpose: structuredSummary.purpose_of_data_use,
          third_party_scope: structuredSummary.data_sharing,
        };

        const recommendation = {
          status: execSynthesis.verdict || (p.risk_level === 'Low' ? 'Safe to Use' : p.risk_level === 'High' ? 'High Risk Profile' : 'Proceed with Caution'),
          type: (p.risk_level === 'Low' || execSynthesis.verdict === 'Safe to Use') ? 'success' : (p.risk_level === 'High' || execSynthesis.verdict === 'High Risk Profile') ? 'danger' : 'warning',
          summary: execSynthesis.verdict_summary || p.summary || 'Evaluate personal data collection and third-party data broker sharing before agreeing.',
          purpose: execSynthesis.data_processing_purpose || structuredSummary.purpose_of_data_use,
          thirdPartyScope: execSynthesis.third_party_scope || structuredSummary.data_sharing,
          actionText: 'Review Sensitive Clauses',
          actionLink: `/policy/${p.id}/details`,
        };

        const keyInsights = [
          {
            id: 'collection',
            category: 'Data Collection',
            risk: catScores.data_collection?.riskLevel?.toLowerCase() || 'medium',
            summary: structuredSummary.data_collected || p.data_collection?.summary || 'Personal identifiers and usage telemetry audited.',
            details: (Array.isArray(p.data_collection?.collected_items) && p.data_collection.collected_items.length > 0)
              ? p.data_collection.collected_items
              : Array.isArray(p.data_collection)
              ? p.data_collection
              : ['Account Details', 'Network Identifiers', 'Interaction Telemetry'],
            iconName: 'Database',
          },
          {
            id: 'sharing',
            category: 'Data Sharing',
            risk: catScores.data_sharing?.riskLevel?.toLowerCase() || 'medium',
            summary: structuredSummary.data_sharing || p.data_sharing?.summary || 'Third-party vendor sharing terms audited.',
            details: (Array.isArray(p.data_sharing?.sharing_recipients) && p.data_sharing.sharing_recipients.length > 0)
              ? p.data_sharing.sharing_recipients
              : Array.isArray(p.data_sharing)
              ? p.data_sharing
              : ['Authorized Service Providers', 'Legal & Regulatory Authorities'],
            iconName: 'Share2',
          },
          {
            id: 'tracking',
            category: 'Cookies & Telemetry',
            risk: catScores.tracking_cookies?.riskLevel?.toLowerCase() || 'medium',
            summary: p.tracking?.summary || (Array.isArray(p.tracking) ? p.tracking.join(', ') : 'Telemetry and cookie trackers audited.'),
            details: (Array.isArray(p.tracking?.methods) && p.tracking.methods.length > 0)
              ? p.tracking.methods
              : Array.isArray(p.tracking)
              ? p.tracking
              : ['Essential Cookies', 'Analytics Signals', 'Device Telemetry'],
            iconName: 'Cookie',
          },
          {
            id: 'retention',
            category: 'Data Retention',
            risk: catScores.data_retention?.riskLevel?.toLowerCase() || 'medium',
            summary: structuredSummary.data_retention || p.retention?.summary || 'Data lifecycle and purge timelines audited.',
            details: (Array.isArray(p.retention?.policies) && p.retention.policies.length > 0)
              ? p.retention.policies
              : [p.retention?.duration_statement || 'Active account lifecycle'],
            iconName: 'Clock',
          },
          {
            id: 'rights',
            category: 'User Rights',
            risk: catScores.user_rights?.riskLevel?.toLowerCase() || 'low',
            summary: structuredSummary.user_rights || p.user_rights?.summary || 'Statutory user rights under DPDP Act 2023.',
            details: (Array.isArray(p.user_rights?.rights_list) && p.user_rights.rights_list.length > 0)
              ? p.user_rights.rights_list
              : Array.isArray(p.user_rights)
              ? p.user_rights
              : ['Right to Access', 'Right to Correction & Erasure', 'Right of Grievance Redressal'],
            iconName: 'UserCheck',
          },
          {
            id: 'security',
            category: 'Security & Encryption',
            risk: catScores.security_encryption?.riskLevel?.toLowerCase() || 'low',
            summary: structuredSummary.security || p.security?.summary || 'Cryptographic standards and technical safeguards.',
            details: (Array.isArray(p.security?.measures) && p.security.measures.length > 0)
              ? p.security.measures
              : Array.isArray(p.security)
              ? p.security
              : ['Transport Layer Security (TLS)', 'Encrypted Storage', 'Access Control Policies'],
            iconName: 'Lock',
          },
          {
            id: 'other',
            category: 'Age & Governance Safeguards',
            risk: 'low',
            summary: structuredSummary.other_important_points || 'Age limits, governance safeguards, and policy update notifications.',
            details: (Array.isArray(p.other_important_points?.points) && p.other_important_points.points.length > 0)
              ? p.other_important_points.points
              : ['Age verification thresholds', 'Advance policy revision notices', 'Cross-border jurisdictional safeguards'],
            iconName: 'Sparkles',
          },
        ];

        const viewPolicy = {
          id: p.id,
          name: p.title || 'Audited Privacy Policy',
          url: p.policy_url || p.website_url || '#',
          trustScore: parseFloat(p.overall_score) || 0.0,
          riskLevel: p.risk_level || 'Moderate',
          summary: p.summary || 'Privacy audit completed successfully.',
          structuredSummary,
          executiveSynthesis: execSynthesis,
          recommendation,
          lastUpdated: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Recent',
          scores: {
            collection: catScores.data_collection?.score ?? 7.0,
            sharing: catScores.data_sharing?.score ?? 6.5,
            tracking: catScores.tracking_cookies?.score ?? 6.0,
            retention: catScores.data_retention?.score ?? 7.5,
            rights: catScores.user_rights?.score ?? 7.0,
            security: catScores.security_encryption?.score ?? 8.5,
          },
          redFlags: (p.red_flags || []).map((rf, i) =>
            typeof rf === 'string' ? { id: `rf-${i}`, text: rf, severity: 'high' } : rf
          ),
          positiveFindings: (p.positive_findings || []).map((pf, i) =>
            typeof pf === 'string' ? { id: `pf-${i}`, text: pf } : pf
          ),
          recommendations: p.recommendations || [],
          personaExplanation: activePersonaData?.whatItMeansForYou || p.summary,
          keyInsights,
        };
        setPolicy(viewPolicy);
      } catch (err) {
        setError(err?.response?.data?.message || 'Could not load policy analysis.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [id, activePersona]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-semibold text-text-secondary">Loading Real-Time Policy Intelligence...</p>
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Policy Not Found</h2>
        <p className="text-xs text-text-secondary">{error || 'This policy does not exist in your intelligence repository.'}</p>
        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all"
        >
          Analyze a New Policy
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Breadcrumbs Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/analyze" className="hover:text-primary transition-colors">
          Policy Analysis
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-bold">{policy.name} Summary</span>
      </nav>

      {/* 2. Top Policy Summary Header */}
      <PolicySummaryHeader policy={policy} persona={activePersona} />

      {/* Quick Policy Actions Header */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          <Shield className="w-3.5 h-3.5 text-primary" />
          Audited under Persona: <span className="text-primary font-bold capitalize">{activePersona}</span>
        </span>
        <Link
          to="/analyze"
          className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors shrink-0"
        >
          + Analyze Another Policy
        </Link>
      </div>

      {/* 3. Tailored User Perspective Audit Card */}
      <PersonaPerspectiveCard
        policy={policy}
        currentPersona={activePersona}
        onPersonaChange={handlePersonaChange}
      />

      {/* 4. Trust Recommendation Hero Card */}
      <TrustRecommendationCard policy={policy} />

      {/* 5. Two-Column Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Plain-Language Bullet Breakdown */}
        <div className="lg:col-span-7">
          <BulletSummaryCard policy={policy} />
        </div>

        {/* Right Column (5 cols): 6 Privacy Pillars Scorecard */}
        <div className="lg:col-span-5">
          <CategoryScoresList scores={policy.scores} />
        </div>
      </div>

      {/* 6. Policy Actions & Deep Dive Bar */}
      <PolicyActionsBar policy={policy} onOpenChat={() => setIsChatOpen(true)} />

      {/* 7. Interactive AI Assistant Modal */}
      <AskAiAssistantModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        policy={policy}
      />
    </div>
  );
};

export default PolicySummary;
