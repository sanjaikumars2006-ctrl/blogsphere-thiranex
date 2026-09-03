import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error, warning } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      warning('Please provide both email and password');
      return;
    }

    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);

    if (ok) {
      navigate(from, { replace: true });
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200/80 dark:border-zinc-800 shadow-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white mx-auto mb-4 shadow-md shadow-indigo-600/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Welcome Back to BlogSphere
          </h1>
          <p className="text-xs text-zinc-500 mt-1.5">
            Sign in to continue writing, commenting, and bookmarking stories.
          </p>
        </div>

        {/* Demo Quick Sign-in Buttons */}
        <div className="mb-6 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            ⚡ Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('alex@blogsphere.dev', 'password123')}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 hover:border-indigo-500 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Alex (Author)</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('sarah@blogsphere.dev', 'password123')}
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600 hover:border-purple-500 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
              <span>Sarah (AI Eng)</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/25 active:scale-98 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create one free
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
