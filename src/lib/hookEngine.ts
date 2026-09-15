import { BusinessProfile, CarouselSlide, MemeTemplate, ViralTemplate } from '@/types';
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

function cleanClause(text: string, maxWords: number = 8): string {
  if (!text) return '';
  const trimmed = text.trim().replace(/[.,;!?]+$/, '');
  const words = trimmed.split(/\s+/);
  if (words.length <= maxWords) return trimmed;
  return words.slice(0, maxWords).join(' ');
}

// Normalizer for user text to fix mashed strings or lowercase run-ons
function normalizeSmashedWords(text: string): string {
  if (!text) return '';
  let cleaned = text.trim();
  if (!cleaned.includes(' ') && cleaned.length > 15) {
    cleaned = cleaned.replace(
      /(from|hours|of|lecture|lectures|solve|solves|it|in|minutes|app|note|notes|taking|class|classes|study|studying|exam|exams|test|work|manual|hours|photo|photos|editing|background|remove|removes|clean|tax|taxes|customer|support|ticket|tickets)/gi,
      ' $1 '
    ).replace(/\s+/g, ' ').trim();
  }
  return cleaned;
}

// Intelligent grammatical article insertion (a vs an)
function withArticle(noun: string): string {
  if (!noun) return 'a tool';
  const trimmed = noun.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('a ') ||
    lower.startsWith('an ') ||
    lower.startsWith('the ') ||
    lower.startsWith('our ')
  ) {
    return trimmed;
  }
  const firstWord = lower.split(/\s+/)[0];
  const vowelRegex = /^(a|e|i|o|u|ai|hour|honest)/i;
  const article = vowelRegex.test(firstWord) ? 'an' : 'a';
  return `${article} ${trimmed}`;
}

// Singular and plural audience harmonizers to prevent "every developers" grammar bugs
function toSingularAudience(aud: string): string {
  if (!aud) return 'creator';
  const cleaned = aud.trim().toLowerCase();
  if (cleaned.endsWith('ies')) return cleaned.slice(0, -3) + 'y';
  if (cleaned.endsWith('ses')) return cleaned.slice(0, -2);
  if (cleaned.endsWith('s') && !cleaned.endsWith('ss')) return cleaned.slice(0, -1);
  return cleaned;
}

function toPluralAudience(aud: string): string {
  if (!aud) return 'creators';
  const cleaned = aud.trim().toLowerCase();
  if (cleaned === 'people' || cleaned === 'anyone' || cleaned === 'everyone') return 'creators';
  if (cleaned.endsWith('s')) return cleaned;
  if (cleaned.endsWith('y') && !/[aeiou]y$/.test(cleaned)) return cleaned.slice(0, -1) + 'ies';
  return cleaned + 's';
}

// Natural verb phrasing for benefit statements
function formatBenefitStatement(benefit: string): string {
  if (!benefit) return 'saves hours of manual work';
  const clean = benefit.trim().replace(/^[.,;!?]+|[.,;!?]+$/g, '');
  const lower = clean.toLowerCase();

  // If already starts with a verb in 3rd person singular (e.g. "finds", "automates", "delivers")
  if (/^(finds|automates|generates|solves|gives|delivers|eliminates|recovers|turns|cuts|boosts)\b/.test(lower)) {
    return clean;
  }
  // If starts with base verb (e.g. "find anything fast", "automate video")
  if (/^(find|automate|generate|solve|give|deliver|eliminate|recover|turn|cut|boost)\b/.test(lower)) {
    return clean.replace(/^([a-z]+)/i, '$1s');
  }
  // Otherwise prefix with "lets you"
  return `lets you ${clean.replace(/^(lets? you|allows you to)\s*/i, '')}`;
}

// Hyperscale Gen-Z Hook & Multi-line Spaced Caption Director
interface NicheDeliverableContext {
  deliverable: string;
  costAnchor: string;
  agencyAnchor: string;
  frictionAnchor: string;
  timeAnchor: string;
  visualBrollCue: string;
}

function resolveNicheDeliverable(
  business: BusinessProfile,
  rawProduct: string,
  rawProblem: string
): NicheDeliverableContext {
  const brand = business.companyName || business.name || 'SyncFlow AI';
  const prod = rawProduct.toLowerCase();
  const prob = rawProblem.toLowerCase();
  const cats = (business.categories || []).map((c) => c.toLowerCase()).join(' ');
  const combined = `${prod} ${prob} ${cats} ${business.productService?.toLowerCase() || ''}`;

  // 1. Short-Form Video, Reels, Shorts, Subtitles, Memes (e.g. SyncFlow AI)
  if (
    combined.includes('reel') ||
    combined.includes('video') ||
    combined.includes('short') ||
    combined.includes('meme') ||
    combined.includes('clip') ||
    combined.includes('hook') ||
    combined.includes('tiktok')
  ) {
    return {
      deliverable: 'short-form reel copy and viral hooks',
      costAnchor: 'Fiverr freelancers charge $50 per reel script',
      agencyAnchor: 'Agencies charge $2,500/mo to edit 9:16 short-form reels',
      frictionAnchor: 'spending 15 hours editing reels that get 200 views',
      timeAnchor: '3 seconds',
      visualBrollCue:
        'Split screen: $50 Fiverr order invoice vs. high-speed screen capture of SyncFlow AI generating 10 viral hooks in 3 seconds.',
    };
  }

  // 2. AI Search Engine, Research, Multi-Tab Synthesis (e.g. Google AI, research tools)
  if (
    combined.includes('search') ||
    combined.includes('paper') ||
    combined.includes('research') ||
    combined.includes('engine') ||
    combined.includes('google')
  ) {
    return {
      deliverable: 'synthesizing 40 research papers into a custom gym split',
      costAnchor: 'Consultants charge $150/hr for competitive research summaries',
      agencyAnchor: 'Agencies charge $3,000/mo for manual industry market research',
      frictionAnchor: 'opening 35 browser tabs and reading through SEO spam for 4 hours',
      timeAnchor: '0.2 seconds',
      visualBrollCue:
        'Fast-motion screencast: 35 chaotic Chrome tabs collapsing into a single, clean 5-point executive summary in 0.2s.',
    };
  }

  // 3. Photo Editing, Object Removal, Retouching
  if (
    combined.includes('photo') ||
    combined.includes('retouch') ||
    combined.includes('tourist') ||
    combined.includes('photobomb') ||
    combined.includes('background') ||
    combined.includes('photoshop')
  ) {
    return {
      deliverable: 'removing background tourists from vacation photos',
      costAnchor: 'Photoshop retouchers charge $40 to clean a single photo',
      agencyAnchor: 'Design agencies charge $500 to batch-retouch product photos',
      frictionAnchor: 'spending 4 hours manual lasso-tooling in Photoshop',
      timeAnchor: '1 tap',
      visualBrollCue:
        'Interactive swipe slider: A crowded vacation landmark photo instantly erasing every stranger into a pristine private shoot in 1 tap.',
    };
  }

  // 4. Copywriting, Landing Pages, Website Copy
  if (
    combined.includes('copy') ||
    combined.includes('writing') ||
    combined.includes('landing') ||
    combined.includes('email') ||
    combined.includes('page')
  ) {
    return {
      deliverable: 'high-converting website landing page copy',
      costAnchor: 'Fiverr freelancers charge $50 for website copy',
      agencyAnchor: 'Copywriters charge $1,500 per landing page',
      frictionAnchor: 'staring at a blank Google Doc for 6 hours',
      timeAnchor: '3 seconds',
      visualBrollCue:
        'Time-lapse screen capture: A blank landing page wireframe auto-filling headline, subhead, bullet points, and CTA in 3 seconds.',
    };
  }

  // 5. Study, Notes, Lectures, Exams
  if (
    combined.includes('note') ||
    combined.includes('lecture') ||
    combined.includes('study') ||
    combined.includes('exam') ||
    combined.includes('student')
  ) {
    return {
      deliverable: 'exam study guides and flashcards from 3-hour audio lectures',
      costAnchor: 'Tutors charge $60/hr to break down college lecture notes',
      agencyAnchor: 'Test-prep companies charge $200 for semester study summaries',
      frictionAnchor: 're-watching a 3-hour monotonous lecture at 2x speed at midnight',
      timeAnchor: '15 seconds',
      visualBrollCue:
        'Split capture: A 3-hour lecture audio waveform instantly synthesizing into color-coded bullet points and exam flashcards.',
    };
  }

  // 6. General High-Conversion SaaS / E-commerce / Automation
  const cleanDeliverable = cleanClause(rawProduct, 5) || 'automated customer workflows';
  return {
    deliverable: cleanDeliverable,
    costAnchor: `Freelancers charge $50/hr for ${cleanDeliverable}`,
    agencyAnchor: `Agencies charge $2,500/mo for manual ${cleanDeliverable}`,
    frictionAnchor: `spending 14 hours a week manually dealing with ${cleanClause(rawProblem, 5)}`,
    timeAnchor: '3 seconds',
    visualBrollCue:
      `High-contrast before/after: 10 manual spreadsheet tabs vs. ${brand} executing the entire workflow in 3 seconds.`,
  };
}

function generateHooksForMeme(
  meme: RawMemeItem,
  business: BusinessProfile,
  index: number
): { primaryHook: string; alternativeHooks: string[]; rationale: string; caption: string } {
  const brand = business.companyName || business.name || 'SyncFlow AI';
  const rawProblem = normalizeSmashedWords(business.problemSolved || 'hours of tedious manual work');
  const rawBenefit = normalizeSmashedWords(business.keyBenefits || 'finishing in 30 seconds');
  const rawProduct = normalizeSmashedWords(business.productService || 'AI workflow engine');
  const rawAudience = (business.audience || 'creators and founders').toLowerCase();

  const action = meme.actions?.[0] || 'reacting';
  const mood = (meme.mood_and_vibe || 'viral').toLowerCase();

  const shortBenefit = formatBenefitStatement(cleanClause(rawBenefit, 6));
  const productWithArticle = withArticle(cleanClause(rawProduct, 6));
  const singularAudience = toSingularAudience(rawAudience);
  const pluralAudience = toPluralAudience(rawAudience);

  // Extract Niche Context & Immediate Cost Anchors
  const ctx = resolveNicheDeliverable(business, rawProduct, rawProblem);

  // 4-Part High-Conversion Hook Architecture:
  // 1. Immediate Cost Anchor ($50 on Fiverr, $2,500/mo agency)
  // 2. Concrete Deliverable (website copy, short-form reel copy, etc.)
  // 3. Extreme Contrast (Friction vs. 3-Second Magic Solution)
  // 4. Sets up Visual B-Roll Payoff
  const creativeHooks: string[] = [
    // Angle 1: Direct Cost Anchor (Fiverr $50 vs 3-second AI)
    `Fiverr freelancers charge $50 for ${ctx.deliverable}, but ${brand} does it in ${ctx.timeAnchor}.`,

    // Angle 2: Agency Anchor ($2,500/mo vs instant automated software)
    `${ctx.agencyAnchor}, while ${brand} generates 10 viral variations in ${ctx.timeAnchor} flat.`,

    // Angle 3: The Extreme Contrast (Friction vs Magic)
    `The friction: ${ctx.frictionAnchor}.\nThe solution: ${brand} in ${ctx.timeAnchor}.`,

    // Angle 4: Curiosity / Why Pay More
    `Why pay $50 for ${ctx.deliverable} when ${brand} creates 15 tested angles in ${ctx.timeAnchor}?`,

    // Angle 5: Unpopular Opinion with Cost Anchor
    `Unpopular opinion: Paying $50 for ${ctx.deliverable} in 2026 is self-inflicted pain when ${brand} exists.`,

    // Angle 6: Direct Competitive Advantage
    `Every ${singularAudience} still paying for ${ctx.deliverable} manually is literally funding their competitors.`,

    // Angle 7: The Breakthrough Moment
    `The exact second you stop ${ctx.frictionAnchor} because ${brand} ${shortBenefit}.`,

    // Angle 8: High-Value POV with Concrete Deliverable
    `POV: you unlock ${brand} and generate ${ctx.deliverable} in ${ctx.timeAnchor} instead of 4 hours.`,
  ];

  // Emotion/physical meme adjustments
  if (mood.includes('cry') || action.includes('cry') || action.includes('sad')) {
    creativeHooks.unshift(`me realizing I paid $50 on Fiverr for ${ctx.deliverable} when ${brand} does it in ${ctx.timeAnchor} 😭`);
  } else if (mood.includes('dance') || action.includes('dance') || action.includes('celebrat')) {
    creativeHooks.unshift(`how it feels when ${brand} delivers ${ctx.deliverable} in ${ctx.timeAnchor} and saves you $2,500 🕺`);
  } else if (mood.includes('type') || action.includes('typing')) {
    creativeHooks.unshift(`me prompting ${brand} to generate ${ctx.deliverable} in ${ctx.timeAnchor} flat:`);
  }

  const primaryHook = creativeHooks[index % creativeHooks.length];
  const alternativeHooks = creativeHooks.filter((h) => h !== primaryHook).slice(0, 3);

  // Deep, Multi-line Spaced Captions with Concrete Context and Visual Payoffs
  const captions = [
    // Format 1: The "Cost Anchor & Extreme Contrast" Breakdown
    `Fiverr freelancers charge $50 for ${ctx.deliverable}, but ${brand} does it in ${ctx.timeAnchor}. 🤯\n\nHere is the exact breakdown:\n❌ Old Way: $50 to $2,500/mo, 3–5 day turnaround, zero retention guarantee\n✅ ${brand}: 1 tap, ${ctx.timeAnchor} output, optimized for 70%+ average watch time\n\n🎬 Visual Payoff Cue:\n${ctx.visualBrollCue}\n\nStop playing life on hard mode besties.\n\n👉 Test ${brand} free at the link in bio!`,

    // Format 2: The "Friction vs Magic Solution" Story
    `real talk: why is everyone still doing ${ctx.deliverable} the hard way??\n\n${ctx.agencyAnchor}.\n\nMeanwhile, creators using ${brand} are generating 15 tested hooks and scheduling directly to Instagram before their morning coffee is even brewed.\n\n⚡ Deliverable: ${ctx.deliverable}\n⚡ Turnaround: ${ctx.timeAnchor}\n⚡ Cost: Free to start\n\n🎬 On-screen cue:\n${ctx.visualBrollCue}\n\nDrop a 🔥 if you need this setup, or tap the link in bio!`,

    // Format 3: The "Unpopular Opinion" Hook
    `unpopular opinion: paying $50 for ${ctx.deliverable} in 2026 is an unnecessary tax on your business. 💀\n\n${brand} is ${productWithArticle} that ${shortBenefit} in ${ctx.timeAnchor}.\n\n🎬 Visual cue:\n${ctx.visualBrollCue}\n\nSave this post so you don't forget when you need it 📌\n\nLink in bio to get instant access 👇`,

    // Format 4: The "Before vs After" Transformation
    `before ${brand}:\n❌ Stressed out\n❌ ${ctx.frictionAnchor}\n❌ Waiting 4 days for a freelancer\n\nafter ${brand}:\n✅ Done in ${ctx.timeAnchor}\n✅ ${shortBenefit}\n✅ 10 viral variations tested in real-time\n\n🎬 Visual B-Roll:\n${ctx.visualBrollCue}\n\nWork smarter, not harder. Link in bio! ✨`,
  ];

  const caption = captions[index % captions.length];
  const rationale = `Viral Anchor Strategy: Leads with "${ctx.costAnchor}" to anchor immediate financial friction, specifies "${ctx.deliverable}" to filter the target audience, and contrasts with "${ctx.timeAnchor}" speed.\n\n🎬 Visual B-Roll Direction:\n${ctx.visualBrollCue}`;

  return { primaryHook, alternativeHooks, rationale, caption };
}

// Generate structured 3-slide storytelling sequence for photo carousel ads
function generateCarouselSlides(
  meme: RawMemeItem,
  business: BusinessProfile,
  primaryHook: string
): CarouselSlide[] {
  const brand = business.companyName || business.name || 'SyncFlow AI';
  const rawProblem = normalizeSmashedWords(business.problemSolved || 'hours of tedious manual work');
  const rawProduct = normalizeSmashedWords(business.productService || 'AI workflow engine');
  const ctx = resolveNicheDeliverable(business, rawProduct, rawProblem);
  const pluralAudience = toPluralAudience((business.audience || 'creators').toLowerCase());

  const videoId = meme.video_id || '';

  if (videoId.includes('photo_004_crying_girl') || meme.id.includes('photo_004')) {
    return [
      {
        image_url: '/videos/photo_004_crying_girl_tears.jpg',
        hook: primaryHook,
      },
      {
        image_url: '/videos/photo_005_crying_peace_sign.jpg',
        hook: `me pretending I'm totally fine while ${ctx.frictionAnchor} until 4 AM ✌️😭`,
      },
      {
        image_url: '/videos/frames/raw_53_f1.jpg',
        hook: `the exact second you switch to ${brand} and generate ${ctx.deliverable} in ${ctx.timeAnchor} ✨`,
      },
    ];
  }

  if (videoId.includes('photo_005_crying_peace') || meme.id.includes('photo_005')) {
    return [
      {
        image_url: '/videos/photo_005_crying_peace_sign.jpg',
        hook: primaryHook,
      },
      {
        image_url: '/videos/photo_004_crying_girl_tears.jpg',
        hook: `behind the scenes when I realized people spend $50 on Fiverr for ${ctx.deliverable} 😭`,
      },
      {
        image_url: '/videos/frames/raw_21_f1.jpg',
        hook: `never doing it the hard way again. ${brand} is the cheat code for ${pluralAudience} ☕✨`,
      },
    ];
  }

  if (videoId.includes('photo_059_woman_running') || meme.id.includes('photo_059')) {
    return [
      {
        image_url: '/videos/photo_059_woman_running_to_catch_bus_meme.jpg',
        hook: primaryHook,
      },
      {
        image_url: '/videos/photo_004_crying_girl_tears.jpg',
        hook: `realizing manual work took 5 hours and the client deadline is in 10 minutes 💀`,
      },
      {
        image_url: '/videos/frames/raw_30_f1.jpg',
        hook: `how ${pluralAudience} scale 10x with ${brand}: automate ${ctx.deliverable} in ${ctx.timeAnchor} and chill 📈`,
      },
    ];
  }

  // Generic fallback for any other photo carousel meme
  return [
    {
      image_url: meme.video_url || `/videos/${meme.video_id}`,
      hook: primaryHook,
    },
    {
      image_url: '/videos/photo_005_crying_peace_sign.jpg',
      hook: `trying to convince myself that ${ctx.frictionAnchor} is building character ✌️`,
    },
    {
      image_url: '/videos/frames/raw_53_f1.jpg',
      hook: `or you could just let ${brand} generate ${ctx.deliverable} in ${ctx.timeAnchor} ✨`,
    },
  ];
}

// Generate adapted meme deck based on business profile
export function generateMemeFeed(business: BusinessProfile): MemeTemplate[] {
  const memes = (memeCatalogRaw as RawMemeItem[]) || [];

  const scoredMemes = memes.map((meme, idx) => {
    let score = 75;
    const searchable = [
      meme.category,
      meme.mood_and_vibe,
      meme.detailed_description,
      ...(meme.actions || []),
      ...(meme.search_keywords || []),
    ].join(' ').toLowerCase();

    for (const cat of business.categories || []) {
      if (searchable.includes(cat.toLowerCase())) score += 12;
    }

    if (business.businessModel === 'B2B' && (searchable.includes('explaining') || searchable.includes('pitch') || searchable.includes('coding') || searchable.includes('whiteboard'))) {
      score += 15;
    }
    if (business.businessModel === 'B2C' && (searchable.includes('lifestyle') || searchable.includes('funny') || searchable.includes('crying') || searchable.includes('car'))) {
      score += 15;
    }

    const words = `${business.problemSolved} ${business.keyBenefits} ${business.productService}`.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (w.length > 4 && searchable.includes(w)) {
        score += 4;
      }
    }

    const { primaryHook, alternativeHooks, rationale, caption } = generateHooksForMeme(meme, business, idx);
    const isCarousel = Boolean(meme.is_carousel || meme.video_id.endsWith('.jpg') || meme.video_id.endsWith('.png'));
    const slides = isCarousel ? generateCarouselSlides(meme, business, primaryHook) : undefined;

    const brandClean = (business.companyName || business.name || 'marketing').toLowerCase().replace(/[^a-z0-9]/g, '');
    const hashtags = [
      `#${brandClean}`,
      '#viralreels',
      '#genzhacks',
      '#growthhack',
      '#productivity',
      '#fyp',
    ];

    return {
      id: meme.id,
      video_id: meme.video_id,
      video_url: meme.video_url || `/videos/${meme.video_id}`,
      is_carousel: isCarousel,
      slides,
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
    soundAuthor: business.companyName || 'business-marketing-engine',
    views: '120k',
    defaultHook: m.hook,
    whyRationale: m.whyRationale,
    isCarousel: m.is_carousel,
    slides: m.slides,
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
