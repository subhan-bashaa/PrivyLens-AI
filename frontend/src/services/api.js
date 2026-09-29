import axios from 'axios';

// Base API configuration
// During frontend-only development, these functions return mock data.
// Later, switch to real API calls by uncommenting the axios lines.

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('privylens_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// API Service Functions
// Currently return mock data stubs.
// Replace with real API calls when backend is ready.
// ============================================

/** Analyze a privacy policy by URL or text */
export const analyzePolicy = async (input) => {
  // return apiClient.post('/policies/analyze', input);
  return { data: { message: 'Mock: Analysis started' } };
};

/** Get a specific policy by ID */
export const getPolicy = async (policyId) => {
  // return apiClient.get(`/policies/${policyId}`);
  return { data: { id: policyId, name: 'Mock Policy' } };
};

/** Get the AI-generated summary for a policy */
export const getPolicySummary = async (policyId) => {
  // return apiClient.get(`/policies/${policyId}/summary`);
  return { data: { policyId, summary: 'Mock summary' } };
};

/** Get detailed analysis for a policy */
export const getPolicyDetails = async (policyId) => {
  // return apiClient.get(`/policies/${policyId}/details`);
  return { data: { policyId, details: [] } };
};

/** Get evidence/source references for a policy finding */
export const getEvidence = async (policyId, findingId) => {
  // return apiClient.get(`/policies/${policyId}/evidence/${findingId}`);
  return { data: { policyId, findingId, evidence: [] } };
};

/** Ask the AI assistant a question about a policy */
export const askPolicyQuestion = async (policyId, question) => {
  // return apiClient.post(`/policies/${policyId}/ask`, { question });
  return { data: { answer: 'Mock answer', evidence: [] } };
};

/** Get version history for a policy */
export const getVersions = async (policyId) => {
  // return apiClient.get(`/policies/${policyId}/versions`);
  return { data: { versions: [] } };
};

/** Enable or update monitoring for a policy */
export const enableMonitoring = async (policyId, settings) => {
  // return apiClient.post(`/policies/${policyId}/monitoring`, settings);
  return { data: { enabled: true } };
};

/** Get all alerts for the current user */
export const getAlerts = async () => {
  // return apiClient.get('/alerts');
  return { data: { alerts: [] } };
};

/** Get all reports for the current user */
export const getReports = async () => {
  // return apiClient.get('/reports');
  return { data: { reports: [] } };
};

export default apiClient;
