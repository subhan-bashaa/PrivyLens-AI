import { Sparkles } from 'lucide-react';

const STATUTORY_SUGGESTIONS = [
  'What personal data does this service collect and share with third parties?',
  'Can I request complete deletion or correction of my data under DPDP Act 2023?',
  'Does this service track my location or use behavioral advertising cookies?',
  'How is my data protected if a security incident or breach occurs?',
  'Are parental consent and child data protections enforced under DPDP Section 9?',
];

const ChatSuggestions = ({ activePolicyId = 'global', onSelectSuggestion }) => {
  const suggestions = STATUTORY_SUGGESTIONS;

  return (
    <div className="space-y-1.5 p-3 bg-background-subtle/70 rounded-2xl border border-border/80">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-tertiary">
        <Sparkles className="w-3 h-3 text-primary" />
        <span>Suggested Privacy Questions:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectSuggestion(q)}
            className="text-left text-[11px] font-medium text-text-secondary bg-card hover:bg-primary hover:text-white px-2.5 py-1.5 rounded-xl border border-border hover:border-primary transition-all cursor-pointer shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSuggestions;
