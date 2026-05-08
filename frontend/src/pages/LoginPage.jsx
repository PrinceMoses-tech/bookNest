import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiBook, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [localErr, setLocalErr] = useState('');
  const [showPw, setShowPw]     = useState(false);

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setLocalErr('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setLocalErr('Please fill in all fields.');
      return;
    }
    const ok = await login(form.email, form.password);
    if (ok) {
      toast.success('Welcome back!');
      navigate('/');
    }
  };

  const err = localErr || error;

  return (
    <div className="min-h-screen flex">
      {/* Left – decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30">
            <FiBook className="text-white" size={28} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">BookNest</h2>
          <p className="text-slate-400 max-w-xs leading-relaxed">
            Discover your next favourite book. A curated collection of timeless stories.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-3 max-w-xs mx-auto">
            {['"The more that you read, the more things you will know."',
              '"A reader lives a thousand lives before he dies."']
              .map(q => (
                <div key={q} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-slate-400 italic text-left">
                  {q}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Right – form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          {/* Logo (mobile only) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
              <FiBook className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">BookNest</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Sign in to your account to continue</p>

          {/* Error */}
          {err && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-sm text-red-600 dark:text-red-400 mb-6"
            >
              <FiAlertCircle size={16} className="shrink-0" />
              {err}
            </motion.div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="email" type="email" value={form.email} onChange={handle}
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handle}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
                />
                <button
                  type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : 'Sign in'}
            </motion.button>
          </form>

          <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
