'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Copy,
  Check,
  TrendingUp,
  Sparkles,
  Trash2,
  ExternalLink,
  Play,
} from 'lucide-react';

const Instagram = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);
import { ScheduledPost, BusinessProfile } from '@/types';
import confetti from 'canvas-confetti';

interface CalendarViewProps {
  posts: ScheduledPost[];
  business: BusinessProfile;
  onRemovePost: (id: string) => void;
  onGoToFeed: () => void;
}

export function CalendarView({
  posts,
  business,
  onRemovePost,
  onGoToFeed,
}: CalendarViewProps) {
  const [activeModalPost, setActiveModalPost] = useState<ScheduledPost | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [publishedIds, setPublishedIds] = useState<Set<string>>(new Set());

  const handleCopyCaption = (post: ScheduledPost) => {
    const fullText = `${post.hook}\n\nCheck out ${business.name}! Link in bio 📲\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePublishInstagram = (post: ScheduledPost) => {
    setActiveModalPost(post);
  };

  const handleConfirmPublish = (post: ScheduledPost) => {
    setPublishedIds((prev) => new Set(prev).add(post.id));
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E1306C', '#C13584', '#833AB4', '#F56040', '#FCAF45'], // Instagram gradient colors
    });
    setTimeout(() => {
      setActiveModalPost(null);
    }, 1800);
  };

  const totalForecastViews = posts.reduce((acc, p) => {
    const num = parseInt(p.viewsForecast.replace(/[^0-9]/g, ''), 10) || 50;
    return acc + num;
  }, 0);

  return (
    <div className="w-full h-full bg-neutral-950 text-white overflow-y-auto p-4 flex flex-col gap-4 pb-20 no-scrollbar">
      {/* Header Banner */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-400" />
            Content Calendar
          </h1>
          <p className="text-xs text-neutral-400">
            Automated Instagram & TikTok Publishing Pipeline
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-400">
            {posts.length} Queued
          </span>
        </div>
      </div>

      {/* Analytics Summary Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-800/70 border border-neutral-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Total Forecast Reach
          </span>
          <p className="text-xl font-extrabold text-emerald-400">
            ~{totalForecastViews}k+ <span className="text-xs font-medium text-neutral-300">views</span>
          </p>
          <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" /> High conversion hooks
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Target Channel
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-neutral-200 mt-1">
            <Instagram className="w-4 h-4 text-pink-500" /> Instagram Reels
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Auto-Sync Active</span>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-neutral-900/40 rounded-2xl border border-dashed border-neutral-800 my-auto">
          <CalendarIcon className="w-12 h-12 text-neutral-600 mb-3" />
          <h3 className="text-sm font-bold text-neutral-200">No Reels Scheduled Yet</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">
            Scroll through the Viral Feed and tap &quot;SCHEDULE&quot; on any hook you want to post.
          </p>
          <button
            onClick={onGoToFeed}
            className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            Explore Viral Feed
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold px-1">
            <span>UPCOMING PIPELINE ({posts.length})</span>
            <span>STATUS</span>
          </div>

          {posts.map((post, index) => {
            const isPublished = publishedIds.has(post.id);

            return (
              <div
                key={post.id}
                className="relative p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700/80 transition-all flex flex-col gap-2.5 shadow-md"
              >
                {/* Top Row: Date/Time Badge & Forecast */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-300 font-medium">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>
                      {post.scheduledDate} • {post.scheduledTime}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-400">
                    Est. {post.viewsForecast}
                  </span>
                </div>

                {/* Content Row: Video Thumbnail + Hook Details */}
                <div className="flex gap-3">
                  {/* Thumbnail / Video */}
                  <div className="relative w-16 h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0 border border-neutral-700">
                    <video
                      src={post.videoUrl}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white/90 fill-white/80" />
                    </div>
                  </div>

                  {/* Hook Text & Hashtags */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        &ldquo;{post.hook}&rdquo;
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                        @{business.name.toLowerCase()} — {business.category || business.categories?.[0] || 'Business'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[9px] font-mono text-neutral-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                  <div className="flex items-center gap-2">
                    {/* Copy Caption */}
                    <button
                      onClick={() => handleCopyCaption(post)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[10px] font-semibold text-neutral-200 transition-colors"
                      title="Copy full caption & hashtags"
                    >
                      {copiedId === post.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => onRemovePost(post.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                      title="Remove from calendar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Publish to Instagram Button */}
                  <button
                    onClick={() => handlePublishInstagram(post)}
                    disabled={isPublished}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold shadow-md transition-all active:scale-95 ${
                      isPublished
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white hover:brightness-110 shadow-pink-500/20'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    {isPublished ? 'Published ✓' : 'Post to IG'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instagram Post Simulator Modal */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-neutral-900 border border-neutral-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Instagram Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold text-white">
                    {business.name.slice(0, 1)}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-bold text-white">
                    {business.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
                  </span>
                  <span className="text-[9px] text-neutral-400 block -mt-0.5">
                    Instagram Reels
                  </span>
                </div>
              </div>
              <Instagram className="w-4 h-4 text-pink-500" />
            </div>

            {/* Video preview in phone ratio */}
            <div className="relative w-full h-[260px] bg-black">
              <video
                src={activeModalPost.videoUrl}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 bg-black/70 backdrop-blur-md rounded-xl text-center">
                <p className="text-xs font-bold text-white">{activeModalPost.hook}</p>
              </div>
            </div>

            {/* Caption & Post Body */}
            <div className="p-3 bg-neutral-950 text-xs flex flex-col gap-1.5">
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                <span className="font-bold text-white mr-1.5">
                  {business.name.toLowerCase()}
                </span>
                {activeModalPost.hook} Link in bio to try it now! 🔥
              </p>
              <p className="text-[10px] text-blue-400 line-clamp-1 font-mono">
                {activeModalPost.hashtags.join(' ')}
              </p>
            </div>

            {/* Actions */}
            <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveModalPost(null)}
                className="px-3 py-1.5 rounded-xl bg-neutral-800 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmPublish(activeModalPost)}
                className="flex-1 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Publish Live Reel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
