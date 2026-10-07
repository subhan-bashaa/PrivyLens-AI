import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  X,
  KeyRound,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, resetPassword, isLoading } = useAuth();

  // Step 1: 'email' | Step 2: 'otp_password' | Step 3: 'success'
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 4-Digit OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const otpInputRefs = useRef([]);

  // New Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Resend timer
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Handle Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    try {
      const res = await requestPasswordReset(email);
      if (res?.data?.devOtp) {
        setDevOtp(res.data.devOtp);
      }
      setSuccessMsg(res?.message || 'A 4-digit verification code has been dispatched.');
      setStep(2);
      setResendCooldown(60);

      // Focus first OTP input after transitioning
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to send reset code. Please ensure the email is registered.'
      );
    }
  };

  // Handle OTP digit change & auto-advance
  const handleOtpChange = (index, value) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      // Handle paste of multiple characters
      const pasted = cleaned.slice(0, 4).split('');
      pasted.forEach((char, i) => {
        if (i < 4) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 3);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    // Auto advance to next box
    if (cleaned && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace navigation
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste onto any OTP input
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (!pasteData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 4; i++) {
      newDigits[i] = pasteData[i] || '';
    }
    setOtpDigits(newDigits);

    const focusIndex = Math.min(pasteData.length, 3);
    otpInputRefs.current[focusIndex]?.focus();
  };

  // Fill Dev OTP helper
  const handleFillDevOtp = () => {
    if (devOtp && devOtp.length === 4) {
      setOtpDigits(devOtp.split(''));
      setError('');
    }
  };

  // Handle Step 2: Verify OTP & Set New Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');

    if (fullOtp.length !== 4) {
      setError('Please enter the complete 4-digit verification code.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify both inputs.');
      return;
    }

    setError('');

    try {
      await resetPassword(email, fullOtp, newPassword);
      setStep(3);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Password reset failed. Please ensure the code is correct.'
      );
    }
  };

  // Password requirement checks
  const passwordChecks = [
    { label: '8+ chars', valid: newPassword.length >= 8 },
    { label: 'Number', valid: /\d/.test(newPassword) },
    { label: 'Uppercase', valid: /[A-Z]/.test(newPassword) },
    { label: 'Special symbol', valid: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F8FAFC] text-white overflow-hidden select-none">
      {/* 1. White Background with Cyber Particles & Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#10B981 1.2px, transparent 1.2px)`,
            backgroundSize: '28px 28px',
          }}
        />
        <div className="absolute -top-20 left-1/4 w-[550px] h-[550px] bg-emerald-400/15 rounded-full blur-[130px] animate-float-slow" />
        <div className="absolute -bottom-20 right-1/4 w-[550px] h-[550px] bg-teal-400/15 rounded-full blur-[130px] animate-float-reverse" />
      </div>

      {/* 2. Glassmorphism Card */}
      <div className="relative z-20 py-2 animate-popup">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 rounded-[34px] blur-xl opacity-75 animate-pulse" />

        <div className="relative bg-[#0B1320]/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 text-white border border-emerald-500/40 animate-edge-glow shadow-2xl shadow-black/90 w-[450px] max-w-[92vw]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 mt-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:shadow-emerald-600/50 transition-all duration-300">
                <Shield className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white">PrivyLens</span>
                <span className="text-sm font-bold text-emerald-400 ml-1">AI</span>
              </div>
            </Link>

            <Link
              to="/login"
              title="Return to sign in"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110 active:scale-90 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Link>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium animate-fade-in flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{error}</span>
            </div>
          )}

          {/* =================================================================== */}
          {/* STEP 1: Enter Email                                                 */}
          {/* =================================================================== */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Forgot Password?</h2>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Enter your registered email and we'll send a 4-digit verification code to reset your password.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4 pt-1">
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors duration-200" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                      }}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 hover:border-gray-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 group"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send 4-Digit Code
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-400 font-semibold transition-all duration-200 hover:-translate-x-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* STEP 2: Enter 4-Digit OTP & New Password                            */}
          {/* =================================================================== */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white tracking-tight">Enter 4-Digit Code</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError('');
                    }}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium hover:underline cursor-pointer"
                  >
                    Edit Email
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Sent to <span className="text-white font-semibold">{email}</span>. Valid for 10 minutes.
                </p>
              </div>

              {/* Dev Mode OTP Indicator (if available) */}
              {devOtp && (
                <div
                  onClick={handleFillDevOtp}
                  className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition-all text-xs"
                  title="Click to auto-fill this test code"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-gray-300 text-[11px]">Testing code:</span>
                    <span className="font-mono font-bold text-emerald-400 tracking-wider text-sm">{devOtp}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 underline">Auto-fill</span>
                </div>
              )}

              <form onSubmit={handleResetSubmit} className="space-y-4">
                {/* 4-Digit Code Input Boxes */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-semibold text-gray-300 uppercase tracking-wider text-center">
                    4-Digit Verification Code
                  </label>
                  <div className="flex items-center justify-center gap-3 py-1">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength="1"
                        value={otpDigits[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-13 h-14 text-center text-2xl font-black rounded-xl bg-[#070D16] border border-gray-700/80 text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all font-mono shadow-inner hover:border-gray-600"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  {/* Resend Timer */}
                  <div className="flex items-center justify-center gap-1.5 pt-1 text-xs">
                    <span className="text-gray-400 text-[11px]">Didn't receive the code?</span>
                    {resendCooldown > 0 ? (
                      <span className="text-gray-500 text-[11px] font-medium">
                        Resend in {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={isLoading}
                        className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px] hover:underline cursor-pointer inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-[#070D16] border border-gray-700/80 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Pills */}
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  {passwordChecks.map((check, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] transition-colors ${
                        check.valid
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-medium'
                          : 'bg-white/5 text-gray-500 border border-white/5'
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          check.valid ? 'bg-emerald-400' : 'bg-gray-600'
                        }`}
                      />
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>

                {/* Submit Reset */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/50 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 group"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      Reset Password Now
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* =================================================================== */}
          {/* STEP 3: Success Screen                                              */}
          {/* =================================================================== */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Password Reset Complete!</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-xs mx-auto">
                  Your password has been successfully updated. You can now log into your account with your new credentials.
                </p>
              </div>

              <div className="pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  Sign In with New Password
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
