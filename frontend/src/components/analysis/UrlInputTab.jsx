import { Globe, X, Sparkles } from 'lucide-react';

const PRESET_POLICIES = [
  { name: 'WhatsApp', url: 'https://www.whatsapp.com/legal/privacy-policy' },
  { name: 'Spotify', url: 'https://www.spotify.com/legal/privacy-policy/' },
  { name: 'OpenAI ChatGPT', url: 'https://openai.com/policies/privacy-policy' },
  { name: 'TikTok', url: 'https://www.tiktok.com/legal/privacy-policy' },
  { name: 'Twitter / X', url: 'https://x.com/en/privacy' },
  { name: 'Netflix', url: 'https://help.netflix.com/legal/privacy' },
];

const UrlInputTab = ({ url, setUrl, error, setError }) => {
  const handlePresetClick = (presetUrl) => {
    setUrl(presetUrl);
    setError('');
  };

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="policy-url" className="block text-xs font-semibold text-text-primary mb-2">
          Privacy Policy Webpage URL
        </label>
        <div className="relative">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-tertiary" />
          <input
            id="policy-url"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            placeholder="https://example.com/privacy-policy"
            className={`
              w-full pl-11 pr-10 py-3 text-sm rounded-xl
              bg-card border text-text-primary placeholder:text-text-tertiary
              focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
              transition-all duration-200
              ${error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border'}
            `}
          />
          {url && (
            <button
              type="button"
              onClick={() => setUrl('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text-tertiary hover:text-text-primary rounded-full hover:bg-card-hover transition-colors cursor-pointer"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-danger mt-1.5 font-medium animate-fade-in">{error}</p>
        )}
      </div>

      {/* Preset Suggestions */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-text-tertiary mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Or choose a popular service to test instantly:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_POLICIES.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handlePresetClick(p.url)}
              className={`
                px-3 py-1.5 text-xs rounded-xl font-medium border transition-all cursor-pointer
                ${
                  url === p.url
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-card text-text-secondary border-border hover:border-primary/40 hover:bg-card-hover hover:text-text-primary'
                }
              `}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UrlInputTab;
