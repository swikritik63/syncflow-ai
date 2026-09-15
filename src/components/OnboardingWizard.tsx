'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Check,
  Brain,
  Zap,
  ShoppingBag,
  Laptop,
  Briefcase,
  Wrench,
  Globe,
  Film,
  Smartphone,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { BusinessProfile, BusinessModel, BusinessCategory } from '@/types';

interface OnboardingWizardProps {
  initialProfile?: BusinessProfile;
  onComplete: (profile: BusinessProfile) => void;
}

const PRESETS: { label: string; profile: Partial<BusinessProfile> }[] = [
  {
    label: '🚀 B2B SaaS',
    profile: {
      name: 'Alex',
      companyName: 'SyncFlow AI',
      productService: 'Autonomous AI workflow platform that automates customer support and CRM updates',
      audience: 'SaaS founders, customer support leads, and growth teams',
      problemSolved: 'Spending 6 hours a day replying to repetitive support tickets and losing impatient customers',
      keyBenefits: '90% ticket deflection rate, instant 24/7 replies, and 10x lower support costs',
      tonePositioning: 'Witty, hyper-relatable, authoritative yet playful startup humor',
      thingsToAvoid: 'Boring corporate speak, stiff corporate headshots, complex technical jargon',
      businessModel: 'B2B',
      categories: ['SaaS', 'Mobile app'],
    },
  },
  {
    label: '📸 Photo App',
    profile: {
      name: 'Elena',
      companyName: 'Lumina Photo',
      productService: '1-tap AI smartphone photo enhancer that erases tourists and cleans blurry backgrounds',
      audience: 'Content creators, travel influencers, and everyday smartphone photographers',
      problemSolved: 'Photobombers, tourists, and power lines ruining once-in-a-lifetime vacation memories',
      keyBenefits: 'Erases distractions in 1 tap with zero blurry artifacts or Photoshop complexity',
      tonePositioning: 'Aesthetic, inspiring, playful, lifestyle luxury',
      thingsToAvoid: 'Overly technical AI terms, fake plastic airbrushing',
      businessModel: 'B2C',
      categories: ['Mobile app', 'Media/Content'],
    },
  },
  {
    label: '💼 Fintech',
    profile: {
      name: 'Marcus',
      companyName: 'Kanso Finance',
      productService: 'Minimalist automated bookkeeping that tracks tax write-offs directly from bank accounts',
      audience: 'Freelancers, remote agency owners, and independent contractors',
      problemSolved: 'Drowning in crumpled receipts and tax season panic every April',
      keyBenefits: 'Recovers an average of $4,200 in forgotten deductions with zero manual spreadsheets',
      tonePositioning: 'Relatable financial relief, dry sarcasm about taxes, zen simplicity',
      thingsToAvoid: 'CPA jargon, boring ledger tables, IRS fearmongering',
      businessModel: 'B2B',
      categories: ['SaaS', 'Services'],
    },
  },
  {
    label: '🍵 E-Commerce',
    profile: {
      name: 'Sophia',
      companyName: 'Aura Wellness',
      productService: 'Ceremonial grade Japanese matcha powder infused with organic lion’s mane mushrooms',
      audience: 'Productivity enthusiasts, designers, students, and caffeine-sensitive professionals',
      problemSolved: 'The violent 2 PM coffee crash, jittery heart palpitations, and morning anxiety',
      keyBenefits: 'Delivers 6 hours of calm, jitter-free focus with sustained clean energy',
      tonePositioning: 'Mindful aesthetic, calm focus, premium health & wellness',
      thingsToAvoid: 'Gym-bro energy drink vibes, unrealistic medical claims',
      businessModel: 'B2C',
      categories: ['E-commerce'],
    },
  },
];

const BUSINESS_MODELS: { value: BusinessModel; label: string; desc: string }[] = [
  { value: 'B2B', label: 'B2B', desc: 'Selling to businesses & teams' },
  { value: 'B2C', label: 'B2C', desc: 'Selling directly to consumers' },
  { value: 'Both', label: 'Both', desc: 'Hybrid B2B & B2C model' },
];

const CATEGORIES: { value: BusinessCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'E-commerce', label: 'E-commerce', icon: ShoppingBag },
  { value: 'SaaS', label: 'SaaS', icon: Laptop },
  { value: 'Agency', label: 'Agency', icon: Briefcase },
  { value: 'Services', label: 'Services', icon: Wrench },
  { value: 'Marketplace', label: 'Marketplace', icon: Globe },
  { value: 'Media/Content', label: 'Media/Content', icon: Film },
  { value: 'Mobile app', label: 'Mobile app', icon: Smartphone },
  { value: 'Other', label: 'Other', icon: Layers },
];

const COOKING_STEPS = [
  'Analyzing brand tone & target audience...',
  'Searching 66 viral video meme blueprints...',
  'Synthesizing high-retention kinetic hooks...',
  'Optimizing for Instagram & TikTok algorithms...',
];

export function OnboardingWizard({
  initialProfile,
  onComplete,
}: OnboardingWizardProps) {
  // 4 spacious steps + step 5 cooking
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [name, setName] = useState(initialProfile?.name || 'Swikriti');
  const [companyName, setCompanyName] = useState(
    initialProfile?.companyName
      ? initialProfile.companyName
      : 'SyncFlow AI'
  );
  const [logoUrl, setLogoUrl] = useState(initialProfile?.logoUrl || '');
  const [productService, setProductService] = useState(
    initialProfile?.productService ||
      'Autonomous AI marketing engine that turns memes into viral customer acquisition reels'
  );
  const [audience, setAudience] = useState(
    initialProfile?.audience ||
      'Founders, Indie hackers, SaaS marketers, and Growth teams'
  );
  const [problemSolved, setProblemSolved] = useState(
    initialProfile?.problemSolved ||
      'Spending 15 hours a week editing short-form video reels that flop or get 200 views'
  );
  const [keyBenefits, setKeyBenefits] = useState(
    initialProfile?.keyBenefits ||
      'Generates high-retention 9:16 viral hooks in seconds and schedules directly to Instagram'
  );
  const [tonePositioning, setTonePositioning] = useState(
    initialProfile?.tonePositioning ||
      'Witty, hyper-relatable, authoritative yet playful startup humor'
  );
  const [thingsToAvoid, setThingsToAvoid] = useState(
    initialProfile?.thingsToAvoid ||
      'Boring corporate speak, stiff corporate headshots, complex video editing jargon'
  );
  const [businessModel, setBusinessModel] = useState<BusinessModel>(
    initialProfile?.businessModel || 'B2B'
  );
  const [categories, setCategories] = useState<BusinessCategory[]>(
    initialProfile?.categories || ['SaaS', 'Mobile app']
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Cooking Animation state
  const [cookingProgress, setCookingProgress] = useState(0);
  const [currentCookingStep, setCurrentCookingStep] = useState(0);

  const handleApplyPreset = (preset: typeof PRESETS[0]['profile']) => {
    if (preset.name) setName(preset.name);
    if (preset.companyName) setCompanyName(preset.companyName);
    if (preset.productService) setProductService(preset.productService);
    if (preset.audience) setAudience(preset.audience);
    if (preset.problemSolved) setProblemSolved(preset.problemSolved);
    if (preset.keyBenefits) setKeyBenefits(preset.keyBenefits);
    if (preset.tonePositioning) setTonePositioning(preset.tonePositioning);
    if (preset.thingsToAvoid) setThingsToAvoid(preset.thingsToAvoid);
    if (preset.businessModel) setBusinessModel(preset.businessModel);
    if (preset.categories) setCategories(preset.categories);
    setErrorMsg(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Logo file must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleCategory = (cat: BusinessCategory) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Step Navigations
  const goToStep2 = () => {
    if (!companyName.trim()) {
      setErrorMsg('Please enter your brand or company name.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const goToStep3 = () => {
    if (!productService.trim() || !audience.trim()) {
      setErrorMsg('Please describe what you build and who your target audience is.');
      return;
    }
    setErrorMsg(null);
    setStep(3);
  };

  const goToStep4 = () => {
    if (!problemSolved.trim() || !keyBenefits.trim()) {
      setErrorMsg('Please enter the problem solved and your key benefit.');
      return;
    }
    setErrorMsg(null);
    setStep(4);
  };

  const startCooking = () => {
    if (categories.length === 0) {
      setErrorMsg('Please select at least one business category.');
      return;
    }
    setErrorMsg(null);
    setStep(5);
  };

  // Step 5: Cooking Animation
  useEffect(() => {
    if (step !== 5) return;

    const interval = setInterval(() => {
      setCookingProgress((prev) => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 100);

    const step1 = setTimeout(() => setCurrentCookingStep(1), 500);
    const step2 = setTimeout(() => setCurrentCookingStep(2), 1100);
    const step3 = setTimeout(() => setCurrentCookingStep(3), 1700);

    const finishTimeout = setTimeout(() => {
      const fullProfile: BusinessProfile = {
        name: name || 'Founder',
        companyName: companyName || 'My Brand',
        logoUrl,
        productService,
        audience,
        problemSolved,
        keyBenefits,
        tonePositioning,
        thingsToAvoid,
        businessModel,
        categories,
        onboarded: true,
        category: categories[0] || 'SaaS',
        targetAudience: audience,
        keyBenefit: keyBenefits,
        painPoint: problemSolved,
      };

      try {
        localStorage.setItem('bme_business_profile', JSON.stringify(fullProfile));
        localStorage.setItem('fastlane_business_profile', JSON.stringify(fullProfile));
      } catch (err) {
        console.error('Failed to save profile:', err);
      }

      onComplete(fullProfile);
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(finishTimeout);
    };
  }, [
    step,
    name,
    companyName,
    logoUrl,
    productService,
    audience,
    problemSolved,
    keyBenefits,
    tonePositioning,
    thingsToAvoid,
    businessModel,
    categories,
    onComplete,
  ]);

  return (
    <div className="w-full h-full flex flex-col justify-between overflow-y-auto no-scrollbar px-6 py-5 text-left select-none">
      {/* Top Progress Bar (Steps 1 to 4) */}
      {step <= 4 && (
        <div className="w-full pb-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 mb-2">
            <span className="text-emerald-400 font-bold uppercase tracking-wider">
              Step {step} of 4
            </span>
            <span className="text-neutral-500">
              {step === 1 && 'Brand Identity'}
              {step === 2 && 'Your Offer'}
              {step === 3 && 'Positioning'}
              {step === 4 && 'Category'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 1: BRAND IDENTITY (Airy, Spacious, Breathing)            */}
      {/* ============================================================ */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-between space-y-6 animate-in fade-in duration-200">
          <div className="space-y-5">
            {/* Header */}
            <div className="space-y-1.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero-Login Creator Engine</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight pt-1">
                Welcome to Marketing Engine
              </h1>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Tell us about your brand. Everything you enter will be directly used to generate viral short-form video hooks.
              </p>
            </div>

            {/* Quick Demo Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Quick Example Presets
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyPreset(p.profile)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-all active:scale-95"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Upload & Brand Names */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800">
                <label htmlFor="brand-logo" className="cursor-pointer block">
                  <div className="w-16 h-16 rounded-2xl bg-neutral-800/80 border-2 border-dashed border-neutral-600 hover:border-emerald-500 flex flex-col items-center justify-center overflow-hidden transition-colors shadow-inner">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-0.5" />
                        <span className="text-[9px] text-neutral-400 font-medium">Logo</span>
                      </div>
                    )}
                  </div>
                </label>
                <input
                  id="brand-logo"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-bold text-white">Brand Logo</p>
                  <p className="text-[11px] text-neutral-400">PNG, JPG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. SyncFlow AI"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="button"
            onClick={goToStep2}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-98 transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 2: YOUR OFFER & TARGET AUDIENCE                         */}
      {/* ============================================================ */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-between space-y-6 animate-in fade-in duration-200">
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tight">
                What do you build?
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Describe what your product does and who it is built for.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Product / Service Description
                </label>
                <textarea
                  rows={3}
                  value={productService}
                  onChange={(e) => setProductService(e.target.value)}
                  placeholder="e.g. Autonomous AI support platform that resolves tickets instantly without human delay..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="e.g. SaaS founders, customer support teams, indie hackers"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="text-[10px] text-neutral-500">
                  Who feels the strongest emotional urgency to use this?
                </p>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="py-4 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 font-semibold text-xs text-neutral-300 transition-all"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goToStep3}
              className="flex-1 py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-98 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 3: PAIN & TRANSFORMATION                                */}
      {/* ============================================================ */}
      {step === 3 && (
        <div className="flex-1 flex flex-col justify-between space-y-6 animate-in fade-in duration-200">
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tight">
                The Hook & Positioning
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Viral hooks tap directly into pain and transformation.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Problem Solved (The Pain Point)
                </label>
                <textarea
                  rows={2}
                  value={problemSolved}
                  onChange={(e) => setProblemSolved(e.target.value)}
                  placeholder="e.g. Spending 15 hours a week editing reels that get 200 views..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Key Benefit (The Transformation)
                </label>
                <input
                  type="text"
                  value={keyBenefits}
                  onChange={(e) => setKeyBenefits(e.target.value)}
                  placeholder="e.g. Generates high-retention 9:16 viral hooks in seconds"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300 block">
                    Tone / Voice
                  </label>
                  <input
                    type="text"
                    value={tonePositioning}
                    onChange={(e) => setTonePositioning(e.target.value)}
                    placeholder="e.g. Witty, bold"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-3.5 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300 block">
                    Things to Avoid
                  </label>
                  <input
                    type="text"
                    value={thingsToAvoid}
                    onChange={(e) => setThingsToAvoid(e.target.value)}
                    placeholder="e.g. Corporate speak"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-3.5 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-4 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 font-semibold text-xs text-neutral-300 transition-all"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goToStep4}
              className="flex-1 py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-98 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 4: BUSINESS CLASSIFICATION                              */}
      {/* ============================================================ */}
      {step === 4 && (
        <div className="flex-1 flex flex-col justify-between space-y-6 animate-in fade-in duration-200">
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Business Classification
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Select your business model and categories to rank the best meme blueprints.
              </p>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Business Model
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {BUSINESS_MODELS.map((model) => (
                  <button
                    key={model.value}
                    type="button"
                    onClick={() => setBusinessModel(model.value)}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      businessModel === model.value
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 scale-102'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-850'
                    }`}
                  >
                    <p className="text-sm font-extrabold">{model.label}</p>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-tight">{model.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  Category
                </label>
                <span className="text-[10px] text-neutral-500">select all that apply</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = categories.includes(cat.value);
                  const IconComp = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => toggleCategory(cat.value)}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500/60 text-white'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-850'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${isSelected ? 'bg-emerald-500 text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold">{cat.label}</span>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="py-4 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 font-semibold text-xs text-neutral-300 transition-all"
            >
              Back
            </button>
            <button
              type="button"
              onClick={startCooking}
              className="flex-1 py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 active:scale-98 transition-all"
            >
              <span>Generate Content Deck</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* STEP 5: COOKING ANIMATION                                    */}
      {/* ============================================================ */}
      {step === 5 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-7 animate-in fade-in zoom-in-95 duration-300 px-2">
          {/* Glowing Brain */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 opacity-30 blur-2xl animate-pulse" />
            <div className="relative w-22 h-22 rounded-3xl bg-neutral-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-2xl">
              <Brain className="w-11 h-11 animate-bounce" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">
              Generating more suggestions...
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
              Cooking up fresh content ideas for you. Hang tight! This won&apos;t take long...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 h-full transition-all duration-150 ease-out"
              style={{ width: `${cookingProgress}%` }}
            />
          </div>

          {/* 4-Step Stepper */}
          <div className="w-full max-w-xs space-y-2.5 text-left bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
            {COOKING_STEPS.map((stepText, idx) => {
              const isCompleted = idx <= currentCookingStep;
              const isCurrent = idx === currentCookingStep;
              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-black font-bold'
                        : isCurrent
                        ? 'border border-emerald-400 animate-spin text-emerald-400'
                        : 'border border-neutral-700 text-neutral-600'
                    }`}
                  >
                    {isCompleted ? '✓' : '•'}
                  </div>
                  <span className={isCompleted ? 'text-neutral-200 font-medium' : 'text-neutral-500'}>
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
