import { useState } from 'react';
import { Search, Shield, Check, ExternalLink } from 'lucide-react';

const INDEXED_SERVICES = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'Messaging & Social',
    url: 'https://www.whatsapp.com/legal/privacy-policy',
    lastChecked: 'March 2026',
    popular: true,
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Music & Streaming',
    url: 'https://www.spotify.com/legal/privacy-policy/',
    lastChecked: 'March 2026',
    popular: true,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social Media',
    url: 'https://help.instagram.com/155833707900388',
    lastChecked: 'March 2026',
    popular: true,
  },
  {
    id: 'zoom',
    name: 'Zoom Video',
    category: 'Video Communications',
    url: 'https://explore.zoom.us/en/privacy/',
    lastChecked: 'Feb 2026',
    popular: false,
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Productivity & Notes',
    url: 'https://www.notion.so/help/privacy-policy',
    lastChecked: 'Feb 2026',
    popular: false,
  },
  {
    id: 'chatgpt',
    name: 'OpenAI ChatGPT',
    category: 'Generative AI',
    url: 'https://openai.com/policies/privacy-policy',
    lastChecked: 'March 2026',
    popular: true,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    category: 'Video & Entertainment',
    url: 'https://www.tiktok.com/legal/privacy-policy',
    lastChecked: 'March 2026',
    popular: true,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'Streaming & Video',
    url: 'https://help.netflix.com/legal/privacy',
    lastChecked: 'Jan 2026',
    popular: false,
  },
];

const AppSearchTab = ({ selectedApp, setSelectedApp, setUrl, setError }) => {
  const [query, setQuery] = useState('');

  const filtered = INDEXED_SERVICES.filter(
    (app) =>
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (app) => {
    setSelectedApp(app);
    setUrl(app.url);
    setError('');
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-tertiary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by app name or industry category (e.g. WhatsApp, Spotify, AI)..."
          className="
            w-full pl-11 pr-4 py-3 text-sm rounded-xl
            bg-card border border-border text-text-primary placeholder:text-text-tertiary
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all duration-200
          "
        />
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
        {filtered.map((app) => {
          const isSelected = selectedApp?.id === app.id;

          return (
            <div
              key={app.id}
              onClick={() => handleSelect(app)}
              className={`
                p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between
                ${
                  isSelected
                    ? 'bg-primary/5 border-primary shadow-sm'
                    : 'bg-card border-border hover:border-primary/40 hover:bg-card-hover'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs
                    ${isSelected ? 'bg-primary text-white' : 'bg-page-bg text-primary border border-border'}
                  `}
                >
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-text-primary">{app.name}</h5>
                  <p className="text-[11px] text-text-tertiary">{app.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="text-[11px] text-primary font-medium hover:underline">
                    Select
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedApp && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between text-xs text-text-secondary animate-fade-in">
          <span>Selected for analysis: <strong>{selectedApp.name}</strong></span>
          <span className="text-[11px] text-primary font-medium">Ready to analyze</span>
        </div>
      )}
    </div>
  );
};

export default AppSearchTab;
