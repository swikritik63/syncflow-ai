'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ViralTemplate, BusinessProfile } from '@/types';
import { ReelItem } from './ReelItem';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReelFeedProps {
  templates: ViralTemplate[];
  business: BusinessProfile;
  scheduledIds: Set<string>;
  onAddToCalendar: (template: ViralTemplate, hook: string) => void;
}

export function ReelFeed({
  templates,
  business,
  scheduledIds,
  onAddToCalendar,
}: ReelFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Keyboard navigation for power testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        scrollToIndex(currentIndex + 1);
      } else if (e.key === 'ArrowUp') {
        scrollToIndex(currentIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, templates.length]);

  const scrollToIndex = (idx: number) => {
    if (!containerRef.current) return;
    const clamped = Math.max(0, Math.min(templates.length - 1, idx));
    const child = containerRef.current.children[clamped] as HTMLElement;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth' });
      setCurrentIndex(clamped);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const index = Math.round(scrollTop / clientHeight);
    if (index !== currentIndex && index >= 0 && index < templates.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Scrollable Container with Mandatory Snap */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {templates.map((template, idx) => (
          <ReelItem
            key={template.id}
            template={template}
            business={business}
            isActive={idx === currentIndex}
            onAddToCalendar={onAddToCalendar}
            isScheduled={scheduledIds.has(template.id)}
          />
        ))}
      </div>

      {/* Floating Vertical Index Indicator / Quick Skip Arrows */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 bg-black/40 backdrop-blur-md px-1.5 py-2 rounded-full border border-neutral-800 pointer-events-auto">
        <button
          onClick={() => scrollToIndex(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none p-0.5"
          title="Previous Reel"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        <span className="text-[10px] font-mono font-bold text-emerald-400">
          {currentIndex + 1}
        </span>
        <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
        <span className="text-[10px] font-mono text-neutral-400">
          {templates.length}
        </span>

        <button
          onClick={() => scrollToIndex(currentIndex + 1)}
          disabled={currentIndex === templates.length - 1}
          className="text-neutral-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none p-0.5"
          title="Next Reel"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
