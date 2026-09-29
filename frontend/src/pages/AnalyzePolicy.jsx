import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ScanSearch,
  Globe,
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  User,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import {
  UrlInputTab,
  PdfUploadTab,
  AppSearchTab,
  AnalysisProgressModal,
} from '../components/analysis';
import { MOCK_POLICIES } from '../data/mockPolicies';

const TABS = [
  { id: 'url', label: 'Paste URL', icon: Globe, description: 'Analyze any live privacy policy webpage' },
  { id: 'pdf', label: 'Upload PDF', icon: FileText, description: 'Upload policy document up to 15MB' },
  { id: 'search', label: 'Search App / Site', icon: Search, description: 'Select from pre-indexed services' },
];

const PERSONAS = [
  { id: 'general', label: 'General Consumer', desc: 'Standard privacy rights and tracking checks' },
  { id: 'student', label: 'Student', desc: 'Focus on educational data and device telemetry' },
  { id: 'parent', label: 'Parent', desc: 'Focus on COPPA, child privacy, and location sharing' },
  { id: 'employee', label: 'Employee', desc: 'Focus on device surveillance and activity logs' },
  { id: 'business', label: 'Business User', desc: 'Focus on DPA, third-party liability, and encryption' },
];

const AnalyzePolicy = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('url');
  const [url, setUrl] = useState('https://www.whatsapp.com/legal/privacy-policy');
  const [file, setFile] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [persona, setPersona] = useState('student');
  const [enableMonitoring, setEnableMonitoring] = useState(true);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedPolicyName, setAnalyzedPolicyName] = useState('WhatsApp');

  useEffect(() => {
    const queryUrl = searchParams.get('url');
    const queryPersona = searchParams.get('persona');
    const autoAnalyze = searchParams.get('autoAnalyze');

    if (queryPersona) {
      const matched = PERSONAS.find(
        (p) => p.id === queryPersona.toLowerCase() || p.label.toLowerCase().includes(queryPersona.toLowerCase())
      );
      if (matched) setPersona(matched.id);
    }

    if (queryUrl) {
      setUrl(queryUrl);
      setActiveTab('url');

      if (autoAnalyze === 'true') {
        if (!isAuthenticated) {
          navigate(
            `/login?url=${encodeURIComponent(queryUrl)}&persona=${encodeURIComponent(queryPersona || persona)}&autoAnalyze=true&open=true`
          );
          return;
        }

        let targetName = 'Web Policy';
        if (queryUrl.includes('spotify')) targetName = 'Spotify';
        else if (queryUrl.includes('instagram')) targetName = 'Instagram';
        else if (queryUrl.includes('openai') || queryUrl.includes('chatgpt')) targetName = 'OpenAI ChatGPT';
        else if (queryUrl.includes('tiktok')) targetName = 'TikTok';
        else if (queryUrl.includes('netflix')) targetName = 'Netflix';
        else if (queryUrl.includes('whatsapp')) targetName = 'WhatsApp';
        else {
          try {
            targetName = new URL(queryUrl).hostname.replace(/^www\./, '');
          } catch (e) {
            targetName = 'Target Policy';
          }
        }
        setAnalyzedPolicyName(targetName);
        setIsAnalyzing(true);
      }
    }
  }, [searchParams, isAuthenticated, navigate]);

  const handleStartAnalysis = (e) => {
    if (e) e.preventDefault();

    if (!isAuthenticated) {
      navigate(
        `/login?url=${encodeURIComponent(url)}&persona=${encodeURIComponent(persona)}&autoAnalyze=true&open=true`
      );
      return;
    }

    let targetName = 'WhatsApp';

    if (activeTab === 'url') {
      if (!url.trim()) {
        setError('Please enter a valid webpage URL.');
        return;
      }
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        setError('Please enter a URL starting with https:// or http://');
        return;
      }
      // Infer policy name from URL
      if (url.includes('spotify')) targetName = 'Spotify';
      else if (url.includes('instagram')) targetName = 'Instagram';
      else if (url.includes('openai') || url.includes('chatgpt')) targetName = 'OpenAI ChatGPT';
      else if (url.includes('tiktok')) targetName = 'TikTok';
      else if (url.includes('netflix')) targetName = 'Netflix';
      else targetName = 'WhatsApp';
    } else if (activeTab === 'pdf') {
      if (!file) {
        setError('Please select or drop a PDF document to analyze.');
        return;
      }
      targetName = file.name.replace('.pdf', '');
    } else if (activeTab === 'search') {
      if (!selectedApp) {
        setError('Please select an application or website from the list.');
        return;
      }
      targetName = selectedApp.name;
    }

    setAnalyzedPolicyName(targetName);
    setError('');
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    // Navigate to Policy Summary for WhatsApp (or matched id)
    const policyId =
      analyzedPolicyName.toLowerCase().includes('spotify')
        ? 'spotify'
        : analyzedPolicyName.toLowerCase().includes('instagram')
        ? 'instagram'
        : 'whatsapp';
    navigate(`/policy/${policyId}/summary`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-3">
          <ScanSearch className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
          Analyze Any Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-text-tertiary mt-1.5 leading-relaxed">
          Paste a link, upload a PDF document, or search for popular applications.
          PrivyLens AI unpacks clauses, identifies red flags, and calculates a trust score in seconds.
        </p>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8 space-y-6">
        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-page-bg p-1.5 rounded-2xl border border-border">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setError('');
                }}
                className={`
                  flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl
                  font-semibold text-xs transition-all cursor-pointer text-center
                  ${
                    isActive
                      ? 'bg-card text-primary shadow-sm border border-border'
                      : 'text-text-tertiary hover:text-text-primary'
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-tertiary'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="pt-2">
          {activeTab === 'url' && (
            <UrlInputTab
              url={url}
              setUrl={setUrl}
              error={error}
              setError={setError}
            />
          )}

          {activeTab === 'pdf' && (
            <PdfUploadTab
              file={file}
              setFile={setFile}
              error={error}
              setError={setError}
            />
          )}

          {activeTab === 'search' && (
            <AppSearchTab
              selectedApp={selectedApp}
              setSelectedApp={setSelectedApp}
              setUrl={setUrl}
              setError={setError}
            />
          )}
        </div>

        {/* Customization Options Bar */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
            <Sliders className="w-4 h-4 text-primary" />
            <span>Analysis Customization (Optional)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Persona Selector */}
            <div className="space-y-1.5">
              <label htmlFor="persona-select" className="text-xs font-medium text-text-tertiary block">
                Target Perspective / Persona:
              </label>
              <select
                id="persona-select"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl bg-page-bg border border-border text-text-primary focus:outline-none focus:border-primary cursor-pointer"
              >
                {PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label} — {p.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Monitoring Option Toggle */}
            <div className="flex items-center justify-start sm:justify-end pt-2 sm:pt-6">
              <label className="flex items-center gap-2.5 text-xs text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableMonitoring}
                  onChange={(e) => setEnableMonitoring(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                />
                Auto-add to monitoring watchlist upon completion
              </label>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleStartAnalysis}
            className="
              w-full flex items-center justify-center gap-2.5 py-3.5 px-6
              text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark
              hover:from-primary-dark hover:to-secondary rounded-xl cursor-pointer
              shadow-md hover:shadow-xl hover:shadow-primary/25 transition-all duration-300
            "
          >
            <Sparkles className="w-4 h-4" />
            Analyze Privacy Policy
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Quick History / Recently Analyzed Shortcuts */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-text-tertiary" />
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
              Recently Analyzed by PrivyLens Community
            </h3>
          </div>
          <span className="text-xs text-text-tertiary">Verified Models</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {MOCK_POLICIES.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setUrl(item.url);
                setAnalyzedPolicyName(item.name);
                setActiveTab('url');
              }}
              className="p-3 rounded-xl border border-border bg-page-bg/50 hover:bg-card hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-text-tertiary">{item.trustScore}/10 Score</p>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* Real-Time Multi-Step Progress Modal (Phase 7) */}
      <AnalysisProgressModal
        isOpen={isAnalyzing}
        policyName={analyzedPolicyName}
        onComplete={handleAnalysisComplete}
      />
    </div>
  );
};

export default AnalyzePolicy;
