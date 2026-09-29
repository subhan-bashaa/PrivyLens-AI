import { Sparkles } from 'lucide-react';
import { POLICY_SUGGESTIONS } from '../../data/mockChatData';

const ChatSuggestions = ({ activePolicyId = 'global', onSelectSuggestion }) => {
  const suggestions =
    POLICY_SUGGESTIONS[activePolicyId] || POLICY_SUGGESTIONS.global;

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
