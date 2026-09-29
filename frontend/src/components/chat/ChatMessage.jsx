import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  User,
  ExternalLink,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const RISK_CONFIG = {
  critical: { label: 'Critical Risk', color: 'text-danger bg-danger/10 border-danger/20', icon: ShieldAlert },
  high: { label: 'High Concern', color: 'text-warning bg-warning/10 border-warning/20', icon: AlertTriangle },
  medium: { label: 'Moderate Practice', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: AlertTriangle },
  low: { label: 'Low Risk', color: 'text-info bg-info/10 border-info/20', icon: ShieldCheck },
  safe: { label: 'Verified Safe', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: ShieldCheck },
};

// Simple helper to parse basic markdown bold and list items
const renderFormattedText = (text) => {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Bold replacement
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const formattedLine = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-bold text-text-primary">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (line.trim().startsWith('- ')) {
      return (
        <li key={idx} className="ml-4 list-disc text-text-secondary my-0.5">
          {formattedLine.slice(2)}
        </li>
      );
    }

    return (
      <p key={idx} className={line.trim() === '' ? 'h-2' : 'my-1 leading-relaxed'}>
        {formattedLine}
      </p>
    );
  });
};

const ChatMessage = ({ message, onCitationClick }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const isUser = message.sender === 'user';
  const riskInfo = RISK_CONFIG[message.risk] || RISK_CONFIG.medium;
  const RiskIcon = riskInfo.icon;

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex gap-3 text-xs animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* AI Bot Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5 shadow-xs">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`space-y-2 max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* User Message Bubble */}
        {isUser ? (
          <div className="bg-primary text-white p-3.5 rounded-2xl rounded-tr-xs shadow-sm font-medium leading-relaxed">
            {message.text}
          </div>
        ) : (
          /* AI Response Bubble */
          <div className="bg-card border border-border rounded-2xl rounded-tl-xs p-4 shadow-sm space-y-3">
            {/* Header: Risk Pill */}
            {message.risk && message.risk !== 'safe' && (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${riskInfo.color}`}
                >
                  <RiskIcon className="w-3 h-3" />
                  {riskInfo.label}
                </span>
              </div>
            )}

            {/* Content Text */}
            <div className="text-text-secondary text-xs sm:text-sm">
              {renderFormattedText(message.text)}
            </div>

            {/* Verbatim Citations Pills */}
            {message.citations && message.citations.length > 0 && (
              <div className="pt-2 border-t border-border/60 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
                  Verified Legal Citations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {message.citations.map((cite, idx) => (
                    <Link
                      key={idx}
                      to={cite.link}
                      onClick={onCitationClick}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-background hover:bg-background-hover border border-border text-primary hover:text-primary-dark transition-colors text-[11px] font-medium"
                    >
                      <span className="font-bold">{cite.section}:</span>
                      <span className="truncate max-w-[140px]">{cite.title}</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {message.actions && message.actions.length > 0 && (
              <div className="bg-background-subtle p-2.5 rounded-xl border border-border space-y-1">
                <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Recommended Defense Action:
                </span>
                <ul className="text-[11px] text-text-secondary space-y-0.5 pl-3 list-disc">
                  {message.actions.map((act, idx) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer: Time & Action Tools */}
            <div className="flex items-center justify-between pt-1 text-[10px] text-text-tertiary">
              <span>{formattedTime}</span>

              <div className="flex items-center gap-1">
                {/* Copy */}
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copy response"
                  className="p-1 rounded hover:bg-background text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>

                {/* Helpful */}
                <button
                  type="button"
                  onClick={() => setFeedback('up')}
                  className={`p-1 rounded hover:bg-background transition-colors cursor-pointer ${
                    feedback === 'up' ? 'text-emerald-500' : 'text-text-tertiary hover:text-text-primary'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>

                {/* Unhelpful */}
                <button
                  type="button"
                  onClick={() => setFeedback('down')}
                  className={`p-1 rounded hover:bg-background transition-colors cursor-pointer ${
                    feedback === 'down' ? 'text-danger' : 'text-text-tertiary hover:text-text-primary'
                  }`}
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
