import { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, ShieldCheck } from 'lucide-react';

const QUICK_QUESTIONS = [
  'Does this service sell my personal data?',
  'Are my messages and calls encrypted?',
  'Can I permanently delete my account and data?',
  'Does this app track my real-time location?',
];

const AskAiAssistantModal = ({ isOpen, onClose, policy }) => {
  const [messages, setMessages] = useState([
    {
      id: 'init',
      sender: 'ai',
      text: `Hello! I'm your PrivyLens AI Policy Assistant. I've decoded the ${policy.name} (${policy.version || 'latest'}) policy. Ask me anything about their data practices, third-party sharing, or your user rights!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim()) return;

    const userMsg = { id: Date.now().toString(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = '';
      const lower = textToSend.toLowerCase();

      if (lower.includes('sell') || lower.includes('sale')) {
        aiResponse = `Based on Section 4 of ${policy.name}'s policy, they state they do not sell your personal data in the traditional sense. However, interaction telemetry and device identifiers are shared with partner networks and affiliates for ad optimization.`;
      } else if (lower.includes('encrypt') || lower.includes('message')) {
        aiResponse = `${policy.name} uses end-to-end encryption for personal communications (via the Signal protocol). Message contents are not stored on their servers once delivered. However, communication metadata (who, when, frequency) is logged.`;
      } else if (lower.includes('delete') || lower.includes('erasure')) {
        aiResponse = `Yes, you can request account deletion in the app settings. It takes up to 90 days from the beginning of the deletion process to remove your information from backup storage systems.`;
      } else if (lower.includes('location') || lower.includes('track')) {
        aiResponse = `${policy.name} collects approximate location using IP address and network telemetry. Precise GPS location is only gathered when you explicitly use location-sharing features.`;
      } else {
        aiResponse = `Regarding "${textToSend}": ${policy.name}'s privacy policy indicates standard compliance with data protection regulations. The overall Trust Score is ${policy.trustScore}/10 with a ${policy.riskLevel} Risk rating. Review Section 3 in Detailed Clauses for comprehensive legal language.`;
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse },
      ]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-page-bg/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-text-primary flex items-center gap-1.5">
                <span>Ask PrivyLens AI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                  {policy.name}
                </span>
              </h3>
              <p className="text-[11px] text-text-tertiary">Real-time answers extracted from policy text</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-page-bg hover:bg-card-hover border border-border flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[260px] max-h-[380px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                  m.sender === 'user'
                    ? 'bg-primary text-white rounded-br-none shadow-sm'
                    : 'bg-page-bg border border-border text-text-primary rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-text-secondary shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-text-tertiary text-xs pl-9">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
              <span>Analyzing policy text...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 border-t border-border/60 bg-page-bg/40 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-text-tertiary font-medium shrink-0">Try:</span>
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-card hover:bg-primary/10 border border-border hover:border-primary/30 text-text-secondary hover:text-primary transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-border flex items-center gap-2 bg-card"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask anything about ${policy.name}'s policy...`}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-page-bg border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 rounded-xl bg-primary hover:bg-primary-dark text-white disabled:opacity-40 transition-colors cursor-pointer shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskAiAssistantModal;
