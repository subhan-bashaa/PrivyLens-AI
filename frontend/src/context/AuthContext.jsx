import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Mock user for development
export const MOCK_USER = {
  id: '1',
  name: 'Subha',
  email: 'subha@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
  role: 'Student',
  accountType: 'Pro',
  createdAt: '2026-01-15',
  monitoredPoliciesCount: 12,
  reportsCount: 5,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('privylens_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return MOCK_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const token = localStorage.getItem('privylens_token');
      if (token) return true;
      const saved = localStorage.getItem('privylens_user');
      if (saved) return true;
    } catch {
      // fallback
    }
    return true; // default true for developer ease
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email, password, rememberMe = true) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const loggedUser = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
      name: email ? email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : MOCK_USER.name,
    };
    setUser(loggedUser);
    setIsAuthenticated(true);
    if (rememberMe) {
      localStorage.setItem('privylens_token', 'mock-jwt-token');
      localStorage.setItem('privylens_user', JSON.stringify(loggedUser));
    }
    setIsLoading(false);
    return loggedUser;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const googleUser = {
      id: 'g_' + Math.floor(Math.random() * 10000),
      name: 'Subha Mukherjee',
      email: 'subha.google@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role: 'Student',
      accountType: 'Pro',
      createdAt: '2026-02-10',
      monitoredPoliciesCount: 8,
      reportsCount: 3,
    };
    setUser(googleUser);
    setIsAuthenticated(true);
    localStorage.setItem('privylens_token', 'mock-google-token');
    localStorage.setItem('privylens_user', JSON.stringify(googleUser));
    setIsLoading(false);
    return googleUser;
  }, []);

  const register = useCallback(async (name, email, password, role = 'Student') => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser = {
      id: String(Date.now()),
      name,
      email,
      avatar: null,
      role,
      accountType: 'Free',
      createdAt: new Date().toISOString().split('T')[0],
      monitoredPoliciesCount: 0,
      reportsCount: 0,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('privylens_token', 'mock-jwt-token');
    localStorage.setItem('privylens_user', JSON.stringify(newUser));
    setIsLoading(false);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('privylens_token');
    localStorage.removeItem('privylens_user');
  }, []);

  const resetPassword = useCallback(async (email) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    return true;
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('privylens_user', JSON.stringify(next));
      return next;
    });
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
