import { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  Sliders,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { CHAT_SERVICES } from '../../data/mockChatData';
import ChatMessage from './ChatMessage';
import ChatSuggestions from './ChatSuggestions';

const PERSONAS = [
  { id: 'strict', label: 'Strict Guard' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'relaxed', label: 'Permissive' },
];

const ChatDrawer = () => {
  const {
    isOpen,
    setIsOpen,
    activePolicyId,
    setActivePolicyId,
    persona,
    setPersona,
    messages,
    isTyping,
    sendMessage,
    clearMessages,
  } = useChat();

  const [input, setInput] = useState('');
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages or typing state
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput('');
  };

  const handleSelectSuggestion = (query) => {
    sendMessage(query);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
      {/* Dim backdrop on mobile */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto sm:hidden animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Sliding Drawer Container */}
      <div className="pointer-events-auto w-full sm:w-[460px] h-full sm:h-[88vh] sm:my-auto sm:mr-6 bg-card border-l sm:border sm:rounded-3xl border-border shadow-2xl flex flex-col overflow-hidden animate-slide-in-right z-50">
        {/* 1. Header */}
        <div className="p-4 border-b border-border bg-background-subtle/80 flex items-center justify-between gap-3">
          {/* Bot Title & Status */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-extrabold text-text-primary truncate">
                  AI Privacy Agent
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary truncate">
                Interactive Legal & Telemetry Assistant
              </p>
            </div>
          </div>

          {/* Top Actions: Persona toggle, Clear, Close */}
          <div className="flex items-center gap-1">
            {/* Persona sensitivity button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                title="Privacy Persona Sensitivity"
                className="p-1.5 rounded-xl hover:bg-background text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 top-9 w-36 bg-card border border-border rounded-xl shadow-xl p-1.5 z-20 space-y-1 animate-scale-in">
                  <div className="text-[9px] font-bold uppercase tracking-wider text-text-tertiary px-2 py-1">
                    Sensitivity Persona
                  </div>
                  {PERSONAS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPersona(p.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        persona === p.id
                          ? 'bg-primary text-white'
                          : 'text-text-secondary hover:bg-background'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear conversation */}
            <button
              type="button"
              onClick={clearMessages}
              title="Reset conversation"
              className="p-1.5 rounded-xl hover:bg-background text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl hover:bg-background text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Context Policy Bar */}
        <div className="px-4 py-2 bg-background border-b border-border/80 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] font-medium text-text-tertiary flex items-center gap-1 shrink-0">
            <Layers className="w-3 h-3 text-primary" />
            Analyzing:
          </span>

          <select
            value={activePolicyId}
            onChange={(e) => setActivePolicyId(e.target.value)}
            className="bg-card text-xs font-bold text-text-primary border border-border px-2 py-1 rounded-lg focus:outline-hidden cursor-pointer"
          >
            {CHAT_SERVICES.map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.icon} {svc.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onCitationClick={() => setIsOpen(false)}
            />
          ))}

          {/* Typing Indicator Bubble */}
          {isTyping && (
            <div className="flex items-center gap-2.5 text-xs animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-text-tertiary ml-1.5">Analyzing clauses...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 4. Suggestions Chips */}
        {messages.length <= 4 && (
          <div className="px-4 pb-2">
            <ChatSuggestions
              activePolicyId={activePolicyId}
              onSelectSuggestion={handleSelectSuggestion}
            />
          </div>
        )}

        {/* 5. Message Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-background-subtle/70 border-t border-border flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${
              CHAT_SERVICES.find((s) => s.id === activePolicyId)?.name || 'privacy terms'
            }...`}
            className="flex-1 bg-card border border-border rounded-xl px-3.5 py-2.5 text-xs text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`p-2.5 rounded-xl transition-all ${
              input.trim() && !isTyping
                ? 'bg-primary text-white hover:bg-primary-dark shadow-sm cursor-pointer'
                : 'bg-background text-text-tertiary border border-border cursor-not-allowed opacity-50'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatDrawer;
