'use client';

import React, { useState } from 'react';
import {
  Wand2,
  ShoppingBag,
  Video,
  Sparkles,
  Download,
  Play,
  Layers,
  Cpu,
  Mic,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { BusinessProfile } from '@/types';
import confetti from 'canvas-confetti';

interface StudioViewProps {
  business: BusinessProfile;
  onOpenPaywall: () => void;
  isPro?: boolean;
}

export function StudioView({ business, onOpenPaywall, isPro = false }: StudioViewProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');

  // Photo Studio State
  const [selectedProduct, setSelectedProduct] = useState<'sneaker' | 'serum' | 'headphones' | 'can'>('sneaker');
  const [selectedPreset, setSelectedPreset] = useState<'amazon_white' | 'luxury_marble' | 'neon_cyber' | 'minimalist'>('amazon_white');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [photoShowProcessed, setPhotoShowProcessed] = useState(true);

  // Video Studio State
  const [selectedEngine, setSelectedEngine] = useState<'gemini_omni_flash' | 'wan_2_1' | 'minimax_hailuo'>('gemini_omni_flash');
  const [selectedVoice, setSelectedVoice] = useState('Rachel (Energetic Founder)');
  const [promptText, setPromptText] = useState(
    `Digital human spokesperson wearing clean modern attire, enthusiastically holding a smartphone demonstrating ${business.name}, explaining how it ${business.keyBenefit}. 4K, photorealistic, 24fps.`
  );
  const [isRenderingVideo, setIsRenderingVideo] = useState(false);
  const [renderStage, setRenderStage] = useState('');
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);

  // Sample Product Assets
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

  const handleGenerateVideo = () => {
    setIsRenderingVideo(true);
    setRenderedVideoUrl(null);

    setRenderStage('Synthesizing 11Labs Audio Speech...');
    setTimeout(() => {
      setRenderStage('Sampling DiT Diffusion Latent Space...');
      setTimeout(() => {
        setRenderStage('3D Causal VAE Decoding Frames...');
        setTimeout(() => {
          setIsRenderingVideo(false);
          setRenderStage('');
          setRenderedVideoUrl(
            'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-at-night-41316-large.mp4'
          );
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
          });
        }, 1200);
      }, 1200);
    }, 1200);
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
            E-Commerce Product Photos & Generative Video Engine
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

        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
            activeTab === 'video'
              ? 'bg-neutral-800 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4 text-purple-400" />
          AI Video Maker
        </button>
      </div>

      {/* TAB 1: E-COMMERCE / AMAZON PRODUCT PHOTO STUDIO */}
      {activeTab === 'photo' && (
        <div className="flex flex-col gap-3.5">
          {/* Product Selector */}
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

          {/* AI Background Presets */}
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

          {/* Preview Canvas with Before / After Toggle */}
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

                {/* Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {photoShowProcessed ? 'AI Enhanced Asset' : 'Original Raw'}
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => setPhotoShowProcessed(!photoShowProcessed)}
                  className="absolute bottom-2 right-2 px-2.5 py-1 bg-black/70 backdrop-blur-md hover:bg-black text-white text-[10px] font-bold rounded-lg border border-neutral-700"
                >
                  {photoShowProcessed ? 'Show Original' : 'Show AI Remix'}
                </button>
              </>
            )}
          </div>

          {/* Action Row */}
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

      {/* TAB 2: AI VIDEO MAKER (Gemini Omni Flash / Wan 2.1 / MiniMax) */}
      {activeTab === 'video' && (
        <div className="flex flex-col gap-3.5">
          {/* Engine Selector */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Generative Video Engine
            </label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { id: 'gemini_omni_flash', label: 'Gemini Omni', tag: 'Fast 2s' },
                { id: 'wan_2_1', label: 'Wan 2.1 Avatar', tag: 'InfiniteTalk' },
                { id: 'minimax_hailuo', label: 'MiniMax Hailuo', tag: 'Cinematic' },
              ].map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => setSelectedEngine(engine.id as any)}
                  className={`p-2 rounded-xl border flex flex-col items-center transition-all ${
                    selectedEngine === engine.id
                      ? 'border-purple-500 bg-purple-500/10 text-white'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-4 h-4 mb-1 text-purple-400" />
                  <span className="font-bold text-[10px]">{engine.label}</span>
                  <span className="text-[8px] text-purple-300 font-mono">{engine.tag}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 11Labs Audio Voice */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
              <span>Voice Narration (11Labs Engine)</span>
              <Mic className="w-3 h-3 text-pink-400" />
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 outline-none focus:border-purple-500"
            >
              <option>Rachel (Energetic Female Founder)</option>
              <option>Adam (Deep Tech Product Host)</option>
              <option>Bella (Warm UGC Creator Voice)</option>
              <option>Antoni (Dynamic Viral Ad Voice)</option>
            </select>
          </div>

          {/* Prompt */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Scene & Motion Prompt
            </label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 outline-none focus:border-purple-500 resize-none leading-relaxed"
            />
          </div>

          {/* Video Preview Canvas */}
          <div className="relative w-full h-[200px] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            {isRenderingVideo ? (
              <div className="flex flex-col items-center gap-2 text-center p-4">
                <RefreshCw className="w-7 h-7 text-purple-400 animate-spin" />
                <span className="text-xs font-bold text-white">{renderStage}</span>
                <span className="text-[10px] text-neutral-400">
                  Using 3D VAE Latent Denoising Pipeline
                </span>
              </div>
            ) : renderedVideoUrl ? (
              <div className="relative w-full h-full">
                <video
                  src={renderedVideoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-neutral-500">
                <Video className="w-8 h-8 stroke-[1.5px]" />
                <span className="text-xs">Click Generate to synthesize clip</span>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateVideo}
            disabled={isRenderingVideo}
            className="w-full py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Synthesize Video with {selectedEngine.replace(/_/g, ' ').toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );
}
