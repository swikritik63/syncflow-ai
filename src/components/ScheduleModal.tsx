'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  Check,
  Crown,
  ChevronRight,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { MemeTemplate, BusinessProfile, ScheduledPost } from '@/types';
import { downloadICSFile } from '@/lib/calendarExport';
import confetti from 'canvas-confetti';

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  meme: MemeTemplate | null;
  business: BusinessProfile;
  onScheduleSuccess: (newPost: ScheduledPost, autoPostInstagram: boolean) => void;
  onOpenPaywall: () => void;
  isPro: boolean;
  currentScheduledCount: number;
}

const PEAK_TIMES = [
  { label: 'Right Now (Immediate Post)', sub: '⚡ Direct live post to @swikritik483', date: 'Today', time: 'Immediate', delayMins: 0 },
  { label: 'In 5 Minutes (Quick Test)', sub: '⏱️ Automated queue test', date: 'Today', time: 'In 5 mins', delayMins: 5 },
  { label: 'Today, 6:30 PM (Peak)', sub: '🔥 Evening audience surge', date: 'Today', time: '6:30 PM (Peak)', delayMins: 60 },
  { label: 'Tomorrow, 12:15 PM (Lunch)', sub: '📈 Lunch break rush', date: 'Tomorrow', time: '12:15 PM (Lunch)', delayMins: 1440 },
];

export function ScheduleModal({
  isOpen,
  onClose,
  meme,
  business,
  onScheduleSuccess,
  onOpenPaywall,
  isPro,
  currentScheduledCount,
}: ScheduleModalProps) {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [postToInstagram, setPostToInstagram] = useState(true);
  const [editedHook, setEditedHook] = useState(meme?.hook || '');
  const [editedCaption, setEditedCaption] = useState(meme?.caption || '');
  const [downloadedICS, setDownloadedICS] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<{ live: boolean; permalink: string } | null>(null);

  React.useEffect(() => {
    if (meme) {
      setEditedHook(meme.hook);
      setEditedCaption(meme.caption || `Discover ${business.companyName}: ${business.keyBenefits}.\n\nLink in bio! 🚀`);
      setDownloadedICS(false);
      setPublishResult(null);
    }
  }, [meme, business]);

  if (!isOpen || !meme) return null;

  const freeLimitReached = !isPro && currentScheduledCount >= 3;

  const handleConfirm = async (mode: 'calendar' | 'instagram') => {
    if (freeLimitReached) {
      onOpenPaywall();
      return;
    }

    const slot = PEAK_TIMES[selectedSlotIndex];
    const newPost: ScheduledPost = {
      id: `sched_${Date.now()}`,
      templateId: meme.id,
      videoUrl: meme.video_url,
      hook: editedHook || meme.hook,
      caption: editedCaption || meme.caption,
      hashtags: meme.hashtags,
      scheduledDate: slot.date,
      scheduledTime: slot.time,
      status: mode === 'instagram' ? 'published' : 'scheduled',
      viewsForecast: 'Live Queue',
      channel: 'instagram',
    };

    if (mode === 'calendar') {
      downloadICSFile(newPost, business);
      setDownloadedICS(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#3B82F6', '#6366F1'],
      });
      setTimeout(() => {
        onScheduleSuccess(newPost, false);
        onClose();
      }, 700);
    } else {
      setIsPublishing(true);
      try {
        const res = await fetch('/api/instagram/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: localStorage.getItem('bme_current_user') || 'demo_creator',
            post: newPost,
            business,
            scheduleDelayMinutes: slot.delayMins,
          }),
        });
        const data = await res.json();
        if (data.permalink) {
          setPublishResult({ live: data.live_published, permalink: data.permalink });
        }
      } catch (e) {
        console.warn('Instagram publish error:', e);
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E1306C', '#C13584', '#833AB4', '#F56040', '#FCAF45'],
      });

      setTimeout(() => {
        setIsPublishing(false);
        onScheduleSuccess(newPost, true);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Publish & Schedule Reel</h2>
              <p className="text-[11px] text-neutral-400">Connected to Meta Graph API (@swikritik483)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-750 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-left no-scrollbar">
          {/* Card Preview Thumbnail & Hook */}
          <div className="flex gap-3 p-3 bg-neutral-800/60 rounded-2xl border border-neutral-750 items-center">
            <div className="w-16 h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 relative border border-neutral-700">
              {meme.is_carousel ? (
                <img src={meme.video_url} alt="Meme" className="w-full h-full object-cover" />
              ) : (
                <video src={meme.video_url} className="w-full h-full object-cover" muted autoPlay loop playsInline />
              )}
              <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded text-[8px] font-mono text-white">
                {meme.duration}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                Approved Kinetic Hook
              </span>
              <p className="text-xs font-bold text-white line-clamp-2 mt-0.5 whitespace-pre-line">
                &ldquo;{editedHook}&rdquo;
              </p>
              <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                {meme.category}
              </p>
            </div>
          </div>

          {/* Destination Selector: Official Instagram Account */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Publishing Destination
            </label>
            <div
              onClick={() => setPostToInstagram(!postToInstagram)}
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                postToInstagram
                  ? 'bg-pink-500/10 border-pink-500/30 text-white'
                  : 'bg-neutral-800/40 border-neutral-800 text-neutral-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${postToInstagram ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-sm' : 'bg-neutral-800 text-neutral-400'}`}>
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white">Instagram Reels</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      LIVE ACCESS TOKEN
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-300 font-mono">
                    @swikritik483 (Active)
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                  postToInstagram
                    ? 'bg-pink-500 border-pink-500 text-white'
                    : 'border-neutral-600 bg-neutral-800'
                }`}
              >
                {postToInstagram && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          </div>

          {/* Timing Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Choose Posting Time
              </label>
              <span className="text-[10px] text-emerald-400 font-medium">Auto-Publish</span>
            </div>
            <div className="space-y-1.5">
              {PEAK_TIMES.map((slot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSlotIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    selectedSlotIndex === idx
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-neutral-800/40 border-neutral-800/80 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${selectedSlotIndex === idx ? 'text-emerald-400' : 'text-neutral-500'}`} />
                    <div>
                      <p className="text-xs font-bold text-white">{slot.label}</p>
                      <p className="text-[10px] text-neutral-400">{slot.sub}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedSlotIndex === idx ? 'border-emerald-500 bg-emerald-500' : 'border-neutral-600'}`}>
                    {selectedSlotIndex === idx && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Caption & Call To Action with Multi-line Spacing */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-neutral-300 block">
                Caption & Spacing
              </label>
              <span className="text-[10px] text-neutral-400 font-mono">
                {editedCaption.split('\n\n').length} paragraphs
              </span>
            </div>
            <textarea
              rows={6}
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
              placeholder="Write spaced caption..."
              className="w-full bg-neutral-800/90 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-sans leading-relaxed"
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {meme.hashtags.map((tag, i) => (
                <span key={i} className="text-[10px] font-mono bg-neutral-800 text-emerald-400/80 px-2 py-0.5 rounded-md border border-neutral-750">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* RevenueCat Free Tier Limit Banner */}
          {freeLimitReached ? (
            <div
              onClick={onOpenPaywall}
              className="p-3 bg-gradient-to-r from-emerald-500/20 to-teal-600/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-emerald-300">Free Tier Limit (3/3)</p>
                  <p className="text-[10px] text-neutral-300">Upgrade to Pro for unlimited scheduled reels</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="p-2.5 bg-neutral-800/40 rounded-xl border border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                Account: <strong className="text-white">@swikritik483</strong> • {currentScheduledCount} of 3 scheduled
              </span>
              <button
                type="button"
                onClick={onOpenPaywall}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Pro Plan →
              </button>
            </div>
          )}
        </div>

        {/* Footer Action Buttons */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/90 flex gap-2.5">
          <button
            type="button"
            onClick={() => handleConfirm('calendar')}
            className="flex-1 py-3 px-3 rounded-2xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 font-semibold text-xs text-white flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Add to Calendar</span>
          </button>

          <button
            type="button"
            disabled={isPublishing}
            onClick={() => handleConfirm('instagram')}
            className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-pink-600/20 active:scale-95 disabled:opacity-50"
          >
            {isPublishing ? (
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 animate-spin" /> Publishing...
              </span>
            ) : (
              <>
                <InstagramIcon className="w-4 h-4" />
                <span>Post to Instagram</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
