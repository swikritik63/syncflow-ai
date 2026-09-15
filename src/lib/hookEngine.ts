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
function generateHooksForMeme(
  meme: RawMemeItem,
  business: BusinessProfile,
  index: number
): { primaryHook: string; alternativeHooks: string[]; rationale: string; caption: string } {
  const brand = business.companyName || business.name || 'Marketing Engine';
  const rawProblem = normalizeSmashedWords(business.problemSolved || 'hours of tedious manual work');
  const rawBenefit = normalizeSmashedWords(business.keyBenefits || 'finishing in 30 seconds');
  const rawProduct = normalizeSmashedWords(business.productService || 'AI workflow engine');
  const rawCategory = (business.category || business.categories?.[0] || '').toLowerCase();
  const rawAudience = (business.audience || 'creators and founders').toLowerCase();

  const action = meme.actions?.[0] || 'reacting';
  const mood = (meme.mood_and_vibe || 'viral').toLowerCase();

  const shortProblem = cleanClause(rawProblem, 6).toLowerCase();
  const shortBenefit = formatBenefitStatement(cleanClause(rawBenefit, 6));
  const productWithArticle = withArticle(cleanClause(rawProduct, 6));
  const singularAudience = toSingularAudience(rawAudience);
  const pluralAudience = toPluralAudience(rawAudience);

  // Detect domain for ultra-creative, scenario-based hyperscale hooks (Monetization, Gym, Workflows, College, etc.)
  const isSearchOrAI =
    rawProduct.includes('search') ||
    rawCategory.includes('search') ||
    rawProduct.includes('engine') ||
    rawProduct.includes('ai') ||
    brand.toLowerCase().includes('google') ||
    brand.toLowerCase().includes('googel') ||
    brand.toLowerCase().includes('search');

  const isPhotoOrVideo =
    rawCategory.includes('photo') ||
    rawCategory.includes('video') ||
    rawProduct.includes('photo') ||
    rawProduct.includes('video') ||
    rawProblem.includes('photobomb') ||
    rawProblem.includes('tourist') ||
    rawProblem.includes('edit');

  const isStudyOrNotes =
    rawCategory.includes('note') ||
    rawProduct.includes('note') ||
    rawProblem.includes('lecture') ||
    rawAudience.includes('student') ||
    rawProblem.includes('study');

  // Creative Pool of Hyperscale Hooks tailored to real scenarios
  let creativeHooks: string[] = [];

  if (isSearchOrAI) {
    // Creative real-world angles: Monetization, Workout split, Instant workflows, College research
    creativeHooks = [
      `POV: using ${brand} to turn 40 science papers into my exact gym split in 4 seconds`,
      `me watching people open 35 Google tabs while ${brand} found the exact answer in 0.2s`,
      `how people are lowkey using ${brand} to automate $5k/mo research workflows while sleeping`,
      `my gym buddy asked how I optimized our progressive overload so fast...\nI just used ${brand} 🤫`,
      `unpopular opinion: digging through 50 links in 2026 is self-inflicted pain when ${brand} exists`,
      `the exact second you stop ${shortProblem} forever because ${brand} ${shortBenefit}`,
      `POV: you ask ${brand} one question and it connects your entire workflow instantly`,
      `every ${singularAudience} still doing this manually is literally funding their competitors`,
      `me showing my team how ${brand} ${shortBenefit} in 30 seconds instead of 4 hours`,
      `my toxic trait was thinking I had to search manually when ${brand} is literally free`,
      `why ${pluralAudience} are obsessed with ${brand}: it's ${productWithArticle} that actually works`,
      `how it feels walking into the presentation knowing ${brand} organized everything 🕺`,
    ];
  } else if (isPhotoOrVideo) {
    creativeHooks = [
      `POV: a tourist almost ruined my favorite vacation photo until ${brand} erased them in 1 tap`,
      `no bc why does ${brand} look better than 4 hours in Photoshop 💀`,
      `my friend said "you can't fix blurry lighting without losing quality"...\nwatch what ${brand} does:`,
      `gatekeeping ${brand} from my group chat because my photos look like Vogue now`,
      `unpopular opinion: bad photos aren't the problem in 2026, not using ${brand} is`,
      `me watching people pay $50 on Fiverr while I use ${brand} in 3 seconds:`,
      `${brand} ${shortBenefit} — so you never stress over ${shortProblem} again`,
      `POV: you finally found ${productWithArticle} that edits photos like magic`,
    ];
  } else if (isStudyOrNotes) {
    creativeHooks = [
      `POV: everyone else is on hour 5 of panic while ${brand} summarized the entire syllabus`,
      `my toxic trait was thinking I'd actually re-watch a 3-hour lecture 😭`,
      `the professor said "this won't be on the slides" so I let ${brand} cook`,
      `gatekeeping ${brand} because my GPA just jumped two whole letter grades`,
      `how ${brand} turned 4 weeks of lecture chaos into bullet points while I made coffee`,
      `every ${singularAudience} who struggles with ${shortProblem} needs ${brand} right now`,
    ];
  } else {
    // General high-conversion SaaS / Business
    creativeHooks = [
      `POV: you finally stopped ${shortProblem} because ${brand} ${shortBenefit}`,
      `showing this to my team tomorrow so they finally let us automate our workflow with ${brand}`,
      `unpopular opinion: working 14 hours a day isn't a flex when ${brand} does it in 2 minutes`,
      `every ${singularAudience} needs to know: ${brand} is ${productWithArticle} that ${shortBenefit}`,
      `me after ${brand} solved ${shortProblem} before my morning coffee was even ready ☕`,
      `how ${pluralAudience} are scaling 10x faster in 2026: they stopped ${shortProblem} and switched to ${brand}`,
      `imagine if ${shortProblem} just... wasn't a problem anymore.\nthat's ${brand}.`,
      `when ${brand} ${shortBenefit} and you realize you were doing it the hard way for months`,
    ];
  }

  // Emotion/physical meme adjustments
  if (mood.includes('cry') || action.includes('cry') || action.includes('sad')) {
    creativeHooks.unshift(`me realizing I wasted months on ${shortProblem} when ${brand} ${shortBenefit} this whole time 😭`);
  } else if (mood.includes('dance') || action.includes('dance') || action.includes('celebrat')) {
    creativeHooks.unshift(`how it feels when ${brand} ${shortBenefit} and you're finally free 🕺`);
  } else if (mood.includes('angry') || mood.includes('frustrat')) {
    creativeHooks.unshift(`still dealing with ${shortProblem} in 2026?? ${brand} ${shortBenefit} — no more excuses.`);
  } else if (mood.includes('type') || action.includes('typing')) {
    creativeHooks.unshift(`me prompting ${brand} to ${shortBenefit} in 10 seconds flat:`);
  }

  const primaryHook = creativeHooks[index % creativeHooks.length];
  const alternativeHooks = creativeHooks.filter((h) => h !== primaryHook).slice(0, 3);

  // Creative Gen-Z Multi-line Spaced Captions (Distinct formatting per archetype with real breathing room)
  const captions = [
    // Format 1: The "Breakdown & Feature Value" Ad
    `POV: You just unlocked the ultimate cheat code for ${pluralAudience}. 🤯\n\nMost people spend hours on ${shortProblem}, but ${brand} does it in seconds:\n⚡ Instant intelligent workflows\n🎯 Zero manual clutter\n🚀 ${shortBenefit}\n\nIf you haven't tested ${brand} yet, you're playing life on hard mode.\n\n👉 Try it free at the link in bio!`,

    // Format 2: The "Real-world Side Hustle / Hack" Story
    `real talk: why is nobody talking about this workflow yet??\n\nInstead of wasting half your day on ${shortProblem}, you can let ${brand} handle the heavy lifting.\n\nPeople are literally using this to automate research, plan workout splits, and build $5k/mo side workflows in record time.\n\nDrop a 🔥 if you need this setup, or tap the link in bio to try it free!`,

    // Format 3: The "Unpopular Opinion" Hook
    `unpopular opinion: if you're still doing ${shortProblem} manually in 2026, you're choosing to suffer. 💀\n\n${brand} is ${productWithArticle} that ${shortBenefit}.\n\nSave this post so you don't forget when you need it 📌\n\nLink in bio to get instant access 👇`,

    // Format 4: The "Before vs After" Transformation
    `before ${brand}:\n❌ Stressed out\n❌ Hours wasted on ${shortProblem}\n❌ Overwhelmed with 50 open tabs\n\nafter ${brand}:\n✅ Done in 30 seconds\n✅ ${shortBenefit}\n✅ Free time back\n\nWork smarter, not harder besties. Link in bio! ✨`,

    // Format 5: The "Lifestyle / Gym / High-Performance" Angle
    `My favorite productivity hack right now:\n\nWhether it's optimizing research, generating exact workout splits, or handling ${shortProblem}—${brand} pulls the exact result in 2 clicks.\n\nStop burning your energy on tedious tasks.\n\n⚡ Tap the link in bio to see it in action!`,

    // Format 6: The "Quick Punch" Minimalist Drop
    `the exact moment you realize ${brand} ${shortBenefit} in literally one tap.\n\ngoodbye ${shortProblem}, hello freedom 🚀\n\nlink in bio to start free!`,
  ];

  const caption = captions[index % captions.length];
  const rationale = `Viral Strategy: ${brand} positions against "${shortProblem}" by framing ${shortBenefit} through the visual emotion of ${action} (${mood}).`;

  return { primaryHook, alternativeHooks, rationale, caption };
}

// Generate structured 3-slide storytelling sequence for photo carousel ads
function generateCarouselSlides(
  meme: RawMemeItem,
  business: BusinessProfile,
  primaryHook: string
): CarouselSlide[] {
  const brand = business.companyName || business.name || 'our tool';
  const rawProblem = normalizeSmashedWords(business.problemSolved || 'hours of tedious manual work');
  const rawBenefit = normalizeSmashedWords(business.keyBenefits || 'finishing in 30 seconds');
  const shortProblem = cleanClause(rawProblem, 6).toLowerCase();
  const shortBenefit = formatBenefitStatement(cleanClause(rawBenefit, 6));
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
        hook: `me pretending I'm totally fine while doing ${shortProblem} manually until 4 AM ✌️😭`,
      },
      {
        image_url: '/videos/frames/raw_53_f1.jpg',
        hook: `the exact second you switch to ${brand} and ${shortBenefit} in 30 seconds ✨`,
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
        hook: `behind the scenes when I realized everyone else uses ${brand} to ${shortBenefit} 😭`,
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
        hook: `realizing manual work took 5 hours and the deadline is in 10 minutes 💀`,
      },
      {
        image_url: '/videos/frames/raw_30_f1.jpg',
        hook: `how ${pluralAudience} scale 10x with ${brand}: automate it once and chill 📈`,
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
      hook: `trying to convince myself that manual ${shortProblem} is building character ✌️`,
    },
    {
      image_url: '/videos/frames/raw_53_f1.jpg',
      hook: `or you could just let ${brand} ${shortBenefit} in 30 seconds ✨`,
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
    soundAuthor: business.companyName || 'business-marketing_engine',
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
