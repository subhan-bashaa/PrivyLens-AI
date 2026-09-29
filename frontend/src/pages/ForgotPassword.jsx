import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F8FAFC] text-white overflow-hidden select-none">
      {/* White Background with Cyber Particles & Ambient Glow */}
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

      {/* Card with Breathing Edge Glow */}
      <div className="relative z-20 py-2 animate-popup">
        <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-cyan-500/20 rounded-[34px] blur-xl opacity-75 animate-pulse" />

        <div className="relative bg-[#0B1320]/95 backdrop-blur-2xl rounded-[28px] p-6 sm:p-8 text-white border border-emerald-500/40 animate-edge-glow shadow-2xl shadow-black/90 w-[430px] max-w-[92vw]">
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

          {!submitted ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Reset Password</h2>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  Enter your email address and we'll dispatch a secure recovery link to regain access.
                </p>
              </div>

              {error && (
                <div className="px-4 py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-medium animate-fade-in flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
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
                      Send Reset Instructions
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
          ) : (
            <div className="text-center py-2 space-y-4 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Check Your Inbox</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  We've dispatched recovery instructions to:
                </p>
                <p className="text-sm font-bold text-emerald-400 mt-1">{email}</p>
              </div>
              <p className="text-[11px] text-gray-500">
                Didn't receive an email? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-emerald-400 font-semibold hover:underline cursor-pointer transition-colors"
                >
                  try again
                </button>
                .
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-gray-200 bg-[#070D16] hover:bg-[#101928] border border-gray-800 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Sign In
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
