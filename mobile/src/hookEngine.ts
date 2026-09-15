import { BusinessProfile, MemeTemplate } from './types';
import memeCatalogRaw from '../assets/meme_catalog.json';

export const defaultProfile: BusinessProfile = {
  name: 'Swikriti',
  companyName: 'SyncFlow AI',
  productService: 'Autonomous AI video generator for SaaS customer acquisition',
  audience: 'SaaS founders, mobile app developers, and marketing agencies',
  problemSolved: 'Spending 10+ hours a week scripting and editing short-form videos with zero reach',
  keyBenefits: 'Instantly matches viral meme formulas and automates calendar scheduling in 1 click',
  tonePositioning: 'Witty, edgy tech humor, high-conversion growth hacking',
  thingsToAvoid: 'Boring stock footage, corporate jargon, robotic voiceovers',
  businessModel: 'B2B',
  categories: ['SaaS', 'Mobile app'],
  onboarded: false,
};

function cleanClause(text: string, maxWords: number = 10): string {
  if (!text) return '';
  const trimmed = text.trim().replace(/[.,;!?]+$/, '');
  const words = trimmed.split(/\s+/);
  if (words.length <= maxWords) return trimmed;
  return words.slice(0, maxWords).join(' ');
}

export function generateMobileMemeDeck(business: BusinessProfile): MemeTemplate[] {
  const memes = (memeCatalogRaw as any[]) || [];

  return memes.map((meme, idx) => {
    const brand = business.companyName || 'Marketing Engine';
    const audience = cleanClause(business.audience || 'creators', 6);
    const problem = cleanClause(business.problemSolved || 'manual editing', 8);
    const benefit = cleanClause(business.keyBenefits || 'viral growth in 1 tap', 8);
    const avoid = cleanClause(business.thingsToAvoid || 'wasting time', 6);
    const mood = meme.mood_and_vibe || 'energetic';

    // Natural TikTok / Reels Viral Formulas (No word truncation)
    const formulas = [
      `POV: You finally stopped dealing with ${problem.toLowerCase()} because ${brand} exists.`,
      `honestly been struggling with ${problem.toLowerCase()}\nuntil I found ${brand}`,
      `My life before vs after ${brand}\nwhen you finally get ${benefit.toLowerCase()}`,
      `They told ${audience.toLowerCase()} that ${avoid.toLowerCase()} was normal.\nThen ${brand} dropped.`,
      `That exact feeling when ${brand} handles ${problem.toLowerCase()} in literally 2 minutes.`,
      `Stop dealing with ${problem.toLowerCase()}.\n${brand} gives you ${benefit.toLowerCase()} in 1 tap.`,
      `Why did nobody tell ${audience.toLowerCase()} about ${brand} when we were drowning in ${problem.toLowerCase()}?`,
      `Me explaining to ${audience.toLowerCase()} how ${brand} gives you ${benefit.toLowerCase()} with zero hassle.`,
    ];

    const primaryHook = formulas[idx % formulas.length];
    const alts = formulas.filter((h) => h !== primaryHook).slice(0, 3);

    const rationale = `Visual Dynamic: This template's ${mood} energy directly mirrors your target audience's frustration with '${problem}' and delivers ${brand}'s key benefit: '${benefit}'.`;

    const hashtags = [
      `#${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      `#${(business.categories?.[0] || 'growth').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      '#viralreels',
      '#growthhack',
      '#fyp',
    ];

    const caption = `Discover ${brand}: ${benefit}. Link in bio to try free! 🚀`;

    return {
      id: meme.id,
      video_id: meme.video_id,
      // For local development on phone, point to local server or bundled asset
      video_url: `http://localhost:3000${meme.video_url}`,
      is_carousel: Boolean(meme.is_carousel),
      duration: meme.duration || '12s',
      category: meme.category || 'Viral Meme',
      detailed_description: meme.detailed_description || '',
      objects_and_elements: meme.objects_and_elements || [],
      actions: meme.actions || [],
      mood_and_vibe: mood,
      search_keywords: meme.search_keywords || [],
      hook: primaryHook,
      alternativeHooks: alts,
      whyRationale: rationale,
      caption,
      hashtags,
      viralScore: 92,
    };
  });
}
