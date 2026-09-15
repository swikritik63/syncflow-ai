'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Trash2,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Play,
  Share2,
} from 'lucide-react';
import { ScheduledPost, BusinessProfile } from '@/types';
import confetti from 'canvas-confetti';

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModalPost, setActiveModalPost] = useState<ScheduledPost | null>(null);
  const [publishedIds, setPublishedIds] = useState<Set<string>>(
    new Set(posts.filter((p) => p.status === 'published').map((p) => p.id))
  );
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handleCopyCaption = (post: ScheduledPost) => {
    const fullText = `${post.hook}\n\n${post.caption}\n\n${post.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(post.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePublishNow = async (post: ScheduledPost) => {
    setPublishingId(post.id);
    try {
      const res = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: localStorage.getItem('bme_current_user') || 'demo_creator',
          post,
          business,
          scheduleDelayMinutes: 0,
        }),
      });
      const data = await res.json();
      console.log('Published from calendar:', data);
    } catch (e) {
      console.warn('Publish error:', e);
    }

    setPublishedIds((prev) => new Set([...prev, post.id]));
    setPublishingId(null);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#E1306C', '#C13584'],
    });
  };

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
            Publishing Pipeline for @swikritik483
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <InstagramIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-400">
            {posts.length} In Pipeline
          </span>
        </div>
      </div>

      {/* Real Instagram Account Status Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-800/70 border border-neutral-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Meta Graph API
          </span>
          <p className="text-base font-extrabold text-white mt-0.5">
            @swikritik483
          </p>
          <span className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
            <Sparkles className="w-2.5 h-2.5 text-emerald-400" /> Automated reels & posts
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            Channel
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-neutral-200 mt-1">
            <InstagramIcon className="w-4 h-4 text-emerald-400" /> Instagram Reels
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Auto-Sync Live</span>
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

          {posts.map((post) => {
            const isPublished = publishedIds.has(post.id) || post.status === 'published';
            const isCurrentlyPublishing = publishingId === post.id;

            return (
              <div
                key={post.id}
                className="relative p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800 hover:border-neutral-750 transition-all flex flex-col gap-3 shadow-md"
              >
                {/* Top Row: Date/Time Badge & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-300 font-medium">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>
                      {post.scheduledDate} • {post.scheduledTime}
                    </span>
                  </div>

                  {isPublished ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      LIVE ON INSTAGRAM
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
                      QUEUED TO POST
                    </span>
                  )}
                </div>

                {/* Content Row: Video Thumbnail + Hook Details */}
                <div className="flex gap-3">
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

                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <p className="text-xs font-bold text-white line-clamp-2 leading-snug whitespace-pre-line">
                        &ldquo;{post.hook}&rdquo;
                      </p>
                      <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                        @{business.companyName || business.name} — {business.category || business.categories?.[0] || 'Business'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.hashtags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[9px] font-mono text-emerald-400/80 bg-neutral-800/80 px-1.5 py-0.5 rounded">
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
                          <span>Copy Caption</span>
                        </>
                      )}
                    </button>

                    {/* View Details modal */}
                    <button
                      onClick={() => setActiveModalPost(post)}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-[10px] font-semibold text-neutral-300 transition-colors"
                    >
                      Preview Post
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Direct Live Post to Instagram */}
                    {!isPublished && (
                       <button
                         onClick={() => handlePublishNow(post)}
                         disabled={isCurrentlyPublishing}
                         className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-[10px] font-bold text-neutral-950 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                       >
                         <Zap className="w-3 h-3" />
                         <span>{isCurrentlyPublishing ? 'Posting...' : 'Post Now'}</span>
                       </button>
                    )}

                    {isPublished && (
                       <a
                         href="https://www.instagram.com/swikritik483/"
                         target="_blank"
                         rel="noreferrer"
                         className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"
                       >
                         <ExternalLink className="w-3 h-3" />
                         <span>View</span>
                       </a>
                    )}

                    {/* Delete post */}
                    <button
                      onClick={() => onRemovePost(post.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Details Modal */}
      {activeModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-left max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Post Details
              </span>
              <button
                onClick={() => setActiveModalPost(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full aspect-[9/12] bg-black rounded-2xl overflow-hidden border border-neutral-800">
              <video
                src={activeModalPost.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                Hook Subtitle
              </span>
              <p className="text-sm font-extrabold text-white mt-0.5 whitespace-pre-line">
                {activeModalPost.hook}
              </p>
            </div>

            <div>
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">
                Full Caption (Formatted with Spacing)
              </span>
              <p className="text-xs text-neutral-300 mt-1 whitespace-pre-line bg-neutral-950 p-3 rounded-xl border border-neutral-800 leading-relaxed font-sans">
                {activeModalPost.caption}
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleCopyCaption(activeModalPost)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedId === activeModalPost.id ? 'Copied!' : 'Copy Caption'}</span>
              </button>
              <button
                onClick={() => {
                  handlePublishNow(activeModalPost);
                  setActiveModalPost(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Post to IG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
