import { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  FileBarChart,
  Scale,
  GitCompare,
  FileCode,
  Loader2,
} from 'lucide-react';

const SERVICES = [
  { id: 'instagram', name: 'Instagram', icon: '📸', defaultScore: 4.8, risk: 'High' },
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', defaultScore: 7.2, risk: 'Medium' },
  { id: 'spotify', name: 'Spotify', icon: '🎵', defaultScore: 8.4, risk: 'Low' },
  { id: 'notion', name: 'Notion', icon: '📝', defaultScore: 8.9, risk: 'Low' },
  { id: 'tiktok', name: 'TikTok', icon: '📱', defaultScore: 3.9, risk: 'High' },
];

const REPORT_TYPES = [
  { id: 'executive', name: 'Executive Privacy Brief', icon: FileBarChart, defaultFormat: 'PDF' },
  { id: 'compliance', name: 'Compliance Audit (GDPR/CCPA)', icon: Scale, defaultFormat: 'PDF' },
  { id: 'benchmark', name: 'Competitive Benchmark Matrix', icon: GitCompare, defaultFormat: 'CSV' },
  { id: 'manifest', name: 'Complete Clause Manifest', icon: FileCode, defaultFormat: 'JSON' },
];

const FORMATS = ['PDF', 'CSV', 'JSON'];

const MODULE_OPTIONS = [
  { id: 'trust_score', label: 'Overall Trust Score & Rating', default: true },
  { id: 'category_pillars', label: '6 Category Score Pillars Breakdown', default: true },
  { id: 'red_flags', label: 'Critical Red Flags & Verbatim Clauses', default: true },
  { id: 'compliance_grid', label: 'Statutory Compliance Checkpoints (GDPR, CCPA)', default: true },
  { id: 'user_actions', label: 'Recommended User Defense & Opt-Out Actions', default: true },
];

const GenerateReportModal = ({
  isOpen,
  onClose,
  onCreateReport,
  initialTemplate,
}) => {
  const [selectedService, setSelectedService] = useState('instagram');
  const [selectedType, setSelectedType] = useState(
    initialTemplate?.templateId || 'executive'
  );
  const [selectedFormat, setSelectedFormat] = useState(
    initialTemplate?.format || 'PDF'
  );
  const [includedModules, setIncludedModules] = useState(['trust_score', 'category_pillars', 'red_flags', 'compliance_grid', 'user_actions']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  if (!isOpen) return null;

  const toggleModule = (id) => {
    setIncludedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgressStep(1);

    setTimeout(() => setProgressStep(2), 500);
    setTimeout(() => setProgressStep(3), 1000);
    setTimeout(() => {
      const svc = SERVICES.find((s) => s.id === selectedService) || SERVICES[0];
      const typeObj = REPORT_TYPES.find((t) => t.id === selectedType) || REPORT_TYPES[0];

      const newReport = {
        reportId: `rep-${Date.now().toString().slice(-4)}`,
        title: `${svc.name} Custom ${typeObj.name}`,
        type: selectedType,
        serviceId: svc.id,
        serviceName: svc.name,
        serviceIcon: svc.icon,
        generatedAt: new Date().toISOString(),
        format: selectedFormat,
        fileSize: selectedFormat === 'PDF' ? '2.1 MB' : selectedFormat === 'CSV' ? '650 KB' : '380 KB',
        trustScore: svc.defaultScore,
        riskLevel: svc.risk,
        complianceBadges: ['GDPR: Verified', 'CCPA: Compliant', 'Custom Scope'],
        summary: `Custom generated ${typeObj.name} for ${svc.name}. Evaluated ${includedModules.length} comprehensive privacy modules.`,
        keyFindings: [
          `Overall trust score calculated at ${svc.defaultScore}/10 (${svc.risk} Risk Profile).`,
          `Audited key clauses against active user consent profile.`,
          `Verified statutory opt-out requirements and disclosure timelines.`,
        ],
        sectionsCount: includedModules.length,
        author: 'PrivyLens AI Custom Generator',
      };

      onCreateReport(newReport);
      setIsGenerating(false);
      setProgressStep(0);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={!isGenerating ? onClose : undefined}
      />

      {/* Modal Dialog */}
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl z-10 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Generate Privacy & Compliance Report
              </h2>
              <p className="text-xs text-text-secondary">
                Configure scope, target service, and export format
              </p>
            </div>
          </div>

          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-background transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body / Progress */}
        {isGenerating ? (
          <div className="p-8 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <h3 className="text-base font-bold text-text-primary">
              {progressStep === 1 && 'Ingesting Policy Snapshot...'}
              {progressStep === 2 && 'Synthesizing Compliance Checklist...'}
              {progressStep === 3 && 'Compiling Executive Report Export...'}
            </h3>
            <p className="text-xs text-text-secondary max-w-xs mx-auto">
              Please wait while the PrivyLens AI engine parses verbatim legal clauses and calculates risk telemetry.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* 1. Target Service */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                1. Select Target Service
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SERVICES.map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setSelectedService(svc.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedService === svc.id
                        ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                        : 'border-border bg-background hover:bg-background-hover text-text-secondary'
                    }`}
                  >
                    <span className="text-base">{svc.icon}</span>
                    <span className="text-xs font-bold truncate">{svc.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Report Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                2. Report Template Type
              </label>
              <div className="space-y-2">
                {REPORT_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setSelectedType(type.id);
                        setSelectedFormat(type.defaultFormat);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedType === type.id
                          ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20'
                          : 'border-border bg-background hover:bg-background-hover text-text-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-text-primary">
                          {type.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background-subtle border border-border">
                        {type.defaultFormat}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Export Format */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                3. File Format
              </label>
              <div className="flex items-center gap-2">
                {FORMATS.map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                      selectedFormat === fmt
                        ? 'border-primary bg-primary text-white shadow-xs'
                        : 'border-border bg-background hover:bg-background-hover text-text-secondary'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Included Modules */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
                4. Included Modules & Sections
              </label>
              <div className="space-y-1.5">
                {MODULE_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-background cursor-pointer text-xs text-text-secondary"
                  >
                    <input
                      type="checkbox"
                      checked={includedModules.includes(opt.id)}
                      onChange={() => toggleModule(opt.id)}
                      className="rounded border-border text-primary focus:ring-primary/20"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!isGenerating && (
          <div className="p-4 sm:p-5 bg-background-subtle border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-background transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateReportModal;
