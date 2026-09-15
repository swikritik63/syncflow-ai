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

// Creative Gen-Z Text Normalizer & Semantic Extractor
function normalizeSmashedWords(text: string): string {
  if (!text) return '';
  // Split camelCase or run-on lowercase words if no spaces exist
  let cleaned = text.trim();
  if (!cleaned.includes(' ') && cleaned.length > 15) {
    cleaned = cleaned.replace(
      /(from|hours|of|lecture|lectures|solve|solves|it|in|minutes|app|note|notes|taking|class|classes|study|studying|exam|exams|test|work|manual|hours|photo|photos|editing|background|remove|removes|clean|tax|taxes|customer|support|ticket|tickets)/gi,
      ' $1 '
    ).replace(/\s+/g, ' ').trim();
  }
  return cleaned;
}

// Creative Gen-Z Hook Director: every hook MUST include business context so any viewer understands
function generateHooksForMeme(
  meme: RawMemeItem,
  business: BusinessProfile,
  index: number
): { primaryHook: string; alternativeHooks: string[]; rationale: string; caption: string } {
  const brand = business.companyName || business.name || 'Marketing Engine';
  const rawProblem = normalizeSmashedWords(business.problemSolved || 'hours of repetitive work');
  const rawBenefit = normalizeSmashedWords(business.keyBenefits || 'finishing in 2 minutes');
  const rawProduct = normalizeSmashedWords(business.productService || 'an AI tool that saves you time');
  const rawCategory = (business.category || business.categories?.[0] || '').toLowerCase();
  const rawAudience = (business.audience || 'people').toLowerCase();
  const action = meme.actions?.[0] || 'reacting';
  const mood = (meme.mood_and_vibe || 'viral').toLowerCase();

  // Short versions for hooks (keep them punchy)
  const shortProblem = cleanClause(rawProblem, 7).toLowerCase();
  const shortBenefit = cleanClause(rawBenefit, 7).toLowerCase();
  const shortProduct = cleanClause(rawProduct, 8).toLowerCase();
  const shortAudience = cleanClause(rawAudience, 4).toLowerCase();

  // Every hook MUST include what the business does so viewers understand
  const creativeHooks: string[] = [
    `POV: ${shortAudience} discovering ${brand} — ${shortProduct} — for the first time`,
    `"there's no way an app can ${shortBenefit}" ... watch what ${brand} does:`,
    `me before ${brand}: wasting hours on ${shortProblem}\nme after ${brand}: done in 2 minutes`,
    `${brand} literally ${shortBenefit} and I'm never going back to doing it manually`,
    `showing my team ${brand} tomorrow — it's ${shortProduct} and it changes everything`,
    `how ${brand} went from "never heard of it" to my most-used app. it ${shortBenefit}.`,
    `the app that ${shortBenefit} while you sleep? it's called ${brand} and it's real.`,
    `still dealing with ${shortProblem}? ${brand} solves that in seconds, not hours.`,
    `every ${shortAudience} needs ${brand} — it ${shortBenefit} without the stress`,
    `POV: you stop ${shortProblem} forever because ${brand} exists`,
    `unpopular opinion: ${shortProblem} is optional in 2026. ${brand} handles it.`,
    `why are ${shortAudience} not talking about ${brand}? it ${shortBenefit} in one tap.`,
    `before ${brand}: stressed, overwhelmed, behind.\nafter ${brand}: ${shortBenefit}. done.`,
    `${brand} is ${shortProduct}. if you're still doing this manually, watch this.`,
    `real talk: ${brand} just ${shortBenefit} for me in 30 seconds. here's proof:`,
  ];

  // Mood-specific hooks that still include brand context
  if (mood.includes('cry') || action.includes('cry') || action.includes('sad')) {
    creativeHooks.unshift(`me realizing I spent years on ${shortProblem} when ${brand} does it instantly 😭`);
  } else if (mood.includes('dance') || action.includes('dance') || action.includes('celebrat')) {
    creativeHooks.unshift(`how it feels when ${brand} ${shortBenefit} and you're finally free 🕺`);
  } else if (mood.includes('angry') || mood.includes('frustrat')) {
    creativeHooks.unshift(`still dealing with ${shortProblem} in 2026?? ${brand} fixed this ages ago.`);
  }

  const primaryHook = creativeHooks[index % creativeHooks.length];
  const alternativeHooks = creativeHooks.filter((h) => h !== primaryHook).slice(0, 3);

  // Captions — each one MUST explain what the brand does for someone who's never heard of it
  const captions = [
    `${brand} is ${shortProduct}. if you've been struggling with ${shortProblem}, this is your sign to switch. link in bio to try it free! 🚀`,
    `here's why ${shortAudience} are switching to ${brand} — it ${shortBenefit} in minutes, not hours. save this and thank me later 👇`,
    `stop wasting time on ${shortProblem}. ${brand} ${shortBenefit} automatically. I tested it. it works. link in bio ⚡`,
    `POV: you find out ${brand} — ${shortProduct} — exists and your whole workflow changes. link in bio!`,
    `honestly ${brand} should be illegal for how fast it ${shortBenefit}. try it free at the link in bio 🔥`,
    `${shortAudience}, meet ${brand}. it's ${shortProduct} and it's about to save you so much time. link in bio!`,
    `${brand} ${shortBenefit} while you focus on what matters. no more ${shortProblem}. link in bio to start free ✨`,
    `I was skeptical too but ${brand} genuinely ${shortBenefit}. perfect for ${shortAudience} who are tired of ${shortProblem}. link in bio!`,
    `the future of ${rawCategory || 'productivity'} is here. ${brand} ${shortBenefit} in seconds. link in bio 👇`,
    `real talk: ${brand} replaced my entire ${shortProblem} workflow. it's ${shortProduct}. link in bio to try it!`,
  ];

  const caption = captions[index % captions.length];
  const rationale = `Viral Angle: This visual (${action}, ${mood}) creates pattern interruption. The hook positions ${brand} as the solution to "${shortProblem}" — connecting the meme emotion to your product.`;

  return { primaryHook, alternativeHooks, rationale, caption };
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

    const { primaryHook, alternativeHooks, rationale, caption } = generateHooksForMeme(meme, business, idx);

    const brandClean = (business.companyName || business.name || 'marketing').toLowerCase().replace(/[^a-z0-9]/g, '');
    const hashtags = [
      `#${brandClean}`,
      '#viralreels',
      '#genzhacks',
      '#growthhack',
      '#lifehacks',
      '#fyp',
    ];

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
