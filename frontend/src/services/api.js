import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Attach auth token to requests automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('privylens_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// Real Backend API Service Layer
// ============================================

/** Authentication Endpoints */
export const registerUser = async (userData) => {
  const res = await apiClient.post('/auth/register', userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await apiClient.post('/auth/login', credentials);
  return res.data;
};

export const googleLoginUser = async (googleAuthData) => {
  const res = await apiClient.post('/auth/google', googleAuthData);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await apiClient.get('/auth/me');
  return res.data;
};

export const forgotPasswordRequest = async (email) => {
  const res = await apiClient.post('/auth/forgot-password', { email });
  return res.data;
};

export const verifyOtpRequest = async (email, otp) => {
  const res = await apiClient.post('/auth/verify-otp', { email, otp });
  return res.data;
};

export const resetPasswordRequest = async (email, otp, newPassword) => {
  const res = await apiClient.post('/auth/reset-password', { email, otp, newPassword });
  return res.data;
};

/** User Profile & KPI Stats */
export const getUserProfile = async () => {
  const res = await apiClient.get('/users/profile');
  return res.data;
};

export const updateUserProfile = async (profileData) => {
  const res = await apiClient.put('/users/profile', profileData);
  return res.data;
};

export const getUserStats = async () => {
  const res = await apiClient.get('/users/stats');
  return res.data;
};

/** Policy Analysis Endpoints */
export const analyzePolicy = async (input) => {
  const res = await apiClient.post('/policies/analyze', input);
  return res.data;
};

export const uploadPolicyPdf = async (formData) => {
  const res = await apiClient.post('/policies/upload-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getPolicies = async () => {
  const res = await apiClient.get('/policies');
  return res.data;
};

export const getPolicy = async (policyId) => {
  const res = await apiClient.get(`/policies/${policyId}`);
  return res.data;
};

export const getPolicySummary = async (policyId) => {
  const res = await apiClient.get(`/policies/${policyId}/summary`);
  return res.data;
};

export const getPolicyDetails = async (policyId) => {
  const res = await apiClient.get(`/policies/${policyId}/details`);
  return res.data;
};

export const getVersions = async (policyId) => {
  const res = await apiClient.get(`/policies/${policyId}/versions`);
  return res.data;
};

export const compareVersions = async (policyId, fromVer, toVer) => {
  const res = await apiClient.get(`/policies/${policyId}/compare?from=${fromVer || ''}&to=${toVer || ''}`);
  return res.data;
};

export const deletePolicy = async (policyId) => {
  const res = await apiClient.delete(`/policies/${policyId}`);
  return res.data;
};

/** AI Grounded RAG Chat */
export const askPolicyQuestion = async (policyId, question, role = 'general') => {
  const res = await apiClient.post('/ai/chat', { policyId, question, role });
  return res.data;
};

/** Monitoring Endpoints */
export const enableMonitoring = async (policyId, settings = {}) => {
  const res = await apiClient.post('/monitoring/enable', { policyId, ...settings });
  return res.data;
};

export const disableMonitoring = async (policyId) => {
  const res = await apiClient.post('/monitoring/disable', { policyId });
  return res.data;
};

export const getMonitoredPolicies = async () => {
  const res = await apiClient.get('/monitoring');
  return res.data;
};

/** Alerts Endpoints */
export const getAlerts = async () => {
  const res = await apiClient.get('/alerts');
  return res.data;
};

export const markAlertAsRead = async (alertId) => {
  const res = await apiClient.patch(`/alerts/${alertId}/read`);
  return res.data;
};

/** Reports Endpoints */
export const getReports = async () => {
  const res = await apiClient.get('/reports');
  return res.data;
};

export const generateReport = async (policyId) => {
  const res = await apiClient.post(`/reports/${policyId}`);
  return res.data;
};

export default apiClient;
