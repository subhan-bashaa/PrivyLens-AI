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
  AlertCircle,
} from 'lucide-react';
import {
  UrlInputTab,
  PdfUploadTab,
  AppSearchTab,
  AnalysisProgressModal,
} from '../components/analysis';
import { analyzePolicy, uploadPolicyPdf, getPolicies } from '../services/api';

const TABS = [
  { id: 'url', label: 'Paste URL', icon: Globe, description: 'Analyze any live privacy policy webpage' },
  { id: 'pdf', label: 'Upload PDF', icon: FileText, description: 'Upload policy document up to 15MB' },
  { id: 'search', label: 'Search App / Site', icon: Search, description: 'Select from popular web services' },
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
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [persona, setPersona] = useState('student');
  const [enableMonitoring, setEnableMonitoring] = useState(true);
  const [error, setError] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedPolicyName, setAnalyzedPolicyName] = useState('Target Policy');
  const [recentPolicies, setRecentPolicies] = useState([]);
  const [createdPolicyId, setCreatedPolicyId] = useState(null);

  useEffect(() => {
    // Fetch user's existing analyzed policies from live database
    const loadRecent = async () => {
      try {
        const res = await getPolicies();
        if (res?.data?.policies) {
          setRecentPolicies(res.data.policies);
        }
      } catch (e) {
        // Not logged in or empty
      }
    };
    if (isAuthenticated) loadRecent();
  }, [isAuthenticated]);

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
        try {
          targetName = new URL(queryUrl).hostname.replace(/^www\./, '');
        } catch (e) {
          targetName = 'Target Policy';
        }
        setAnalyzedPolicyName(targetName);
        handleStartAnalysis(null, queryUrl, queryPersona || persona);
      }
    }
  }, [searchParams, isAuthenticated, navigate]);

  const handleStartAnalysis = async (e, overrideUrl = null, overridePersona = null) => {
    if (e) e.preventDefault();
    setError('');

    const activeUrl = overrideUrl || url;
    const activePer = overridePersona || persona;

    if (!isAuthenticated) {
      navigate(
        `/login?url=${encodeURIComponent(activeUrl)}&persona=${encodeURIComponent(activePer)}&autoAnalyze=true&open=true`
      );
      return;
    }

    let targetName = 'Target Policy';

    if (activeTab === 'url') {
      if (!activeUrl || !activeUrl.trim()) {
        setError('Please enter a valid webpage URL.');
        return;
      }
      if (!activeUrl.startsWith('http://') && !activeUrl.startsWith('https://')) {
        setError('Please enter a URL starting with https:// or http://');
        return;
      }
      try {
        targetName = new URL(activeUrl).hostname.replace(/^www\./, '');
      } catch (err) {
        targetName = 'Target Webpage';
      }
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
    setIsAnalyzing(true);

    try {
      let res;
      if (activeTab === 'pdf') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('role', activePer);
        res = await uploadPolicyPdf(formData);
      } else {
        const targetUrl = activeTab === 'search' ? selectedApp.url : activeUrl;
        res = await analyzePolicy({
          url: targetUrl,
          role: activePer,
          enableMonitoring,
        });
      }

      const policyId = res?.data?.policy?.id || res?.data?.policyId;
      if (policyId) {
        setCreatedPolicyId(policyId);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setIsAnalyzing(false);
      setError(err?.response?.data?.message || err?.message || 'Error executing policy intelligence analysis.');
    }
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    if (createdPolicyId) {
      navigate(`/policy/${createdPolicyId}/summary?persona=${encodeURIComponent(persona)}`);
    } else {
      navigate('/dashboard');
    }
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
              Recently Audited Policies
            </h3>
          </div>
          <span className="text-xs text-text-tertiary">Real-Time Intelligence</span>
        </div>

        {recentPolicies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {recentPolicies.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate(`/policy/${item.id}/summary`);
                }}
                className="p-3 rounded-xl border border-border bg-page-bg/50 hover:bg-card hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors truncate max-w-[120px]">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-text-tertiary">
                      {item.overall_score !== undefined ? `${parseFloat(item.overall_score).toFixed(1)}/10 Score` : 'Audited'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center border border-dashed border-border rounded-xl">
            <p className="text-xs text-text-tertiary">
              No policies analyzed in this session yet. Enter a website URL or drop a PDF above to run your first real-time audit.
            </p>
          </div>
        )}
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
