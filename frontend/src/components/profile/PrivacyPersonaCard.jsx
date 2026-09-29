import { useState } from 'react';
import { Shield, Sparkles, Check, Sliders, AlertTriangle } from 'lucide-react';

const PERSONA_PRESETS = [
  {
    id: 'strict',
    name: 'Strict Privacy Guardian',
    icon: '🛡️',
    description: 'Zero-tolerance for biometric collection, AI model training on user media, or cross-app ad sharing.',
    badge: 'Maximum Defense',
    color: 'border-danger/40 bg-danger/5',
  },
  {
    id: 'balanced',
    name: 'Balanced Consumer',
    icon: '⚖️',
    description: 'Permits essential operational analytics while aggressively flagging covert data broker sharing.',
    badge: 'Recommended',
    color: 'border-primary/40 bg-primary/5',
  },
  {
    id: 'developer',
    name: 'Developer / Tech Pro',
    icon: '💻',
    description: 'Permissive of telemetry and API logs; alerts only on extreme data monetization or breach risks.',
    badge: 'Technical',
    color: 'border-blue-500/40 bg-blue-500/5',
  },
];

const PrivacyPersonaCard = ({
  initialPersona = 'balanced',
  onSavePersona,
}) => {
  const [selectedPersona, setSelectedPersona] = useState(initialPersona);
  const [flags, setFlags] = useState({
    aiTraining: true,
    biometricsStrict: selectedPersona === 'strict',
    thirdPartyZeroTolerance: selectedPersona === 'strict',
    maxRetention30Days: selectedPersona === 'strict',
    requireCoppaAudits: true,
  });
  const [savedToast, setSavedToast] = useState(false);

  const handleSelectPreset = (presetId) => {
    setSelectedPersona(presetId);
    if (presetId === 'strict') {
      setFlags({
        aiTraining: true,
        biometricsStrict: true,
        thirdPartyZeroTolerance: true,
        maxRetention30Days: true,
        requireCoppaAudits: true,
      });
    } else if (presetId === 'balanced') {
      setFlags({
        aiTraining: true,
        biometricsStrict: true,
        thirdPartyZeroTolerance: false,
        maxRetention30Days: false,
        requireCoppaAudits: true,
      });
    } else {
      setFlags({
        aiTraining: false,
        biometricsStrict: false,
        thirdPartyZeroTolerance: false,
        maxRetention30Days: false,
        requireCoppaAudits: false,
      });
    }
  };

  const handleToggleFlag = (key) => {
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSavePersona?.({
      persona: selectedPersona,
      privacyFlags: flags,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Privacy Persona & Sensitivity Customizer
            </h2>
            <p className="text-xs text-text-secondary">
              Determines how PrivyLens AI weighs risk scores and flags ambiguous policy clauses
            </p>
          </div>
        </div>

        {savedToast && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 animate-fade-in self-start sm:self-auto">
            <Check className="w-3.5 h-3.5" />
            Persona Preferences Saved!
          </span>
        )}
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {PERSONA_PRESETS.map((preset) => {
          const isSelected = selectedPersona === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? `${preset.color} ring-2 ring-primary/20 shadow-sm`
                  : 'bg-background border-border hover:border-border-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{preset.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card border border-border text-text-tertiary">
                    {preset.badge}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-text-primary mb-1">
                  {preset.name}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-4">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary pt-2 border-t border-border/50">
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Profile</span>
                  </>
                ) : (
                  <span className="text-text-tertiary">Click to activate</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Granular Sensitivity Rules Checklist */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
          Granular Risk Trigger Rules
        </h3>

        <div className="space-y-2 bg-background p-4 rounded-xl border border-border">
          <label className="flex items-center justify-between gap-3 text-xs text-text-secondary cursor-pointer hover:text-text-primary">
            <span>Flag all AI Foundation Model training clauses as Critical</span>
            <input
              type="checkbox"
              checked={flags.aiTraining}
              onChange={() => handleToggleFlag('aiTraining')}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-xs text-text-secondary cursor-pointer hover:text-text-primary pt-2 border-t border-border/50">
            <span>Trigger High-Risk alerts on facial landmark / biometric processing</span>
            <input
              type="checkbox"
              checked={flags.biometricsStrict}
              onChange={() => handleToggleFlag('biometricsStrict')}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-xs text-text-secondary cursor-pointer hover:text-text-primary pt-2 border-t border-border/50">
            <span>Treat cross-app affiliate sharing as direct data selling</span>
            <input
              type="checkbox"
              checked={flags.thirdPartyZeroTolerance}
              onChange={() => handleToggleFlag('thirdPartyZeroTolerance')}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
          </label>

          <label className="flex items-center justify-between gap-3 text-xs text-text-secondary cursor-pointer hover:text-text-primary pt-2 border-t border-border/50">
            <span>Warn on data backup retention exceeding 30 calendar days</span>
            <input
              type="checkbox"
              checked={flags.maxRetention30Days}
              onChange={() => handleToggleFlag('maxRetention30Days')}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Save Persona Sensitivity Rules
        </button>
      </div>
    </div>
  );
};

export default PrivacyPersonaCard;
