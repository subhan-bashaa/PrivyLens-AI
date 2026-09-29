import { useState } from 'react';
import { Bot, Sparkles, MessageSquare, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const FloatingChatWidget = () => {
  const { isOpen, toggleChat } = useChat();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
      {/* Tooltip on hover */}
      {isHovered && !isOpen && (
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-lg text-xs font-bold text-text-primary animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Ask PrivyLens AI</span>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={toggleChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Open AI Privacy Assistant"
        className={`relative w-13 h-13 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group ${
          isOpen
            ? 'bg-card border border-border text-text-primary hover:bg-background-hover scale-95'
            : 'bg-primary hover:bg-primary-dark text-white shadow-primary/30 hover:scale-105 active:scale-95'
        }`}
      >
        {/* Pulsing indicator ring when closed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary border-2 border-card" />
          </span>
        )}

        {isOpen ? (
          <X className="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" />
        ) : (
          <div className="flex items-center justify-center">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
};

export default FloatingChatWidget;
