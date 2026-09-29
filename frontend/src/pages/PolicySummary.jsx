import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Shield,
  Sparkles,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { getPolicyById, MOCK_POLICIES } from '../data/mockPolicies';
import { useAuth } from '../context/AuthContext';
import {
  PolicySummaryHeader,
  TrustRecommendationCard,
  BulletSummaryCard,
  CategoryScoresList,
  PolicyActionsBar,
  AskAiAssistantModal,
} from '../components/policy';

const POPULAR_SWITCH_SERVICES = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬' },
  { id: 'spotify', name: 'Spotify', icon: '🎵' },
  { id: 'chatgpt', name: 'OpenAI ChatGPT', icon: '🤖' },
  { id: 'tiktok', name: 'TikTok', icon: '📱' },
  { id: 'netflix', name: 'Netflix', icon: '🎬' },
];

const PolicySummary = () => {
  const { id = 'whatsapp' } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [isChatOpen, setIsChatOpen] = useState(false);

  // Retrieve persona from query or user profile
  const persona = searchParams.get('persona') || user?.role || 'General Consumer';

  // Fetch policy data
  const policy = getPolicyById(id);

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
      <PolicySummaryHeader policy={policy} persona={persona} />

      {/* 3. Quick Switch Services Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Compass className="w-3.5 h-3.5 text-primary" />
          Switch Policy:
        </span>
        {POPULAR_SWITCH_SERVICES.map((srv) => {
          const isActive = srv.id === policy.id;
          return (
            <Link
              key={srv.id}
              to={`/policy/${srv.id}/summary?persona=${encodeURIComponent(persona)}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-card border border-border text-text-secondary hover:border-primary/40 hover:text-primary'
              }`}
            >
              <span>{srv.icon}</span>
              <span>{srv.name}</span>
            </Link>
          );
        })}
      </div>

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
