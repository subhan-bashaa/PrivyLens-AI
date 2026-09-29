import { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';

const STEPS = [
  { id: 1, title: 'Extracting policy content', detail: 'Crawling full legal text & document structure' },
  { id: 2, title: 'Cleaning and processing text', detail: 'Stripping boilerplate, indexing sections & headings' },
  { id: 3, title: 'Identifying privacy clauses & red flags', detail: 'NLP detection of tracking, sharing, & data retention' },
  { id: 4, title: 'Calculating privacy trust score', detail: 'Weighted algorithmic scoring across 6 privacy pillars' },
  { id: 5, title: 'Preparing AI summary & recommendations', detail: 'Generating bullet points & actionable user advice' },
];

const AnalysisProgressModal = ({
  isOpen,
  policyName = 'WhatsApp',
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setProgress(10);
      return;
    }

    // Progression timer sequence
    const timers = [
      setTimeout(() => { setCurrentStep(2); setProgress(30); }, 800),
      setTimeout(() => { setCurrentStep(3); setProgress(55); }, 1800),
      setTimeout(() => { setCurrentStep(4); setProgress(78); }, 2800),
      setTimeout(() => { setCurrentStep(5); setProgress(95); }, 3800),
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
      }, 4600),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isOpen, onComplete]);

  return (
    <Modal isOpen={isOpen} size="md">
      <div className="py-2">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-7 h-7 text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-text-primary">
            Analyzing Privacy Policy
          </h3>
          <p className="text-xs text-text-tertiary mt-1">
            Applying PrivyLens AI NLP analysis to <strong className="text-text-secondary">{policyName}</strong>
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
            <span>Analysis Progress</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-page-bg rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-3 bg-page-bg/60 rounded-2xl p-4 border border-border">
          {STEPS.map((step) => {
            const isFinished = currentStep > step.id || progress === 100;
            const isCurrent = currentStep === step.id && progress < 100;
            const isPending = currentStep < step.id;

            return (
              <div
                key={step.id}
                className={`
                  flex items-start gap-3 transition-opacity duration-300
                  ${isPending ? 'opacity-40' : 'opacity-100'}
                `}
              >
                {/* Step Status Icon */}
                <div className="mt-0.5 shrink-0">
                  {isFinished ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-success animate-fade-in" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4.5 h-4.5 text-primary animate-spin" />
                  ) : (
                    <div className="w-4.5 h-4.5 rounded-full border-2 border-border-light flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-border" />
                    </div>
                  )}
                </div>

                {/* Step Details */}
                <div className="flex-1">
                  <p
                    className={`text-xs font-semibold leading-tight ${
                      isFinished
                        ? 'text-text-primary'
                        : isCurrent
                        ? 'text-primary'
                        : 'text-text-tertiary'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[11px] text-text-tertiary mt-0.5">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Status Pill */}
        <div className="mt-5 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-text-tertiary bg-page-bg border border-border">
            <Sparkles className="w-3 h-3 text-primary animate-spin" />
            Zero human intervention • Encrypted sandbox processing
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default AnalysisProgressModal;
