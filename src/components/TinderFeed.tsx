'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Check,
  Edit3,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Info,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { MemeTemplate, BusinessProfile } from '@/types';

interface TinderFeedProps {
  memes: MemeTemplate[];
  business: BusinessProfile;
  onApprove: (meme: MemeTemplate) => void;
  scheduledIds: Set<string>;
  onOpenPaywall: () => void;
  onEditBusiness: () => void;
}

export function TinderFeed({
  memes,
  business,
  onApprove,
  scheduledIds,
  onOpenPaywall,
  onEditBusiness,
}: TinderFeedProps) {
  const [deck, setDeck] = useState<MemeTemplate[]>(memes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Modals & Overlays
  const [showRationale, setShowRationale] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [customHooks, setCustomHooks] = useState<Record<string, string>>({});
  const [tempHook, setTempHook] = useState('');

  // Carousel slide index for photo carousel memes
  const [carouselSlide, setCarouselSlide] = useState(0);

  // Touch gesture tracking
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // When business or memes prop update, sync deck
  useEffect(() => {
    setDeck(memes);
    setCurrentIndex(0);
  }, [memes]);

  const activeCard = deck[currentIndex] || null;
  const nextCard = deck[currentIndex + 1] || null;

  // Active hook (customized or default)
  const currentHook = activeCard
    ? customHooks[activeCard.id] || activeCard.hook
    : '';

  // Setup video playback when activeCard changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted before user interaction
      });
      setIsPlaying(true);
    }
    setCarouselSlide(0);
    setShowRationale(false);
  }, [currentIndex, activeCard]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (showEditModal || !activeCard || isAnimating) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleReject();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleApprove();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCard, isAnimating, showEditModal]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleReject = () => {
    if (isAnimating || !activeCard) return;
    setIsAnimating(true);
    setSwipeDirection('left');

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setTouchDeltaX(0);
      setIsAnimating(false);
    }, 280);
  };

  const handleApprove = () => {
    if (isAnimating || !activeCard) return;
    setIsAnimating(true);
    setSwipeDirection('right');

    setTimeout(() => {
      const approvedMeme = {
        ...activeCard,
        hook: currentHook,
      };
      onApprove(approvedMeme);
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setTouchDeltaX(0);
      setIsAnimating(false);
    }, 280);
  };

  const handleOpenEdit = () => {
    if (!activeCard) return;
    setTempHook(currentHook);
    setShowEditModal(true);
  };

  const handleSaveHook = () => {
    if (!activeCard) return;
    setCustomHooks((prev) => ({ ...prev, [activeCard.id]: tempHook }));
    setShowEditModal(false);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || isAnimating) return;
    const delta = e.touches[0].clientX - touchStartX;
    setTouchDeltaX(delta);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || isAnimating) return;
    if (touchDeltaX > 90) {
      handleApprove();
    } else if (touchDeltaX < -90) {
      handleReject();
    } else {
      setTouchDeltaX(0);
    }
    setTouchStartX(null);
  };

  // If all cards swiped
  if (!activeCard) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">You reviewed all viral concepts!</h3>
        <p className="text-xs text-neutral-400 max-w-xs mb-6">
          Great job! All tailored memes for <strong className="text-white">{business.companyName}</strong> have been reviewed.
        </p>
        <div className="flex flex-col gap-2.5 w-full max-w-xs">
          <button
            onClick={() => setCurrentIndex(0)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Review Deck Again</span>
          </button>
          <button
            onClick={onEditBusiness}
            className="w-full py-3 px-4 rounded-2xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 font-semibold text-xs text-neutral-300 transition-all"
          >
            Refine Brand Persona & Questions
          </button>
        </div>
      </div>
    );
  }

  // Calculate dynamic transform based on swipe/drag
  const rotation = touchDeltaX * 0.08;
  const cardStyle: React.CSSProperties = isAnimating && swipeDirection === 'left'
    ? { transform: 'translateX(-130%) rotate(-20deg)', opacity: 0, transition: 'all 280ms ease-out' }
    : isAnimating && swipeDirection === 'right'
    ? { transform: 'translateX(130%) rotate(20deg)', opacity: 0, transition: 'all 280ms ease-out' }
    : touchDeltaX !== 0
    ? { transform: `translateX(${touchDeltaX}px) rotate(${rotation}deg)`, transition: 'none' }
    : { transform: 'translateX(0px) rotate(0deg)', transition: 'transform 200ms ease' };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between pb-4 pt-1 px-3 select-none overflow-hidden">
      {/* Background Card (Depth Effect) */}
      {nextCard && (
        <div
          className="absolute inset-x-5 top-2 bottom-20 rounded-3xl bg-neutral-900 border border-neutral-800/80 overflow-hidden pointer-events-none shadow-lg transform scale-95 translate-y-3 opacity-40 transition-all duration-200"
          style={{ zIndex: 1 }}
        >
          {nextCard.is_carousel ? (
            <img src={nextCard.video_url} alt="Next Card" className="w-full h-full object-cover filter blur-[2px]" />
          ) : (
            <video src={nextCard.video_url} className="w-full h-full object-cover filter blur-[2px]" muted />
          )}
        </div>
      )}

      {/* Active Card Container (9:16 vertical phone aspect) */}
      <div
        className="relative w-full max-w-sm flex-1 rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing"
        style={{ ...cardStyle, zIndex: 10 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={togglePlayPause}
      >
        {/* Media Player: MP4 Video or Photo Carousel */}
        <div className="absolute inset-0 bg-black">
          {activeCard.is_carousel ? (
            <div className="relative w-full h-full">
              <img
                src={activeCard.video_url}
                alt={activeCard.hook}
                className="w-full h-full object-cover"
              />
              {/* Carousel Navigation Arrows */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselSlide((prev) => Math.max(0, prev - 1));
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselSlide((prev) => prev + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={activeCard.video_url}
              className="w-full h-full object-cover"
              loop
              playsInline
              muted={isMuted}
              autoPlay
            />
          )}

          {/* Video Gradient Overlay for Top Text Legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/50 pointer-events-none" />
        </div>

        {/* Swipe Indicators (LIKE / NOPE Stamp) */}
        {touchDeltaX > 40 && (
          <div className="absolute top-16 right-6 border-4 border-emerald-400 text-emerald-400 font-black text-2xl px-4 py-1.5 rounded-2xl rotate-12 uppercase tracking-widest bg-emerald-950/40 backdrop-blur-sm z-30 animate-pulse">
            APPROVE
          </div>
        )}
        {touchDeltaX < -40 && (
          <div className="absolute top-16 left-6 border-4 border-rose-500 text-rose-500 font-black text-2xl px-4 py-1.5 rounded-2xl -rotate-12 uppercase tracking-widest bg-rose-950/40 backdrop-blur-sm z-30 animate-pulse">
            REJECT
          </div>
        )}

        {/* Top Header Bar (Pills & Rationale Toggle) */}
        <div className="relative z-20 flex items-center justify-between p-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Format Badge */}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-neutral-200 border border-white/10 shadow-sm flex items-center gap-1">
              {activeCard.is_carousel ? '📷 Slideshow' : '🎬 Video Meme'}
            </span>

            {/* Category / Model Pill */}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-sm">
              {business.businessModel} • {business.categories?.[0] || 'Viral'}
            </span>

            {/* Deck Counter */}
            <span className="px-2 py-1 rounded-full text-[10px] font-mono text-neutral-300 bg-black/60 backdrop-blur-md border border-white/10">
              {currentIndex + 1}/{deck.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Why This Content? Pill */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRationale(!showRationale);
              }}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-600/70 hover:bg-indigo-600 text-white backdrop-blur-md border border-indigo-400/40 shadow-sm flex items-center gap-1 transition-all active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-indigo-200" />
              <span>Why This?</span>
            </button>

            {/* Sound Toggle */}
            {!activeCard.is_carousel && (
              <button
                onClick={toggleMute}
                className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            )}
          </div>
        </div>

        {/* 'Why This Content?' Expandable Glassmorphism Overlay */}
        {showRationale && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-20 mx-3.5 p-3.5 rounded-2xl bg-neutral-900/90 backdrop-blur-xl border border-indigo-500/30 text-left shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Algorithmic Rationale
                </span>
              </div>
              <button
                onClick={() => setShowRationale(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-neutral-200 leading-relaxed">
              {activeCard.whyRationale || `Taps into viral visual pacing to position ${business.companyName} directly against your audience's biggest pain points.`}
            </p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-neutral-800 text-[10px] text-neutral-400">
              <span>Viral Score: <strong className="text-emerald-400">{activeCard.viralScore || 94}/100</strong></span>
              <span>•</span>
              <span>Matched to: <strong className="text-white">{business.categories?.join(', ')}</strong></span>
            </div>
          </div>
        )}

        {/* TikTok / Instagram Reels Style Floating Hook (ON TOP OF VIDEO, Natural, Breakable, Watchable) */}
        <div className="relative z-20 px-5 pt-2 pb-2 text-center pointer-events-none select-text">
          <p
            className="text-white font-extrabold text-base sm:text-lg leading-snug tracking-tight max-w-[92%] mx-auto whitespace-pre-line"
            style={{
              textShadow:
                '0 2px 5px rgba(0,0,0,0.95), 0 0 16px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,1)',
            }}
          >
            {currentHook}
          </p>
        </div>


        {/* Bottom Area: Clean & Unobstructed for video viewing, only Carousel dots if applicable */}
        <div className="relative z-20 px-4 pb-3 flex items-center justify-center pointer-events-none">
          {activeCard.is_carousel && (
            <div className="flex justify-center gap-1.5 py-1 px-3 rounded-full bg-black/40 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-white" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Dock (Reject ❌, Edit ✏️, Approve ✅) */}
      <div className="w-full max-w-sm flex items-center justify-center gap-5 pt-3 z-20">
        {/* ❌ Reject / Swipe Left Button */}
        <button
          type="button"
          onClick={handleReject}
          disabled={isAnimating}
          aria-label="Reject video"
          className="w-14 h-14 rounded-full bg-neutral-900 border-2 border-rose-500/40 hover:border-rose-500 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 flex items-center justify-center shadow-lg shadow-rose-950/30 transition-all duration-150 active:scale-90 hover:scale-105"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* ✏️ Customize / Edit Hook Button */}
        <button
          type="button"
          onClick={handleOpenEdit}
          disabled={isAnimating}
          aria-label="Edit hook"
          className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center shadow-md transition-all duration-150 active:scale-90 hover:scale-105"
        >
          <Edit3 className="w-5 h-5" />
        </button>

        {/* ✅ Approve / Swipe Right Button */}
        <button
          type="button"
          onClick={handleApprove}
          disabled={isAnimating}
          aria-label="Approve video"
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 border-2 border-emerald-400 hover:from-emerald-500 hover:to-teal-400 text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 transition-all duration-150 active:scale-90 hover:scale-105"
        >
          <Check className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* Keyboard Shortcut Guidance */}
      <div className="flex items-center gap-4 text-[10px] text-neutral-500 pt-2 font-mono">
        <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400">←</kbd> Reject</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400">Space</kbd> Pause</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-400">→</kbd> Approve</span>
      </div>

      {/* Hook Customizer Modal */}
      {showEditModal && activeCard && (
        <div
          onClick={() => setShowEditModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-left shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>Customize Hook & Angle</span>
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Headline Hook
              </label>
              <textarea
                rows={3}
                value={tempHook}
                onChange={(e) => setTempHook(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* AI Alternative Formulas */}
            {activeCard.alternativeHooks?.length > 0 && (
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1.5">
                  Or pick an AI Formula:
                </label>
                <div className="space-y-1.5">
                  {activeCard.alternativeHooks.map((alt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTempHook(alt)}
                      className="w-full text-left p-2 rounded-xl bg-neutral-800/60 hover:bg-neutral-800 border border-neutral-750 text-[11px] text-neutral-300 hover:text-white transition-colors"
                    >
                      &ldquo;{alt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-750"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveHook}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/20"
              >
                Apply Hook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
