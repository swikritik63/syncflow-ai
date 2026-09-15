'use client';

import React, { useState } from 'react';
import { Briefcase, X, Check, Sparkles } from 'lucide-react';
import { BusinessProfile } from '@/types';
import { sampleBusinesses } from '@/lib/hookEngine';

interface BusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBusiness: BusinessProfile;
  onSelectBusiness: (business: BusinessProfile) => void;
}

export function BusinessModal({
  isOpen,
  onClose,
  currentBusiness,
  onSelectBusiness,
}: BusinessModalProps) {
  const [formData, setFormData] = useState<BusinessProfile>(currentBusiness);
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isOpen) return null;

  const handlePresetSelect = (b: BusinessProfile) => {
    setFormData(b);
    onSelectBusiness(b);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectBusiness(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-[360px] bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Target Business Profile</h2>
              <span className="text-xs text-neutral-400 font-medium">RAG Hook Engine Target</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets List */}
        <div className="py-3.5 flex flex-col gap-2.5">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Quick Test Presets (Instant RAG Match)
          </span>

          {sampleBusinesses.map((b) => {
            const isSelected = b.name === currentBusiness.name;

            return (
              <button
                key={b.name}
                onClick={() => handlePresetSelect(b)}
                className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-neutral-800 bg-neutral-950/70 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{b.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-medium">
                      {b.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-1 leading-normal">
                    {b.keyBenefit}
                  </p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Custom Input Toggle */}
        <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="text-sm text-emerald-400 font-bold flex items-center gap-1.5 hover:underline self-start"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isCustomMode ? 'Hide Custom Input' : 'Type Custom Business...'}
          </button>

          {isCustomMode && (
            <form onSubmit={handleCustomSubmit} className="flex flex-col gap-3 pt-1">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Business / App Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. SnapMagic"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Photo & Video App"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Key Benefit / Selling Point
                </label>
                <input
                  type="text"
                  required
                  value={formData.keyBenefit}
                  onChange={(e) => setFormData({ ...formData, keyBenefit: e.target.value })}
                  placeholder="e.g. removes photobombers in 1 tap"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-1">
                  Pain Point Solved
                </label>
                <input
                  type="text"
                  required
                  value={formData.painPoint}
                  onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
                  placeholder="e.g. spending hours on Photoshop"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm font-medium text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl active:scale-95 transition-all text-sm shadow-lg shadow-emerald-500/20"
              >
                Apply Custom Business
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
