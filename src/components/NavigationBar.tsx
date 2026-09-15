'use client';

import React from 'react';
import { Film, CalendarDays, Wand2, Crown } from 'lucide-react';

export type TabType = 'feed' | 'calendar' | 'studio' | 'pro';

interface NavigationBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  scheduledCount?: number;
}

export function NavigationBar({
  activeTab,
  onChangeTab,
  scheduledCount = 0,
}: NavigationBarProps) {
  const tabs = [
    {
      id: 'feed' as TabType,
      label: 'Viral Feed',
      icon: Film,
      badge: null,
    },
    {
      id: 'calendar' as TabType,
      label: 'Calendar',
      icon: CalendarDays,
      badge: scheduledCount > 0 ? scheduledCount : null,
    },
    {
      id: 'studio' as TabType,
      label: 'AI Studio',
      icon: Wand2,
      badge: 'NEW',
    },
    {
      id: 'pro' as TabType,
      label: 'RevenueCat',
      icon: Crown,
      badge: null,
    },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800/80 px-4 py-2 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
              isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <div className="relative">
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 stroke-[2.4px] text-emerald-400' : 'stroke-[1.8px]'
                }`}
              />
              {tab.badge && (
                <span
                  className={`absolute -top-1.5 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-bold leading-none ${
                    tab.badge === 'NEW'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm'
                      : 'bg-emerald-500 text-black shadow-sm'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] mt-1 font-medium tracking-tight ${
                isActive ? 'text-neutral-100 font-semibold' : 'text-neutral-500'
              }`}
            >
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-400" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
