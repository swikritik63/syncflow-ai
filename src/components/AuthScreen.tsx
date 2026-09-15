'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
} from 'lucide-react';

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface AuthScreenProps {
  onLoginSuccess: (username: string) => void;
  logoutMessage?: string;
}

export function AuthScreen({ onLoginSuccess, logoutMessage }: AuthScreenProps) {
  const [username, setUsername] = useState('demo_creator');
  const [password, setPassword] = useState('shipaton2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter a password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      try {
        localStorage.setItem('bme_current_user', username.trim());
      } catch (err) {
        console.warn('Storage warning:', err);
      }
      onLoginSuccess(username.trim());
    }, 450);
  };

  const handleQuickDemoFill = () => {
    setUsername('demo_creator');
    setPassword('shipaton2026');
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      try {
        localStorage.setItem('bme_current_user', 'demo_creator');
      } catch (err) {
        console.warn('Storage warning:', err);
      }
      onLoginSuccess('demo_creator');
    }, 350);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto no-scrollbar px-6 py-6 text-left select-none animate-in fade-in duration-200">
      <div className="space-y-5">
        {/* Logout message banner if just logged out */}
        {logoutMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{logoutMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="space-y-2 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shipaton 2026 Demo Access</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            business-marketing_engine
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Sign in to access your autonomous viral video deck, calendar scheduling, and RevenueCat paywall.
          </p>
        </div>

        {/* Shared Instagram Demo API Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 space-y-1.5">
          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold">
            <InstagramIcon className="w-4 h-4" />
            <span>Shared Instagram Demo API</span>
          </div>
          <p className="text-[11px] text-neutral-300 leading-normal">
            For demo convenience, all accounts automatically post to the shared Instagram handle{' '}
            <strong className="text-white">@business_marketing_engine</strong> via our live sandbox endpoint.
          </p>
        </div>

        {/* Quick 1-Tap Demo Credentials Card */}
        <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Demo Credentials (Saved)
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">READY</span>
          </div>
          <div className="flex items-center justify-between text-xs bg-neutral-950 p-2.5 rounded-xl border border-neutral-800/80 font-mono">
            <div>
              <span className="text-neutral-500">user: </span>
              <span className="text-white font-bold">demo_creator</span>
            </div>
            <div>
              <span className="text-neutral-500">pass: </span>
              <span className="text-white font-bold">shipaton2026</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            disabled={isLoading}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Tap Demo Login</span>
          </button>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleLogin} className="space-y-3.5 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 block">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. demo_creator"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. shipaton2026"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-10 pr-11 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-rose-400 text-xs font-semibold pt-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-98 transition-all mt-2"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In & Launch'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <p className="text-[10px] text-neutral-500 text-center pt-4">
        Shipaton 2026 Sandbox • Connected to Meta Graph API Mock & RevenueCat
      </p>
    </div>
  );
}
