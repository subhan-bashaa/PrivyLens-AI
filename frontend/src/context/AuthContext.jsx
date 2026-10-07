import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  loginUser,
  registerUser,
  googleLoginUser,
  getCurrentUser,
  forgotPasswordRequest,
  verifyOtpRequest,
  resetPasswordRequest,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('privylens_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('privylens_token'));
  });

  const [isLoading, setIsLoading] = useState(false);

  // Validate token on mount if present
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('privylens_token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      try {
        const res = await getCurrentUser();
        if (res?.data?.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
          localStorage.setItem('privylens_user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        // Token expired or invalid
        localStorage.removeItem('privylens_token');
        localStorage.removeItem('privylens_user');
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkToken();
  }, []);

  const login = useCallback(async (email, password, rememberMe = true) => {
    setIsLoading(true);
    try {
      const res = await loginUser({ email, password });
      const { token, user: loggedUser } = res.data;

      setUser(loggedUser);
      setIsAuthenticated(true);

      if (rememberMe || true) {
        localStorage.setItem('privylens_token', token);
        localStorage.setItem('privylens_user', JSON.stringify(loggedUser));

        // Sync with Chrome Extension storage if available
        if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
          chrome.storage.local.set({ privylens_token: token, privylens_user: loggedUser });
        }
      }

      setIsLoading(false);
      return loggedUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const register = useCallback(async (name, email, password, role = 'student') => {
    setIsLoading(true);
    try {
      const res = await registerUser({ name, email, password, role });
      const { token, user: newUser } = res.data;

      setUser(newUser);
      setIsAuthenticated(true);

      localStorage.setItem('privylens_token', token);
      localStorage.setItem('privylens_user', JSON.stringify(newUser));

      if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
        chrome.storage.local.set({ privylens_token: token, privylens_user: newUser });
      }

      setIsLoading(false);
      return newUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const loginWithGoogle = useCallback(async ({ credential, accessToken, role = 'general' }) => {
    setIsLoading(true);
    try {
      const res = await googleLoginUser({
        credential,
        accessToken,
        role,
      });
      const { token, user: loggedUser } = res.data;

      setUser(loggedUser);
      setIsAuthenticated(true);

      localStorage.setItem('privylens_token', token);
      localStorage.setItem('privylens_user', JSON.stringify(loggedUser));

      if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
        chrome.storage.local.set({ privylens_token: token, privylens_user: loggedUser });
      }

      setIsLoading(false);
      return loggedUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('privylens_token');
    localStorage.removeItem('privylens_user');
    if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
      chrome.storage.local.remove(['privylens_token', 'privylens_user']);
    }
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    setIsLoading(true);
    try {
      const res = await forgotPasswordRequest(email);
      setIsLoading(false);
      return res;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const verifyResetOtp = useCallback(async (email, otp) => {
    setIsLoading(true);
    try {
      const res = await verifyOtpRequest(email, otp);
      setIsLoading(false);
      return res;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const resetPassword = useCallback(async (email, otp, newPassword) => {
    setIsLoading(true);
    try {
      const res = await resetPasswordRequest(email, otp, newPassword);
      setIsLoading(false);
      return res;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
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
    register,
    loginWithGoogle,
    logout,
    requestPasswordReset,
    verifyResetOtp,
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
