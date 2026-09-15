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
  UserPlus,
  LogIn,
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
  onLoginSuccess: (username: string, isNewUser: boolean) => void;
  logoutMessage?: string;
}

export function AuthScreen({ onLoginSuccess, logoutMessage }: AuthScreenProps) {
  const [mode, setMode] = useState<'choose' | 'login' | 'signup'>('choose');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      // Login = existing user, skip onboarding
      onLoginSuccess(username.trim(), false);
    }, 450);
  };

  const handleSignup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Choose a username for your account.');
      return;
    }
    if (!password.trim()) {
      setError('Create a password.');
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
      // Signup = new user, show full onboarding from scratch
      onLoginSuccess(username.trim(), true);
    }, 450);
  };

  const handleQuickDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      try {
        localStorage.setItem('bme_current_user', 'demo_creator');
      } catch (err) {
        console.warn('Storage warning:', err);
      }
      onLoginSuccess('demo_creator', false);
    }, 350);
  };

  // ──── Choose Mode Screen ────
  if (mode === 'choose') {
    return (
      <div className="w-full h-full flex flex-col justify-between overflow-y-auto no-scrollbar px-6 py-6 text-left select-none animate-in fade-in duration-200">
        <div className="space-y-5">
          {/* Logout message banner */}
          {logoutMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{logoutMessage}</span>
            </div>
          )}

          {/* Header */}
          <div className="space-y-3 pt-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight text-center">
              business-marketing
              <br />
              <span className="text-emerald-400">_engine</span>
            </h1>
            <p className="text-sm text-neutral-400 leading-relaxed text-center">
              AI-powered viral video marketing
              <br />
              for any business in seconds
            </p>
          </div>

          {/* Two main CTAs */}
          <div className="space-y-3 pt-3">
            {/* Create New Account — Primary CTA */}
            <button
              onClick={() => {
                setMode('signup');
                setUsername('');
                setPassword('');
                setError('');
              }}
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-sm text-white flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create New Account</span>
            </button>

            <p className="text-[10px] text-neutral-500 text-center">
              Start fresh — set up your business and see the full onboarding flow
            </p>

            {/* Login — Secondary CTA */}
            <button
              onClick={() => {
                setMode('login');
                setUsername('demo_creator');
                setPassword('shipaton2026');
                setError('');
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 font-semibold text-sm text-neutral-200 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
            >
              <LogIn className="w-4 h-4 text-neutral-400" />
              <span>Login with Existing Account</span>
            </button>
          </div>

          {/* Quick Demo Card */}
          <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2.5 mt-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-neutral-300">Judges? Skip straight to the app</span>
            </div>
            <div className="flex items-center justify-between text-xs bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 font-mono">
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
              onClick={handleQuickDemo}
              disabled={isLoading}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Instant 1-Tap Demo Sign In</span>
            </button>
          </div>
        </div>

        {/* Shared Instagram Info */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-neutral-500 text-[10px]">
            <InstagramIcon className="w-3 h-3" />
            <span>All accounts post to <strong className="text-neutral-400">@business_marketing_engine</strong></span>
          </div>
          <p className="text-[10px] text-neutral-600 text-center">
            Shipaton 2026 • Collision: Business × Productivity
          </p>
        </div>
      </div>
    );
  }

  // ──── Login / Signup Form ────
  const isSignup = mode === 'signup';

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto no-scrollbar px-6 py-6 text-left select-none animate-in fade-in duration-200">
      <div className="space-y-5">
        {/* Back button */}
        <button
          onClick={() => setMode('choose')}
          className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            {isSignup ? (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create New Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Welcome Back</span>
              </>
            )}
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            {isSignup ? 'Set up your account' : 'Sign in to your account'}
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {isSignup
              ? "Create your account, then you'll set up your business profile in the next step."
              : 'Sign in to access your viral video deck and scheduled content.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
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
                placeholder={isSignup ? 'Choose a username' : 'e.g. demo_creator'}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-medium"
                autoFocus
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
                placeholder={isSignup ? 'Create a password' : 'e.g. shipaton2026'}
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
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all mt-2"
          >
            <span>
              {isLoading
                ? isSignup
                  ? 'Creating Account...'
                  : 'Signing In...'
                : isSignup
                ? 'Create Account & Start Setup'
                : 'Sign In & Launch'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Switch mode link */}
        <div className="text-center pt-1">
          <button
            onClick={() => {
              setMode(isSignup ? 'login' : 'signup');
              setUsername(isSignup ? 'demo_creator' : '');
              setPassword(isSignup ? 'shipaton2026' : '');
              setError('');
            }}
            className="text-xs text-neutral-400 hover:text-emerald-400 transition-colors"
          >
            {isSignup
              ? 'Already have an account? Sign in'
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>

      <p className="text-[10px] text-neutral-600 text-center pt-4">
        Shipaton 2026 • Collision: Business × Productivity
      </p>
    </div>
  );
}
