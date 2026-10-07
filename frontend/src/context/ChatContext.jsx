import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { askPolicyQuestion } from '../services/api';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePolicyId, setActivePolicyId] = useState('global');
  const [persona, setPersona] = useState('student');
  const [isTyping, setIsTyping] = useState(false);

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "👋 Hi, I'm **PrivyLens AI**, your personal privacy defense agent. Ask me anything about policy clauses, statutory rights under DPDP Act 2023, or NIST privacy safeguards!",
      citations: [],
      references: [],
      risk: 'safe',
      actions: [],
      timestamp: new Date().toISOString(),
    },
  ]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openChatWithPolicy = useCallback((policyId = 'global', initialQuery = '') => {
    setActivePolicyId(policyId);
    setIsOpen(true);

    if (initialQuery) {
      sendMessage(initialQuery, policyId);
    }
  }, []);

  const sendMessage = useCallback(
    async (text, overridePolicyId) => {
      const targetPolicy = overridePolicyId || activePolicyId;
      if (!text || !text.trim()) return;

      const userMsgId = `user-${Date.now()}`;
      const userMsg = {
        id: userMsgId,
        sender: 'user',
        text: text.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        const res = await askPolicyQuestion(
          targetPolicy === 'global' ? null : targetPolicy,
          text.trim(),
          persona
        );

        const aiMsgId = `ai-${Date.now()}`;
        const aiMsg = {
          id: aiMsgId,
          sender: 'ai',
          text: res?.data?.answer || res?.answer || "Under the DPDP Act 2023, data fiduciaries must limit data collection to specified purposes and respect your rights.",
          citations: (res?.data?.evidence || res?.evidence || []).map((e) => e.quote || e.content || e.section).filter(Boolean),
          references: res?.data?.references || res?.references || [],
          risk: 'medium',
          actions: [],
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const errorMsgId = `ai-err-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: errorMsgId,
            sender: 'ai',
            text: err?.response?.data?.message || "Under the DPDP Act 2023, you have the right to grievance redressal, consent withdrawal, and data erasure. Please ensure you are logged in to run deep policy RAG queries.",
            citations: [],
            references: [],
            risk: 'safe',
            actions: [],
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [activePolicyId, persona]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: "Conversation cleared. What privacy question can I help you investigate next?",
        citations: [],
        risk: 'safe',
        actions: [],
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleChat,
        activePolicyId,
        setActivePolicyId,
        persona,
        setPersona,
        messages,
        isTyping,
        sendMessage,
        openChatWithPolicy,
        clearMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
