import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import AnalyzePolicy from './pages/AnalyzePolicy';
import MyPolicies from './pages/MyPolicies';
import PolicySummary from './pages/PolicySummary';
import PolicyDetails from './pages/PolicyDetails';
import CompareVersions from './pages/CompareVersions';
import Monitoring from './pages/Monitoring';
import Alerts from './pages/Alerts';
import Bookmarks from './pages/Bookmarks';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import HelpSupport from './pages/HelpSupport';

import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <Routes>
              {/* Public Routes — no sidebar/header */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* App Routes — wrapped with sidebar + header layout */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analyze" element={<AnalyzePolicy />} />
                <Route path="/policies" element={<MyPolicies />} />
                <Route path="/policy/:id/summary" element={<PolicySummary />} />
                <Route path="/policy/:id/details" element={<PolicyDetails />} />
                <Route path="/policy/:id/compare" element={<CompareVersions />} />
                <Route path="/compare" element={<CompareVersions />} />
                <Route path="/monitoring" element={<Monitoring />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<HelpSupport />} />
              </Route>
            </Routes>
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
