'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  CalendarPlus,
  RefreshCw,
  Volume2,
  VolumeX,
  Music2,
  Sparkles,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ViralTemplate, BusinessProfile } from '@/types';

interface ReelItemProps {
  template: ViralTemplate;
  business: BusinessProfile;
  isActive: boolean;
  onAddToCalendar: (template: ViralTemplate, hook: string) => void;
  isScheduled: boolean;
  onRemixHook?: (templateId: string) => void;
}

export function ReelItem({
  template,
  business,
  isActive,
  onAddToCalendar,
  isScheduled,
}: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likes, setLikes] = useState(Math.floor(12000 + (template.viralScore * 342)));
  const [hasLiked, setHasLiked] = useState(false);
  const [activeHook, setActiveHook] = useState(template.defaultHook);
  const [hookVariant, setHookVariant] = useState(0);

  // Sync video play/pause with active slide
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          // Autoplay blocked fallback
          setIsPlaying(false);
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  // Update hook when template changes
  useEffect(() => {
    setActiveHook(template.defaultHook);
  }, [template.defaultHook]);

  const togglePlay = () => {
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
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleRemix = (e: React.MouseEvent) => {
    e.stopPropagation();
    const hooksPool = [
      `POV: You found the app that ${business.keyBenefit} in 3 seconds.`,
      `Stop doing ${business.painPoint}! Use ${business.name} instead.`,
      `Why is nobody talking about how ${business.name} ${business.keyBenefit}?!`,
      `The #1 secret ${business.targetAudience} use to ${business.keyBenefit}.`,
      `I tested 10 alternatives so you don't have to: ${business.name} wins.`,
      `If you're still struggling with ${business.painPoint}, watch this.`,
    ];

    const nextIdx = (hookVariant + 1) % hooksPool.length;
    setHookVariant(nextIdx);
    setActiveHook(hooksPool[nextIdx]);
  };

  const handleScheduleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCalendar(template, activeHook);

    // Fire confetti for dopamine hook!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#6366f1', '#ec4899', '#f59e0b'],
    });
  };

  return (
    <div
      onClick={togglePlay}
      className="relative w-full h-full snap-start snap-always shrink-0 bg-neutral-900 flex items-center justify-center overflow-hidden cursor-pointer"
    >
      {/* Background Video */}
      <video
        ref={videoRef}
        src={template.videoUrl}
        poster={template.thumbnail}
        loop
        playsInline
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Vignette Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

      {/* Top Banner: Virality Score & Marketing Angle */}
      <div className="absolute top-2 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full border border-emerald-500/40">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-300">
            {template.viralScore}% VIRAL HOOK
          </span>
        </div>
        <div className="px-2 py-0.5 bg-neutral-900/70 backdrop-blur-sm rounded-full border border-neutral-700 text-[10px] font-medium text-neutral-300 uppercase tracking-wider">
          {template.marketingAngle.replace('_', ' ')}
        </div>
      </div>

      {/* CENTER STAGE: Kinetic Subtitle / Hook Typography */}
      <div className="absolute inset-x-4 top-1/3 -translate-y-1/2 z-20 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className="relative max-w-[320px] px-4 py-3 rounded-2xl bg-black/80 backdrop-blur-md border border-neutral-700/80 shadow-2xl transition-all">
          <p className="text-sm sm:text-base font-extrabold text-white leading-snug tracking-tight drop-shadow-md">
            {activeHook}
          </p>
          <div className="mt-1 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
              {business.name} Viral Overlay
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT ACTION BAR: Likes, Calendar Schedule, Remix, Mute */}
      <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group active:scale-75 transition-transform"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              hasLiked
                ? 'bg-rose-500/30 border-rose-500 text-rose-500 shadow-rose-500/40 shadow-lg'
                : 'bg-black/50 border-neutral-700/80 text-white hover:bg-neutral-800/80'
            }`}
          >
            <Heart
              className={`w-5 h-5 ${hasLiked ? 'fill-rose-500 stroke-rose-500' : ''}`}
            />
          </div>
          <span className="text-[10px] font-bold text-neutral-200">
            {(likes / 1000).toFixed(1)}k
          </span>
        </button>

        {/* ADD TO CALENDAR / SCHEDULE CTA (THE CORE ACTION) */}
        <button
          onClick={handleScheduleClick}
          className="flex flex-col items-center gap-1 group active:scale-75 transition-transform"
          title="Schedule to Content Calendar"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isScheduled
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/50 scale-105'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/80 text-emerald-400 animate-pulse'
            }`}
          >
            {isScheduled ? (
              <CheckCircle2 className="w-6 h-6 stroke-[2.5px]" />
            ) : (
              <CalendarPlus className="w-5 h-5 stroke-[2.2px]" />
            )}
          </div>
          <span className="text-[10px] font-extrabold text-emerald-400">
            {isScheduled ? 'ADDED' : 'SCHEDULE'}
          </span>
        </button>

        {/* REMIX HOOK CTA */}
        <button
          onClick={handleRemix}
          className="flex flex-col items-center gap-1 group active:scale-75 transition-transform"
          title="Regenerate viral hook angle"
        >
          <div className="w-10 h-10 rounded-full bg-black/50 border border-neutral-700/80 flex items-center justify-center text-neutral-200 hover:text-white backdrop-blur-md">
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </div>
          <span className="text-[9px] font-medium text-neutral-300">Remix</span>
        </button>

        {/* SOUND MUTE / UNMUTE */}
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-black/50 border border-neutral-700/80 flex items-center justify-center text-neutral-200 hover:text-white backdrop-blur-md active:scale-90 transition-transform"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-neutral-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
        </button>

        {/* ROTATING AUDIO VINYL */}
        <div
          className={`w-9 h-9 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-lg ${
            isPlaying && !isMuted ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '4s' }}
        >
          <Music2 className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* BOTTOM INFO PANEL: Business, Caption, Hashtags & Sound Ticker */}
      <div className="absolute left-4 right-16 bottom-4 z-20 flex flex-col gap-1 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
            @{business.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
          </span>
          <span className="text-[10px] text-neutral-400 font-medium truncate max-w-[150px]">
            {business.category}
          </span>
        </div>

        <p className="text-xs text-neutral-200 line-clamp-2 leading-relaxed">
          {activeHook} Check out {business.name}!{' '}
          <span className="text-emerald-400 font-medium">Link in bio.</span>
        </p>

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mt-0.5">
          {template.hashtags.map((tag, i) => (
            <span key={i} className="text-[10px] font-semibold text-neutral-400 hover:text-white">
              {tag}
            </span>
          ))}
        </div>

        {/* Sound Ticker */}
        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-neutral-400 truncate">
          <Music2 className="w-3 h-3 text-neutral-300" />
          <span className="truncate">{template.soundName} — {template.soundAuthor}</span>
        </div>
      </div>
    </div>
  );
}
