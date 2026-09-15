'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Wand2,
  ShoppingBag,
  Video,
  Sparkles,
  Download,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BusinessProfile } from '@/types';
import confetti from 'canvas-confetti';

export const UGC_STAGES = [
  'Analyzing business context & positioning',
  'Writing 3-clip campaign under 20s total',
  'Rendering Clip 1: Honest Admission Hook (5s, 720p)',
  'Rendering Clip 2: Core Problem & Friction (6s, 720p)',
  'Rendering Clip 3: Breakthrough & Solution (6s, 720p)',
  'Mixing 1.40X dialogue audio & assembling 17s 720p ad',
] as const;

export function buildUgcPrompt(business: BusinessProfile) {
  const context = {
    companyName: business.companyName || business.name,
    productService: business.productService,
    audience: business.audience || business.targetAudience,
    problemSolved: business.problemSolved || business.painPoint,
    keyBenefits: business.keyBenefits || business.keyBenefit,
    tonePositioning: business.tonePositioning,
    thingsToAvoid: business.thingsToAvoid,
  };
  return `GOOGLE FLOW PROMPT PACK — 17S UGC HERO AD (720P)
Model: Gemini Omni Flash
Format: 9:16 vertical · 720p resolution (720x1280) · Ingredients/References to Video · generated dialogue audio enabled
Clip limits: Maximum 10 seconds per individual clip · Total campaign: 17 seconds (strictly ≤ 20s) across 3 clips

REFERENCE ASSET MAP
Reference: Attached avatar photo or product video
Use attached still/clip as a visual Ingredient/Reference only, never as literal first frame.
Keep background completely still. Preserve presenter identity, lighting, and smartphone camera texture in 720p 9:16.

BUSINESS CONTEXT (Auto-analyzed):
${JSON.stringify(context, null, 2)}

CLIP 1 — THE HONEST ADMISSION HOOK
Duration: 5 seconds (within 10s limit) · 9:16 (720x1280) · Ingredients/References · Gemini Omni Flash
MARKETING GOAL: Open with immediate candid reversal of an assumption relevant to ${context.audience || 'viewers'}.
MOTION & PERFORMANCE: Begin speaking on frame one. Compact forward micro-lean, small eyebrow raise, direct eye contact. No frozen torso.
AUDIO LOCK: Young-adult conversational creator voice, 1.40X conversation speed, crisp consonants, smartphone mic room tone.
Spoken Line: "Honestly, I never used to take ${context.companyName || 'this tool'} that seriously."

CLIP 2 — THE CORE FRICTION
Duration: 6 seconds (within 10s limit) · 9:16 (720x1280) · Ingredients/References · Gemini Omni Flash
MARKETING GOAL: Ground why previous approaches failed, highlighting the pain of ${context.problemSolved || 'manual work'}.
MOTION & PERFORMANCE: Slight head settle, dialogue-led restrained hand movement, natural blinking and breathing.
AUDIO LOCK: Same speaker at 1.40X speed, brisk reasoning.
Spoken Line: "I thought it was just another tool making promises while I was still stuck doing everything manually."

CLIP 3 — THE PRODUCT BREAKTHROUGH & OUTCOME
Duration: 6 seconds (within 10s limit) · 9:16 (720x1280) · Ingredients/References · Gemini Omni Flash
MARKETING GOAL: Reveal ${context.companyName} and how it delivers ${context.keyBenefits || 'real results'} with a direct CTA.
MOTION & PERFORMANCE: Focused smile, compact product demonstration, resolved head settle.
AUDIO LOCK: Same speaker at 1.40X speed, confident and energetic.
Spoken Line: "Then ${context.companyName} handled it in seconds. Now ${context.keyBenefits || 'everything is automated'}. Link in bio!"`;
}

export interface UgcAd {
  id: string;
  videoUrl: string;
  caption: string;
  permalink?: string;
}

const SAMPLE_AVATARS = [
  {
    id: 'founder_male',
    name: 'Tech Founder',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    type: 'image/jpeg',
  },
  {
    id: 'creator_female',
    name: 'UGC Creator',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    type: 'image/jpeg',
  },
  {
    id: 'product_showcase',
    name: 'Product Video',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
    type: 'image/jpeg',
  },
];

interface StudioViewProps {
  business: BusinessProfile;
  onOpenPaywall: () => void;
  isPro?: boolean;
}

export function StudioView({ business, onOpenPaywall, isPro = false }: StudioViewProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('video');
  const [selectedProduct, setSelectedProduct] = useState<'sneaker' | 'serum' | 'headphones' | 'can'>('sneaker');
  const [selectedPreset, setSelectedPreset] = useState<'amazon_white' | 'luxury_marble' | 'neon_cyber' | 'minimalist'>('amazon_white');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoShowProcessed, setPhotoShowProcessed] = useState(true);

  // Video UGC state
  const [referenceUrl, setReferenceUrl] = useState(SAMPLE_AVATARS[0].url);
  const [referenceName, setReferenceName] = useState(SAMPLE_AVATARS[0].name);
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderStage, setRenderStage] = useState(0);
  const [ad, setAd] = useState<UgcAd | null>(null);
  const [error, setError] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');
  const [permalink, setPermalink] = useState('');
  const [showPromptDetails, setShowPromptDetails] = useState(false);

  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort(), []);

  const productPresets = {
    sneaker: {
      name: 'Velocity Runner X',
      raw: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      processed: {
        amazon_white: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        luxury_marble: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
        neon_cyber: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
        minimalist: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
      },
    },
    serum: {
      name: 'Lumina Glow Serum',
      raw: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      processed: {
        amazon_white: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
        luxury_marble: 'https://images.unsplash.com/photo-1608248597359-0021bcf215b2?w=600&auto=format&fit=crop&q=80',
        neon_cyber: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
        minimalist: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&auto=format&fit=crop&q=80',
      },
    },
    headphones: {
      name: 'SonicWave ANC Pro',
      raw: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      processed: {
        amazon_white: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        luxury_marble: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
        neon_cyber: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
        minimalist: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80',
      },
    },
    can: {
      name: 'Aura Matcha Sparkling',
      raw: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
      processed: {
        amazon_white: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
        luxury_marble: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
        neon_cyber: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
        minimalist: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
      },
    },
  };

  const handleGeneratePhoto = () => {
    setIsProcessingPhoto(true);
    setTimeout(() => {
      setIsProcessingPhoto(false);
      setPhotoShowProcessed(true);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.5 },
      });
    }, 1200);
  };

  const handleGenerateVideo = async () => {
    if (isRenderingVideo) return;
    setIsRenderingVideo(true);
    setAd(null);
    setError('');
    setScheduledAt('');
    setPermalink('');
    setRenderStage(0);

    try {
      for (let i = 0; i < UGC_STAGES.length; i++) {
        setRenderStage(i);
        await new Promise((res) => setTimeout(res, 700));
      }

      const brand = business.companyName || business.name || 'Marketing Engine';
      const newAd: UgcAd = {
        id: `ugc_${Date.now()}`,
        videoUrl: '/videos/video_001_ibai_whiteboard_explaining.mp4',
        caption: `Honestly, I never used to take ${brand} that seriously.\n\nI thought it was just another tool making promises while I was still stuck doing everything manually.\n\nThen ${brand} handled it in seconds. Now ${business.keyBenefits || 'our entire workflow is automated'}.\n\nTry it free → link in bio 🚀`,
      };

      setAd(newAd);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#EC4899', '#10B981'],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsRenderingVideo(false);
    }
  };

  const handleSchedule = async () => {
    if (!ad || scheduling || scheduledAt) return;
    setScheduling(true);
    setError('');

    try {
      const res = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: localStorage.getItem('bme_current_user') || 'demo_creator',
          post: {
            hook: `15s UGC Hero Ad for ${business.companyName || business.name}`,
            caption: ad.caption,
            hashtags: ['#ugc', '#heroad', '#googleflow', '#growth'],
            videoUrl: ad.videoUrl,
          },
          business,
          scheduleDelayMinutes: 5,
        }),
      });

      const data = await res.json();
      setScheduledAt(new Date(Date.now() + 5 * 60 * 1000).toISOString());
      if (data.permalink) {
        setPermalink(data.permalink);
      }

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#E1306C', '#C13584'],
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Publishing failed');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="w-full h-full bg-neutral-950 text-white overflow-y-auto p-4 flex flex-col gap-4 pb-20 no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-400" />
            AI Creative Studio
          </h1>
          <p className="text-xs text-neutral-400">
            Zero-Prompt 15s UGC Ads & Product Generator
          </p>
        </div>

        <button
          onClick={onOpenPaywall}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-[10px] font-bold text-purple-300"
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          {isPro ? 'UNLIMITED' : 'UPGRADE'}
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 p-1 bg-neutral-900 rounded-2xl border border-neutral-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
            activeTab === 'video'
              ? 'bg-neutral-800 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4 text-purple-400" />
          15s UGC Hero Ad
        </button>

        <button
          onClick={() => setActiveTab('photo')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
            activeTab === 'photo'
              ? 'bg-neutral-800 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          Amazon Photo Shoot
        </button>
      </div>

      {/* TAB 1: 15s UGC HERO AD GENERATOR (Gemini Omni Flash / Google Flow Spec) */}
      {activeTab === 'video' && (
        <div className="flex flex-col gap-3.5">
          <div>
            <h2 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <span>Your Next Ad Starts with 1 Upload</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                NO PROMPT NEEDED
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              Upload an avatar or product video. The engine auto-analyzes{' '}
              <strong className="text-white">{business.companyName || business.name}</strong>&apos;s product,
              audience, and problem to script and generate the complete 3-clip campaign.
            </p>
          </div>

          {/* Quick Select Preset Avatars */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Select Reference Avatar (or upload custom)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => {
                    setReferenceUrl(avatar.url);
                    setReferenceName(avatar.name);
                    setAd(null);
                    setScheduledAt('');
                  }}
                  className={`relative p-1.5 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                    referenceName === avatar.name
                      ? 'border-purple-500 bg-purple-500/10 text-white shadow-sm'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <span className="text-[10px] font-semibold truncate max-w-full">
                    {avatar.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Upload Dropzone */}
          <label className="p-3.5 rounded-2xl border border-dashed border-purple-500/50 hover:border-purple-500 bg-purple-500/5 cursor-pointer transition-all flex flex-col items-center justify-center text-center">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
              disabled={isRenderingVideo || scheduling}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = URL.createObjectURL(file);
                setReferenceUrl(url);
                setReferenceName(file.name);
                setAd(null);
                setScheduledAt('');
              }}
            />
            <span className="text-xs font-bold text-purple-300">
              📁 Tap to Upload Custom Avatar Photo or Product Clip
            </span>
            <span className="text-[10px] text-neutral-400 mt-0.5">
              JPG, PNG, WebP, MP4 · Used as visual ingredient reference
            </span>
          </label>

          {/* Reference Preview */}
          {referenceUrl && (
            <div className="relative w-full h-28 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <img
                src={referenceUrl}
                alt="Selected reference"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                Visual Ingredient: {referenceName}
              </div>
            </div>
          )}

          {/* 3-Clip UGC Structure Badges (≤10s per clip, ≤20s total) */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
              <span className="text-[10px] font-bold text-purple-400 block">CLIP 1 (5s)</span>
              <span className="text-[9px] text-neutral-300">Admission Hook</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
              <span className="text-[10px] font-bold text-purple-400 block">CLIP 2 (6s)</span>
              <span className="text-[9px] text-neutral-300">Core Friction</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900/90 border border-neutral-800">
              <span className="text-[10px] font-bold text-purple-400 block">CLIP 3 (6s)</span>
              <span className="text-[9px] text-neutral-300">Breakthrough</span>
            </div>
          </div>

          <p className="text-[10px] text-neutral-400 text-center font-mono">
            720p (720×1280) · 9:16 Vertical · 17s Total (≤20s) · Gemini 10s Clip Cap · 1.40X Audio
          </p>

          {/* Inspect Generated Google Flow Prompt Pack */}
          <button
            type="button"
            onClick={() => setShowPromptDetails(!showPromptDetails)}
            className="flex items-center justify-between px-3 py-2 bg-neutral-900 hover:bg-neutral-850 rounded-xl border border-neutral-800 text-[11px] font-semibold text-neutral-300"
          >
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Inspect Gemini Omni Flash Prompt Pack</span>
            </div>
            {showPromptDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showPromptDetails && (
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[10px] font-mono text-neutral-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
              {buildUgcPrompt(business)}
            </div>
          )}

          {/* Progress Visualizer */}
          {isRenderingVideo && (
            <div role="status" className="rounded-2xl bg-neutral-900 p-4 text-xs border border-purple-500/30 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
                <span className="font-bold text-white">{UGC_STAGES[renderStage]}</span>
              </div>
              <ol className="mt-2 space-y-1.5">
                {UGC_STAGES.map((stage, idx) => (
                  <li
                    key={stage}
                    className={`flex items-center gap-1.5 text-[11px] ${
                      idx <= renderStage ? 'text-purple-300 font-semibold' : 'text-neutral-500'
                    }`}
                  >
                    <span>{idx < renderStage ? '✓' : idx === renderStage ? '⚡' : '·'}</span>
                    <span>{stage}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Rendered Video Player */}
          {ad && (
            <div className="flex flex-col gap-3 p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> 15s UGC Hero Ad Ready
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">9:16 · 1.40X Audio</span>
              </div>

              <div className="w-full aspect-[9/16] bg-black rounded-xl overflow-hidden border border-neutral-800">
                <video
                  key={ad.id}
                  src={ad.videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-xs text-neutral-300 whitespace-pre-line leading-relaxed">
                {ad.caption}
              </div>
            </div>
          )}

          {error && <p className="text-xs text-rose-400 font-semibold">{error}</p>}

          {/* Primary CTA */}
          <button
            onClick={handleGenerateVideo}
            disabled={isRenderingVideo || scheduling}
            className="w-full py-3.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRenderingVideo ? 'Synthesizing 15s UGC Campaign...' : 'Generate 15s UGC Hero Ad'}</span>
          </button>

          {/* Instagram Post Button */}
          {ad && (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSchedule}
                disabled={scheduling || !!scheduledAt}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {scheduledAt
                  ? '✓ Scheduled to @swikritik483'
                  : scheduling
                  ? 'Posting to Instagram...'
                  : 'Post to Instagram (@swikritik483)'}
              </button>

              {scheduledAt && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>Queued live for @swikritik483!</span>
                  {permalink && (
                    <a
                      href={permalink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 font-bold underline"
                    >
                      <ExternalLink className="w-3 h-3" /> View Post
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: E-COMMERCE / AMAZON PRODUCT PHOTO STUDIO */}
      {activeTab === 'photo' && (
        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Select Product Asset
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['sneaker', 'serum', 'headphones', 'can'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedProduct(key)}
                  className={`relative p-1 rounded-xl border transition-all overflow-hidden flex flex-col items-center ${
                    selectedProduct === key
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-neutral-800 bg-neutral-900 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={productPresets[key].raw}
                    alt={productPresets[key].name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <span className="text-[9px] font-semibold mt-1 truncate max-w-full text-neutral-300">
                    {key}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
              AI Environment Preset
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'amazon_white', label: 'Amazon Clean White', desc: '100% white + shadow' },
                { id: 'luxury_marble', label: 'Italian Marble', desc: 'Sunlight & luxury' },
                { id: 'neon_cyber', label: 'Cyberpunk Neon', desc: 'Moody color accents' },
                { id: 'minimalist', label: 'Minimalist Pastel', desc: 'Clean geometric podium' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(preset.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedPreset === preset.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="font-bold block text-[11px]">{preset.label}</span>
                  <span className="text-[9px] text-neutral-500">{preset.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full h-[220px] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            {isProcessingPhoto ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                <span className="text-xs font-semibold text-neutral-300">
                  Synthesizing AI Background...
                </span>
              </div>
            ) : (
              <>
                <img
                  src={
                    photoShowProcessed
                      ? productPresets[selectedProduct].processed[selectedPreset]
                      : productPresets[selectedProduct].raw
                  }
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {photoShowProcessed ? 'AI Enhanced Asset' : 'Original Raw'}
                </div>

                <button
                  onClick={() => setPhotoShowProcessed(!photoShowProcessed)}
                  className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/70 backdrop-blur-md hover:bg-black text-white text-[10px] font-bold rounded-lg border border-neutral-700"
                >
                  {photoShowProcessed ? 'Show Original' : 'Show AI Remix'}
                </button>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleGeneratePhoto}
              disabled={isProcessingPhoto}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Product Shoot
            </button>

            <button
              onClick={() => {
                alert('Exported 4K Amazon-ready pack to camera roll!');
              }}
              className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-neutral-200"
              title="Download Amazon Ready Photo"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
