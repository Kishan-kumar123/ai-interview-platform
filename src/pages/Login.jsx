import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Both email and password fields are required.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err) {
      console.error("Login failure:", err);
      setError(err.message || 'Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleShortcut = (shEmail, shPass) => {
    setEmail(shEmail);
    setPassword(shPass);
  };

  return (
    <div className="bg-[#0b0f19] min-h-[90vh] flex items-center justify-center px-4 py-12" id="page-login">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#0f172a]/95 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top brand header logo signifier */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 border border-orange-400 shadow-lg shadow-orange-950/40">
            <span className="font-mono font-extrabold text-lg">&gt;_</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">
            Sign in to Platform
          </h1>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Unlock stateful mock simulations and visual dashboards.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3.5 bg-rose-950/40 border border-rose-900/50 text-rose-300 rounded-xl text-xs mb-5 font-sans animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
              Email Address / Account
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@interviewace.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-[#f97316] focus:bg-slate-950 rounded-xl text-xs font-sans outline-none transition-all placeholder:text-slate-600 text-white"
                id="input-login-email"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-sans">
                Security Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-[#f97316] focus:bg-slate-950 rounded-xl text-xs font-sans outline-none transition-all placeholder:text-slate-600 text-white"
                id="input-login-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#f97316] hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-orange-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-[12px]"
            id="btn-login-submit"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Authenticating Session...</span>
              </span>
            ) : (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-slate-950" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-sans text-slate-400 mt-5">
          First time on the platform?{' '}
          <Link to="/register" className="text-orange-400 hover:text-orange-300 font-bold underline underline-offset-2">
            Register Now
          </Link>
        </p>

        {/* Developer Sandbox credentials shown in Photo 1 */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 font-mono text-[11px] text-slate-400 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
          <h4 className="text-orange-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[10px]">
            <span className="w-1.5 h-1.5 bg-[#f97316] rounded-full"></span>
            Developer Sandbox credentials:
          </h4>
          <div className="space-y-1 text-slate-300">
            <div 
              onClick={() => handleShortcut('admin@interviewace.com', 'admin')}
              className="flex justify-between items-center cursor-pointer hover:bg-slate-900/60 p-1 rounded transition-colors group"
              title="Click to fill credentials"
            >
              <span>• <strong className="text-white">Admin:</strong> admin@interviewace.com</span>
              <span className="text-[10px] text-slate-500 group-hover:text-orange-400">passwd: admin</span>
            </div>
            <div 
              onClick={() => handleShortcut('student@interviewace.com', 'student')}
              className="flex justify-between items-center cursor-pointer hover:bg-slate-900/60 p-1 rounded transition-colors group"
              title="Click to fill credentials"
            >
              <span>• <strong className="text-white">Student:</strong> student@interviewace.com</span>
              <span className="text-[10px] text-slate-500 group-hover:text-orange-400">passwd: student</span>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
