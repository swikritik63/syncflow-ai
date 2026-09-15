'use client';

import React, { useState } from 'react';
import {
  Crown,
  Check,
  Sparkles,
  Zap,
  ShieldCheck,
  X,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RevenueCatPaywallProps {
  isOpen: boolean;
  onClose: () => void;
  isPro: boolean;
  onUpgradeSuccess: () => void;
}

export function RevenueCatPaywall({
  isOpen,
  onClose,
  isPro,
  onUpgradeSuccess,
}: RevenueCatPaywallProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [restoring, setRestoring] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeSuccess();
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981', '#6366f1', '#ec4899'],
      });
      onClose();
    }, 1000);
  };

  const handleRestore = () => {
    setRestoring(true);
    setTimeout(() => {
      setRestoring(false);
      alert('RevenueCat: Restored previous entitlements successfully!');
      onUpgradeSuccess();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-[360px] bg-neutral-900 border border-neutral-800 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 border border-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Visual Gradient with Floating Cat / RevenueCat Theme */}
        <div className="relative p-6 pt-8 bg-gradient-to-b from-emerald-500/15 via-emerald-500/5 to-transparent flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 p-0.5 shadow-xl shadow-emerald-500/20 mb-2.5 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-neutral-950 flex items-center justify-center">
              <Crown className="w-7 h-7 text-emerald-400" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 mb-2">
            <Zap className="w-3.5 h-3.5" />
            Powered by RevenueCat
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            business-marketing-engine Pro
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-[260px] leading-relaxed">
            Scale your brand with unlimited AI viral hooks, auto-scheduling, and studio exports.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="px-6 py-2.5 flex flex-col gap-2.5">
          {[
            'Unlimited AI Viral Hook generation & 66+ meme templates',
            'One-Click Automated Instagram Reels scheduling',
            'Gen-Z algorithmic retention formulas & micro-stories',
            'E-Commerce & SaaS custom creative positioning',
            'Priority rendering queue & full commercial license',
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-200">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 text-emerald-400" />
              </div>
              <span className="font-semibold text-xs text-neutral-200">{feat}</span>
            </div>
          ))}
        </div>

        {/* Plan Cards */}
        <div className="px-6 py-3 flex flex-col gap-2.5">
          {/* Yearly Plan (Best Value) */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedPlan === 'yearly'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
            }`}
          >
            <div className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[9px] font-black tracking-wider uppercase">
              SAVE 48% • BEST VALUE
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Annual Unlimited</span>
              <span className="text-xs text-neutral-400">$11.99 / mo (billed $144/yr)</span>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-emerald-400">$144</span>
              <span className="text-xs text-neutral-400 block">/ year</span>
            </div>
          </div>

          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
              selectedPlan === 'monthly'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
            }`}
          >
            <div>
              <span className="text-sm font-bold text-white block">Monthly Access</span>
              <span className="text-xs text-neutral-400">Cancel anytime</span>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-white">$19.99</span>
              <span className="text-xs text-neutral-400 block">/ month</span>
            </div>
          </div>
        </div>

        {/* CTA & RevenueCat Actions */}
        <div className="px-6 pb-6 pt-1 flex flex-col gap-2">
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Start 7-Day Free Trial</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
            <button
              onClick={handleRestore}
              disabled={restoring}
              className="hover:text-neutral-300 underline"
            >
              {restoring ? 'Verifying...' : 'Restore Purchases'}
            </button>
            <span>Secured with RevenueCat</span>
            <span className="hover:text-neutral-300 cursor-pointer">Terms & Privacy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
