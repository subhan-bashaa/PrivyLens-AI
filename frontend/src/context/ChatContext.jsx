import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generateAiChatResponse } from '../data/mockChatData';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePolicyId, setActivePolicyId] = useState('global');
  const [persona, setPersona] = useState('balanced');
  const [isTyping, setIsTyping] = useState(false);

  // Initial welcome message
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "👋 Hi, I'm **PrivyLens AI**, your personal privacy defense agent. Ask me anything about data sharing, hidden trackers, or statutory rights across any service!",
      citations: [],
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
      // Send query immediately
      sendMessage(initialQuery, policyId);
    }
  }, []);

  const sendMessage = useCallback(
    (text, overridePolicyId) => {
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

      // Simulate AI response delay with typing state
      setTimeout(() => {
        const responseData = generateAiChatResponse(text, targetPolicy, persona);
        const aiMsgId = `ai-${Date.now()}`;

        const aiMsg = {
          id: aiMsgId,
          sender: 'ai',
          text: responseData.text,
          citations: responseData.citations || [],
          risk: responseData.risk || 'medium',
          actions: responseData.actions || [],
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 700);
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
