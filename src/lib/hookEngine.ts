import { BusinessProfile, MemeTemplate, ViralTemplate } from '@/types';
import memeCatalogRaw from '@/data/meme_catalog.json';

export const defaultBusinessProfile: BusinessProfile = {
  name: 'Alex',
  companyName: 'SyncFlow AI',
  productService: 'Autonomous AI marketing agent that turns memes into viral customer acquisition reels',
  audience: 'Founders, Indie hackers, SaaS marketers, and Growth teams',
  problemSolved: 'Spending 15 hours a week editing short-form video reels that flop or get 200 views',
  keyBenefits: 'Generates high-retention 9:16 viral hooks in seconds and schedules directly to Instagram',
  tonePositioning: 'Witty, hyper-relatable, authoritative yet playful startup humor',
  thingsToAvoid: 'Boring corporate speak, stiff corporate headshots, complex video editing jargon',
  businessModel: 'B2B',
  categories: ['SaaS', 'Mobile app', 'Media/Content'],
  onboarded: false,
};

export const sampleBusinessPresets: BusinessProfile[] = [
  {
    name: 'Alex',
    companyName: 'SyncFlow AI',
    productService: 'Autonomous AI video marketing engine turning memes into viral Reels & TikToks',
    audience: 'SaaS founders, mobile app developers, and marketing agencies',
    problemSolved: 'Spending 10+ hours a week scripting and editing short-form videos with zero reach',
    keyBenefits: 'Instantly matches viral meme formulas and automates calendar scheduling in 1 click',
    tonePositioning: 'Witty, edgy tech humor, high-conversion growth hacking',
    thingsToAvoid: 'Boring stock footage, corporate jargon, robotic voiceovers',
    businessModel: 'B2B',
    categories: ['SaaS', 'Media/Content', 'Mobile app'],
    onboarded: true,
  },
  {
    name: 'Elena',
    companyName: 'Lumina AI',
    productService: '1-tap AI smartphone photo enhancer that removes photobombers and cleans messy backgrounds',
    audience: 'Content creators, travel influencers, and everyday mobile photographers',
    problemSolved: 'Photobombers, tourists, and power lines ruining once-in-a-lifetime vacation photos',
    keyBenefits: 'Erases distractions in 1 tap with zero blurry artifacts or Photoshop complexity',
    tonePositioning: 'Aesthetic, magical, playful, lifestyle luxury',
    thingsToAvoid: 'Overly technical AI terms, fake plastic airbrushing',
    businessModel: 'B2C',
    categories: ['Mobile app', 'Media/Content'],
    onboarded: true,
  },
  {
    name: 'Marcus',
    companyName: 'Kanso Cloud',
    productService: 'Minimalist automated bookkeeping that tracks tax write-offs directly from bank feeds',
    audience: 'Freelancers, remote agency owners, and independent contractors',
    problemSolved: 'Drowning in crumpled receipts and tax season panic every April',
    keyBenefits: 'Recovers an average of $4,200 in forgotten write-offs with zero manual spreadsheets',
    tonePositioning: 'Relatable financial relief, dry sarcasm about taxes, zen simplicity',
    thingsToAvoid: 'CPA jargon, boring ledger tables, IRS fearmongering',
    businessModel: 'B2B',
    categories: ['SaaS', 'Services'],
    onboarded: true,
  },
  {
    name: 'Sophia',
    companyName: 'Aura Matcha',
    productService: 'Ceremonial grade organic Japanese matcha powder infused with lion’s mane mushrooms',
    audience: 'Productivity junkies, designers, students, and caffeine-sensitive professionals',
    problemSolved: 'The violent 2 PM espresso crash, jittery anxiety, and stained teeth',
    keyBenefits: 'Delivers 6 hours of calm, jitter-free focus with sustained clean energy',
    tonePositioning: 'Mindful aesthetic, calm focus, premium health & wellness',
    thingsToAvoid: 'Gym-bro energy drink vibes, miracle cure claims',
    businessModel: 'B2C',
    categories: ['E-commerce'],
    onboarded: true,
  },
];

export const sampleBusinesses = sampleBusinessPresets;

interface RawMemeItem {
  id: string;
  video_id: string;
  video_url: string;
  is_carousel?: boolean;
  duration?: string;
  category?: string;
  detailed_description?: string;
  objects_and_elements?: string[];
  actions?: string[];
  mood_and_vibe?: string;
  search_keywords?: string[];
}

function cleanClause(text: string, maxWords: number = 10): string {
  if (!text) return '';
  const trimmed = text.trim().replace(/[.,;!?]+$/, '');
  const words = trimmed.split(/\s+/);
  if (words.length <= maxWords) return trimmed;
  return words.slice(0, maxWords).join(' ');
}

// Natural, Breakable TikTok / Instagram Reels Hook Formulas
function generateHooksForMeme(
  meme: RawMemeItem,
  business: BusinessProfile,
  index: number
): { primaryHook: string; alternativeHooks: string[]; rationale: string } {
  const brand = business.companyName || 'Marketing Engine';
  const audience = cleanClause(business.audience || 'creators', 6);
  const problem = cleanClause(business.problemSolved || 'wasting hours on manual work', 8);
  const benefit = cleanClause(business.keyBenefits || 'automating your growth in 1 tap', 8);
  const avoid = cleanClause(business.thingsToAvoid || 'wasting time and money', 6);
  const action = meme.actions?.[0] || 'explaining';
  const mood = meme.mood_and_vibe || 'energetic';

  // Natural TikTok / Reels Viral Hook Styles (Breakable, conversational, no cut words)
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

  const primary = formulas[index % formulas.length];
  const alts = formulas.filter((h) => h !== primary).slice(0, 3);

  // Hermes Rationale Rule: Visual emotion + audience struggle + product transformation
  const rationale = `Visual Dynamic: This template's ${mood} vibe (${action}) mirrors your target audience's genuine frustration with ${problem} and delivers ${brand}'s key promise: ${benefit}.`;

  return {
    primaryHook: primary,
    alternativeHooks: alts,
    rationale,
  };
}

// Generate adapted meme deck based on business profile
export function generateMemeFeed(business: BusinessProfile): MemeTemplate[] {
  const memes = (memeCatalogRaw as RawMemeItem[]) || [];

  // Relevance scoring: match keywords, business category, and problem
  const scoredMemes = memes.map((meme, idx) => {
    let score = 75; // base score
    const searchable = [
      meme.category,
      meme.mood_and_vibe,
      meme.detailed_description,
      ...(meme.actions || []),
      ...(meme.search_keywords || []),
    ].join(' ').toLowerCase();

    // Match categories
    for (const cat of business.categories || []) {
      if (searchable.includes(cat.toLowerCase())) score += 12;
    }

    // Match business model
    if (business.businessModel === 'B2B' && (searchable.includes('explaining') || searchable.includes('pitch') || searchable.includes('coding') || searchable.includes('whiteboard'))) {
      score += 15;
    }
    if (business.businessModel === 'B2C' && (searchable.includes('lifestyle') || searchable.includes('funny') || searchable.includes('crying') || searchable.includes('car'))) {
      score += 15;
    }

    // Match words from problem and benefits
    const words = `${business.problemSolved} ${business.keyBenefits}`.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (w.length > 4 && searchable.includes(w)) {
        score += 4;
      }
    }

    const { primaryHook, alternativeHooks, rationale } = generateHooksForMeme(meme, business, idx);

    const hashtags = [
      `#${(business.companyName || 'marketing').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      `#${(business.categories?.[0] || 'growth').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      '#viralreels',
      '#growthhack',
      '#marketing',
      '#fyp',
    ];

    const caption = `Discover ${business.companyName || 'our brand'}: ${business.keyBenefits || 'transforming your workflow'}. Link in bio to try it free! 🚀`;

    return {
      id: meme.id,
      video_id: meme.video_id,
      video_url: meme.video_url || `/videos/${meme.video_id}`,
      is_carousel: Boolean(meme.is_carousel || meme.video_id.endsWith('.jpg') || meme.video_id.endsWith('.png')),
      duration: meme.duration || '12s',
      category: meme.category || 'Viral Meme',
      detailed_description: meme.detailed_description || '',
      objects_and_elements: meme.objects_and_elements || [],
      actions: meme.actions || [],
      mood_and_vibe: meme.mood_and_vibe || 'Viral',
      search_keywords: meme.search_keywords || [],
      hook: primaryHook,
      alternativeHooks,
      whyRationale: rationale,
      caption,
      hashtags,
      viralScore: Math.min(99, Math.max(82, score)),
    };
  });

  // Sort by score descending
  return scoredMemes.sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0));
}

// Adapt for backward compatibility with existing components
export function adaptTemplatesForBusiness(business: BusinessProfile): ViralTemplate[] {
  const memeDeck = generateMemeFeed(business);
  return memeDeck.map((m) => ({
    id: m.id,
    title: m.hook,
    category: m.category,
    videoUrl: m.video_url,
    thumbnail: m.video_url,
    duration: parseInt(m.duration) || 12,
    soundName: 'Original Viral Sound',
    soundAuthor: business.companyName || 'business-marketing_engine',
    views: `${Math.floor(80 + Math.random() * 220)}k`,
    defaultHook: m.hook,
    whyRationale: m.whyRationale,
    isCarousel: m.is_carousel,
    subtitleStyle: {
      textColor: '#FFFFFF',
      bgColor: 'rgba(0,0,0,0.7)',
      fontStyle: 'kinetic',
      position: 'center',
    },
    hashtags: m.hashtags,
    viralScore: m.viralScore || 94,
    marketingAngle: 'relatable',
  }));
}
