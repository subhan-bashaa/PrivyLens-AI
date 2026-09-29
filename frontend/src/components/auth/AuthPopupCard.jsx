import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Sparkles,
  X,
  AlertTriangle,
  FileCheck2,
  BellRing,
  LockKeyhole,
  Scale,
  LogIn,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROLES = [
  'Student',
  'Employee',
  'Parent',
  'Business User',
  'Researcher',
  'Privacy Professional',
];

const AuthPopupCard = ({ initialMode = 'login' }) => {
  const { login, register, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // View state:
  // !isOpen -> ONLY Privacy Defense Matter Card is visible
  // isOpen  -> ONLY Login/Register 3D Flip Card is visible
  const searchParams = new URLSearchParams(location.search);
  const targetUrl = searchParams.get('url');
  const incomingPersona = searchParams.get('persona');
  const autoAnalyze = searchParams.get('autoAnalyze') || 'true';
  const shouldOpen = searchParams.get('open') === 'true' || Boolean(targetUrl) || Boolean(incomingPersona);
  const [isOpen, setIsOpen] = useState(shouldOpen);
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  // Map persona string to readable role
  const mappedRole = incomingPersona
    ? (incomingPersona.toLowerCase() === 'business'
        ? 'Business User'
        : incomingPersona.charAt(0).toUpperCase() + incomingPersona.slice(1))
    : 'Student';

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    role: mappedRole,
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, location.pathname]);

  const handleOpenAuth = (newMode) => {
    setMode(newMode);
    setIsOpen(true);
    setError('');
    window.history.replaceState(null, '', newMode === 'login' ? '/login' : '/register');
  };

  const handleBackToMatter = () => {
    setIsOpen(false);
    setError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    window.history.replaceState(null, '', newMode === 'login' ? '/login' : '/register');
  };

  // Demo autofill for quick review
  const handleFillDemo = () => {
    setLoginData({
      email: 'subha@example.com',
      password: 'password123',
    });
    setError('');
  };

  // Password checks for Register
  const passwordChecks = [
    { label: '8+ chars', valid: registerData.password.length >= 8 },
    { label: 'Number', valid: /\d/.test(registerData.password) },
    { label: 'Uppercase', valid: /[A-Z]/.test(registerData.password) },
    { label: 'Symbol', valid: /[^A-Za-z0-9]/.test(registerData.password) },
  ];
  const passedChecksCount = passwordChecks.filter((c) => c.valid).length;
  const strengthPercent = (passedChecksCount / passwordChecks.length) * 100;
  const strengthColor =
    strengthPercent <= 25
      ? 'bg-red-500'
      : strengthPercent <= 50
      ? 'bg-amber-500'
      : strengthPercent <= 75
      ? 'bg-teal-400'
      : 'bg-emerald-500';

  const getDestinationUrl = () => {
    if (targetUrl) {
      return `/analyze?url=${encodeURIComponent(targetUrl)}&persona=${encodeURIComponent(incomingPersona || 'student')}&autoAnalyze=${autoAnalyze}`;
    }
    return searchParams.get('redirect') || '/dashboard';
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setError('Please fill in both email and password.');
      return;
    }
    try {
      await login(loginData.email, loginData.password, rememberMe);
      navigate(getDestinationUrl());
    } catch {
      setError('Invalid email or password.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerData.name || !registerData.email || !registerData.password) {
      setError('Please complete all required fields.');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (passedChecksCount < 2) {
      setError('Please choose a stronger password.');
      return;
    }
    if (!agreed) {
      setError('Please accept the Terms of Service & Privacy Policy.');
      return;
    }
    try {
      await register(registerData.name, registerData.email, registerData.password, registerData.role);
      navigate(getDestinationUrl());
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      navigate(getDestinationUrl());
    } catch {
      setError('Google authentication failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-3 sm:p-6 bg-[#F8FAFC] text-white overflow-x-hidden select-none">
      {/* ========================================================================= */}
      {/* 1. White Background with Cyber Emerald Particle Dot Grid & Ambient Glows  */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cyber Emerald Particle Grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#10B981 1.2px, transparent 1.2px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 left-1/4 w-[550px] h-[550px] bg-emerald-400/15 rounded-full blur-[130px]" />
        <div className="absolute -bottom-24 right-1/4 w-[550px] h-[550px] bg-teal-400/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-400/10 rounded-full blur-[160px]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. CONDITIONAL VIEW DISPLAY                                               */}
      {/*    STATE A (!isOpen): ONLY Privacy Matter Card is visible with buttons    */}
      {/*    STATE B (isOpen):  Matter Card hidden, 3D FLIP CARD visible            */}
      {/* ========================================================================= */}
      {!isOpen ? (
        /* ======================================================================= */
        /* VIEW 1: PRIVACY DEFENSE MATTER CARD (CENTERED INITIALLY)                */
        /* ======================================================================= */
        <div className="relative z-20 w-full max-w-[480px]">
          <div className="bg-[#070D16]/95 backdrop-blur-2xl rounded-[26px] animate-edge-glow p-5 sm:p-7 flex flex-col justify-between shadow-2xl shadow-black/80 relative overflow-hidden">
            {/* Subtle ambient internal glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3.5">
              {/* Top Security Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                <LockKeyhole className="w-3.5 h-3.5" />
                <span>Privacy Defense Intelligence</span>
              </div>

              {/* Headline */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  Know What You Agree To
                  <span className="block text-emerald-400">Before Clicking Accept.</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Companies write 40-page legal policies expecting users to blindly accept. PrivyLens AI decodes them in seconds.
                </p>
              </div>

              {/* 4 Important Instructions List */}
              <div className="space-y-2 pt-0.5">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all duration-200 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">AI Policy Analyzer</h4>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      Paste any terms or privacy policy to get an instant risk assessment (0-100 score).
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all duration-200 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Red Flag & Toxic Clause Alerts</h4>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      Highlights data sales, biometric retention, arbitration clauses, and location tracking.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all duration-200 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Scale className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Version Diff & Sneak Updates</h4>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      Compare before vs after when companies update their policies to reveal hidden changes.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all duration-200 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <BellRing className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Continuous Policy Monitoring</h4>
                    <p className="text-[11px] text-gray-400 leading-snug">
                      Monitor 12+ live services automatically and get notified the instant terms change.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: The Buttons that trigger opening the flip popup */}
            <div className="mt-4 pt-3.5 border-t border-emerald-500/20 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                  Choose Access Mode
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Protection Engine Active
                </span>
              </div>

              {/* The Two Buttons: Clicking either one hides the matter and opens the 3D flip card! */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  id="btn-trigger-login"
                  onClick={() => handleOpenAuth('login')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60 hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-emerald-200" />
                  <span>Sign In / Login</span>
                </button>

                <button
                  type="button"
                  id="btn-trigger-register"
                  onClick={() => handleOpenAuth('register')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#0B1320] text-gray-300 border border-gray-700/80 hover:border-emerald-500/50 hover:text-white hover:bg-white/5 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer shadow-md"
                >
                  <UserPlus className="w-4 h-4 text-teal-400" />
                  <span>Create Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================================= */
        /* VIEW 2: 3D FLIP CARD (SIGN IN <-> CREATE ACCOUNT WITH SMOOTH FLIP)       */
        /* ======================================================================= */
        <div className="relative z-20 w-full max-w-[430px] min-w-0 perspective-1200 mx-auto">
          {/* Ambient Glow behind Popup (Static, no movement) */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 rounded-[32px] blur-xl opacity-60 pointer-events-none" />

          {/* 3D Flip Container: Flips smoothly between 0deg (Login) and 180deg (Register) */}
          <div
            className="relative w-full min-w-0 preserve-3d transition-transform duration-700 ease-out"
            style={{
              transform: mode === 'register' ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* ================================================================= */}
            {/* FACE 1: SIGN IN (FRONT FACE, 0deg)                                */}
            {/* ================================================================= */}
            <div
              className={`w-full min-w-0 bg-[#0B1320]/95 backdrop-blur-2xl rounded-[26px] animate-edge-glow p-4 sm:p-6 shadow-2xl shadow-black/90 flex flex-col justify-between select-none backface-hidden ${
                mode === 'login'
                  ? 'relative z-10 pointer-events-auto'
                  : 'absolute inset-0 pointer-events-none'
              }`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
              }}
            >
              <div>
                {/* Header: Logo, Return to Matter Info, & Close Button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-600/30">
                      <Shield className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <span className="text-base font-black tracking-tight text-white">PrivyLens</span>
                      <span className="text-xs font-bold text-emerald-400 ml-1">AI</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Back to Matter info button */}
                    <button
                      type="button"
                      onClick={handleBackToMatter}
                      title="Back to policy instructions"
                      className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-gray-400 hover:text-emerald-400 transition-all duration-200 cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Info</span>
                    </button>

                    {/* Close button to landing */}
                    <Link
                      to="/"
                      title="Exit to home"
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Flip Tabs Switcher (Triggers 3D Flip) */}
                <div className="flex p-1 bg-[#070D16] border border-emerald-500/20 rounded-2xl mb-3">
                  <button
                    type="button"
                    id="face1-tab-login"
                    className="flex-1 py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60 flex items-center justify-center gap-1.5 cursor-default truncate"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Sign In</span>
                  </button>
                  <button
                    type="button"
                    id="face1-tab-register"
                    onClick={() => switchMode('register')}
                    className="flex-1 py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 truncate"
                  >
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Create Account</span>
                  </button>
                </div>

                {/* Error Banner */}
                {error && mode === 'login' && (
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Target Policy & Persona Banner (Extension Deep-Link) */}
                {targetUrl && (
                  <div className="mb-3 p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-500/40 text-xs text-emerald-300 shadow-lg shadow-black/40">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Personalized Analysis Request</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-bold tracking-wide">
                        {incomingPersona || 'Student'}
                      </span>
                    </div>
                    <div className="text-gray-200 text-[11px] truncate mt-1 font-mono">
                      {targetUrl}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      Sign in to load your tailored AI risk profile and audit this policy.
                    </div>
                  </div>
                )}

                {/* Title & Demo Pill */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Sign In</h2>
                    <p className="text-xs text-gray-400">Access your monitored policies & privacy dashboard.</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-full transition-all duration-200 cursor-pointer shrink-0 shadow-sm hover:scale-105 active:scale-95 group"
                    title="Click to prefill demo credentials"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Demo
                  </button>
                </div>

                {/* Login Form Fields */}
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => {
                          setLoginData({ ...loginData, email: e.target.value });
                          setError('');
                        }}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-all duration-200 hover:translate-x-0.5 cursor-pointer"
                      >
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginData.password}
                        onChange={(e) => {
                          setLoginData({ ...loginData, password: e.target.value });
                          setError('');
                        }}
                        placeholder="Enter your password"
                        className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-0.5 group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-gray-700 text-emerald-600 focus:ring-emerald-500 bg-[#070D16] cursor-pointer transition-transform duration-150 group-hover:scale-110 active:scale-90"
                    />
                    <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">
                      Remember me on this device
                    </span>
                  </label>

                  <button
                    type="submit"
                    id="btn-submit-login"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 group"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Sign In to PrivyLens
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Bottom: Google OAuth & Flip Prompt */}
                <div className="pt-2">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="flex-1 h-px bg-gray-800" />
                    <span className="text-[10px] uppercase font-semibold text-gray-500">or</span>
                    <div className="flex-1 h-px bg-gray-800" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 py-2 px-3 text-xs font-semibold text-gray-200 bg-[#070D16] hover:bg-[#101928] border border-gray-800 hover:border-emerald-500/40 rounded-xl cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group"
                  >
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-3">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer ml-1"
                    >
                      Flip to Create Account →
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* FACE 2: CREATE ACCOUNT (BACK FACE, 180deg)                         */}
            {/* ================================================================= */}
            <div
              className={`w-full min-w-0 bg-[#0B1320]/95 backdrop-blur-2xl rounded-[26px] animate-edge-glow p-4 sm:p-6 shadow-2xl shadow-black/90 flex flex-col justify-between select-none backface-hidden ${
                mode === 'register'
                  ? 'relative z-10 pointer-events-auto'
                  : 'absolute inset-0 pointer-events-none'
              }`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div>
                {/* Header: Logo, Return to Matter Info, & Close Button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-600/30">
                      <Shield className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <span className="text-base font-black tracking-tight text-white">PrivyLens</span>
                      <span className="text-xs font-bold text-emerald-400 ml-1">AI</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Back to Matter info button */}
                    <button
                      type="button"
                      onClick={handleBackToMatter}
                      title="Back to policy instructions"
                      className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-gray-400 hover:text-emerald-400 transition-all duration-200 cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>Info</span>
                    </button>

                    {/* Close button to landing */}
                    <Link
                      to="/"
                      title="Exit to home"
                      className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Flip Tabs Switcher (Triggers 3D Flip) */}
                <div className="flex p-1 bg-[#070D16] border border-emerald-500/20 rounded-2xl mb-3">
                  <button
                    type="button"
                    id="face2-tab-login"
                    onClick={() => switchMode('login')}
                    className="flex-1 py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 truncate"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Sign In</span>
                  </button>
                  <button
                    type="button"
                    id="face2-tab-register"
                    className="flex-1 py-1.5 px-2 text-[11px] sm:text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/60 flex items-center justify-center gap-1.5 cursor-default truncate"
                  >
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Create Account</span>
                  </button>
                </div>

                {/* Error Banner */}
                {error && mode === 'register' && (
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Target Policy & Persona Banner (Extension Deep-Link) */}
                {targetUrl && (
                  <div className="mb-2.5 p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border border-emerald-500/40 text-xs text-emerald-300 shadow-lg shadow-black/40">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-white text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                        <span>Persona Activated: {incomingPersona || 'Student'}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] uppercase font-bold tracking-wide">
                        Ready
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      Creating your account automatically sets your role to{' '}
                      <span className="text-emerald-300 font-bold">{mappedRole}</span>.
                    </div>
                  </div>
                )}

                <div className="mb-2.5">
                  <h2 className="text-xl font-black text-white tracking-tight">Create Free Account</h2>
                  <p className="text-[11px] text-gray-400">Start monitoring policies & privacy changes immediately.</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-2 min-w-0">
                  {/* Row 1: Full Name + Email Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                    <div className="space-y-0.5 min-w-0">
                      <label className="block text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                        Full Name
                      </label>
                      <div className="relative group min-w-0">
                        <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                          type="text"
                          required
                          value={registerData.name}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, name: e.target.value });
                            setError('');
                          }}
                          placeholder="Subha Mukherjee"
                          className="w-full min-w-0 pl-8 pr-2 py-1.5 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <label className="block text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="relative group min-w-0">
                        <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                          type="email"
                          required
                          value={registerData.email}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, email: e.target.value });
                            setError('');
                          }}
                          placeholder="you@example.com"
                          className="w-full min-w-0 pl-8 pr-2 py-1.5 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Role Selector */}
                  <div className="space-y-0.5 min-w-0">
                    <label className="block text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                      Role
                    </label>
                    <select
                      value={registerData.role}
                      onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                      className="w-full min-w-0 px-3 py-1.5 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200 cursor-pointer"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r} className="bg-[#0B1320] text-white">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Row 3: Password + Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                    <div className="space-y-0.5 min-w-0">
                      <label className="block text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative group min-w-0">
                        <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={registerData.password}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, password: e.target.value });
                            setError('');
                          }}
                          placeholder="Create password"
                          className="w-full min-w-0 pl-8 pr-7 py-1.5 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-all active:scale-90 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <label className="block text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <div className="relative group min-w-0">
                        <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={registerData.confirmPassword}
                          onChange={(e) => {
                            setRegisterData({ ...registerData, confirmPassword: e.target.value });
                            setError('');
                          }}
                          placeholder="Repeat password"
                          className="w-full min-w-0 pl-8 pr-7 py-1.5 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-all active:scale-90 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {registerData.password && (
                    <div className="space-y-0.5">
                      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strengthColor} transition-all duration-300`}
                          style={{ width: `${strengthPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Agreement */}
                  <label className="flex items-center gap-2 cursor-pointer pt-0.5 group">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-gray-700 text-emerald-600 focus:ring-emerald-500 bg-[#070D16] cursor-pointer transition-transform duration-150 group-hover:scale-110 active:scale-90"
                    />
                    <span className="text-[11px] text-gray-400 leading-tight group-hover:text-gray-200 transition-colors">
                      I agree to the <span className="text-emerald-400 font-semibold hover:underline">Terms</span> &{' '}
                      <span className="text-emerald-400 font-semibold hover:underline">Privacy Policy</span>.
                    </span>
                  </label>

                  <button
                    type="submit"
                    id="btn-submit-register"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 group mt-1"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Create Free Account
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Bottom: Google OAuth & Flip Prompt */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2.5 py-1.5 px-3 text-xs font-semibold text-gray-200 bg-[#070D16] hover:bg-[#101928] border border-gray-800 hover:border-emerald-500/40 rounded-xl cursor-pointer shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group"
                  >
                    <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                  </button>

                  <p className="text-center text-xs text-gray-400 mt-2">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer ml-1"
                    >
                      Flip to Sign In →
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPopupCard;
