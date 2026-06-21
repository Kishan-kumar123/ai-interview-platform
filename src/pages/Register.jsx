import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, FileText, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-validation criteria
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please complete all form fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must feature at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Try registering with another email.');
      }

      // Store Auth parameters
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/dashboard');
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || 'Server registration failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0f19] min-h-[90vh] flex items-center justify-center px-4 py-8" id="page-register">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#0f172a]/95 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#f97316] to-[#ea580c] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 border border-orange-400 shadow-lg">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-1">Create Account</h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Join InterviewAce and elevate your interview readiness
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
              Full Name / Identifier
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="kishan kumar"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-[#f97316] focus:bg-slate-950 rounded-xl text-xs font-sans outline-none transition-all placeholder:text-slate-600 text-white"
                id="input-register-name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@interviewace.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-[#f97316] focus:bg-slate-950 rounded-xl text-xs font-sans outline-none transition-all placeholder:text-slate-600 text-white"
                id="input-register-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
              Password (6+ characters)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-[#f97316] focus:bg-slate-950 rounded-xl text-xs font-sans outline-none transition-all placeholder:text-slate-600 text-white"
                id="input-register-password"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 focus:border-[#f97316] focus:bg-slate-950 rounded-xl text-xs font-sans outline-none transition-all placeholder:text-slate-600 text-white"
                id="input-register-confirm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#f97316] hover:bg-orange-600 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-orange-950/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer text-[12px]"
            id="btn-register-submit"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating Account...</span>
              </span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-slate-950" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs font-sans text-slate-400 mt-5">
          Already registered?{' '}
          <Link to="/login" className="text-orange-400 hover:text-orange-300 font-bold underline underline-offset-2">
            Sign In Instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
