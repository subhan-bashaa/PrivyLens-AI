import { useState } from 'react';
import { Moon, Sun, Monitor, Check, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const THEMES = [
  { id: 'dark', label: 'Cyber Emerald Dark', icon: Moon, desc: 'High-contrast dark mode with glowing cyber emerald accents' },
  { id: 'light', label: 'Clean Light', icon: Sun, desc: 'Bright, minimalist layout optimized for day reading' },
  { id: 'system', label: 'System Default', icon: Monitor, desc: 'Synchronizes automatically with your OS display mode' },
];

const GeneralSettingsTab = () => {
  const { theme, setTheme } = useTheme();
  const [defaultView, setDefaultView] = useState('summary');
  const [language, setLanguage] = useState('en');
  const [autoScroll, setAutoScroll] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fade-in">
      {/* 1. Theme Selection */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Interface Appearance & Theme
          </h3>
          <p className="text-xs text-text-secondary">
            Select your preferred visual styling and contrast configuration
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const isSelected = theme === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20 text-primary'
                    : 'border-border bg-background hover:bg-background-hover text-text-secondary'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-4 h-4" />
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
                <div className="text-xs font-bold text-text-primary mb-1">
                  {t.label}
                </div>
                <p className="text-[11px] text-text-tertiary leading-relaxed">
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Analysis & Navigation Defaults */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            Analysis & Workspace Defaults
          </h3>
          <p className="text-xs text-text-secondary">
            Configure how policy summaries and clause explorers initialize
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary">
              Default Landing View After Analysis
            </label>
            <select
              value={defaultView}
              onChange={(e) => setDefaultView(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-text-primary focus:outline-hidden focus:border-primary/50"
            >
              <option value="summary">AI Policy Summary (Executive Scorecard)</option>
              <option value="clauses">Detailed Clauses Inspector (Verbatim Legal Text)</option>
              <option value="compare">Version Diff Comparison</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary">
              Preferred Legal Policy Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl text-text-primary focus:outline-hidden focus:border-primary/50"
            >
              <option value="en">English (US / Global)</option>
              <option value="es">Spanish (Español)</option>
              <option value="fr">French (Français)</option>
              <option value="de">German (Deutsch)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-border/80">
          <label className="flex items-center justify-between gap-3 text-xs text-text-secondary cursor-pointer hover:text-text-primary">
            <span>Automatically smooth-scroll to cited clauses when clicked</span>
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={() => setAutoScroll(!autoScroll)}
              className="rounded border-border text-primary focus:ring-primary/20"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        {savedToast ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            General Settings Saved!
          </span>
        ) : <div />}

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
      </div>
    </form>
  );
};

export default GeneralSettingsTab;
