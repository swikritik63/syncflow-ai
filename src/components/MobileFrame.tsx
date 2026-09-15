'use client';

import React from 'react';
import { Wifi, BatteryMedium, Sparkles } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  onOpenBusinessModal: () => void;
  businessName: string;
  onOpenPaywall: () => void;
  isPro?: boolean;
  isOnboarded?: boolean;
}

export function MobileFrame({
  children,
  onOpenBusinessModal,
  businessName,
  onOpenPaywall,
  isPro = false,
  isOnboarded = true,
}: MobileFrameProps) {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white flex flex-col items-center justify-center p-0 sm:p-4 select-none">
      {/* Outer Shell container */}
      <div className="relative w-full sm:max-w-[420px] h-screen sm:h-[860px] bg-black sm:rounded-[52px] shadow-2xl sm:border-[10px] sm:border-neutral-900 flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-7 pt-3.5 pb-2 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-auto">
          {/* Left: Clock */}
          <span className="text-xs font-semibold tracking-tight text-neutral-300">
            9:41
          </span>

          {/* Center: Dynamic Island Pill (Only when onboarded) */}
          {isOnboarded ? (
            <button
              onClick={onOpenBusinessModal}
              className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/60 rounded-full shadow-lg transition-all active:scale-95"
              title="Click to edit business profile"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-neutral-200 truncate max-w-[110px]">
                {businessName || 'Brand'}
              </span>
              <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                EDIT
              </span>
            </button>
          ) : (
            <div className="w-20 h-4 bg-neutral-900/80 rounded-full border border-neutral-800/60" />
          )}

          {/* Right: Status Icons + Pro Badge */}
          <div className="flex items-center gap-2">
            {isOnboarded && (
              <button
                onClick={onOpenPaywall}
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 transition-transform active:scale-90 ${
                  isPro
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black'
                    : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                {isPro ? 'PRO' : 'UPGRADE'}
              </button>
            )}
            <Wifi className="w-3.5 h-3.5 text-neutral-400" />
            <BatteryMedium className="w-4 h-4 text-neutral-400" />
          </div>
        </div>

        {/* App Content Area */}
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col pt-10 pb-6">
          {children}
        </div>

        {/* iPhone Bottom Home Bar Indicator */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-700/60 rounded-full pointer-events-none z-50" />
      </div>
    </div>
  );
}
