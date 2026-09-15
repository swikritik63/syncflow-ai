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

// Creative Gen-Z Hook Director: elevates raw user input into viral hooks tailored to meme emotion
function generateHooksForMeme(
  meme: RawMemeItem,
  business: BusinessProfile,
  index: number
): { primaryHook: string; alternativeHooks: string[]; rationale: string; caption: string } {
  const brand = business.companyName || business.name || 'Marketing Engine';
  const rawProblem = normalizeSmashedWords(business.problemSolved || 'hours of repetitive work');
  const rawBenefit = normalizeSmashedWords(business.keyBenefits || 'finishing in 2 minutes');
  const rawCategory = (business.category || business.categories?.[0] || '').toLowerCase();
  const rawAudience = (business.audience || '').toLowerCase();
  const action = meme.actions?.[0] || 'reacting';
  const mood = (meme.mood_and_vibe || 'viral').toLowerCase();

  // Detect niche context to provide creative, humanized angles beyond literal user words
  const isStudyOrNotes =
    rawProblem.includes('lecture') ||
    rawBenefit.includes('note') ||
    rawProblem.includes('study') ||
    rawProblem.includes('exam') ||
    rawCategory.includes('note') ||
    rawAudience.includes('student');

  const isPhotoOrVideo =
    rawCategory.includes('photo') ||
    rawProblem.includes('photo') ||
    rawBenefit.includes('photo') ||
    rawProblem.includes('photobomb') ||
    rawProblem.includes('tourist');

  const isB2BOrSaaS =
    business.businessModel === 'B2B' ||
    rawCategory.includes('saas') ||
    rawProblem.includes('support') ||
    rawProblem.includes('crm') ||
    rawProblem.includes('churn') ||
    rawProblem.includes('editing');

  let creativeHooks: string[] = [];

  if (isStudyOrNotes) {
    creativeHooks = [
      `my toxic trait was thinking I’d actually re-watch a 3-hour lecture 😭`,
      `me pretending to take notes while ${brand} transcribed the entire class in 40 secs:`,
      `unpopular opinion: writing lecture notes by hand in 2026 is pure self-inflicted pain`,
      `POV: everyone else is on hour 6 of panic while ${brand} finished your notes in 2 mins`,
      `the professor said "this won't be on the slides" so I let ${brand} cook`,
      `gatekeeping ${brand} from my study group because my GPA just jumped two whole letters`,
      `no bc why did this random app turn 4 weeks of lectures into bullet points while I slept?`,
      `bestie wake up, new student cheat code just dropped and professors are not ready`,
      `how it feels walking into finals knowing ${brand} already summarized the whole syllabus`,
      `my friend: "how did you finish the lecture notes already?"\nme with ${brand}:`,
    ];
  } else if (isPhotoOrVideo) {
    creativeHooks = [
      `the way a random stranger almost ruined my best vacation photo until this happened`,
      `no bc why did this 1-tap edit look better than 4 hours of Photoshop 💀`,
      `my friend said "you can't erase tourists without making it blurry" ... watch this:`,
      `POV: your ex was in the best picture you took all year and ${brand} erased them in 1 sec`,
      `gatekeeping this photo edit app because my aesthetic just leveled up 10x`,
      `me watching people pay $50 on Fiverr to remove a background while I use ${brand}:`,
      `unpopular opinion: bad lighting doesn't ruin photos anymore, not using ${brand} does`,
      `that exact moment when a 1-tap AI fixes what took 2 hours of editing`,
    ];
  } else if (isB2BOrSaaS) {
    creativeHooks = [
      `me watching other founders spend 15 hours editing videos that get 200 views:`,
      `bestie wake up new founder cheat code just dropped and reach 10x'd overnight`,
      `showing this to my team tomorrow so they finally let us automate customer acquisition`,
      `unpopular opinion: working 14 hours a day isn't a flex when ${brand} does it in 2 mins`,
      `my toxic trait was thinking we didn't need video marketing in 2026 😭`,
      `POV: you finally stopped burning cash on manual work because ${brand} exists`,
      `how it feels to schedule an entire month of viral content before your morning coffee`,
      `real talk: if you're still doing this manually, you're literally funding your competitors`,
    ];
  } else {
    creativeHooks = [
      `POV: you finally stopped dealing with ${cleanClause(rawProblem, 6).toLowerCase()} because ${brand} exists`,
      `my toxic trait was thinking I had to do this manually in 2026 😭`,
      `unpopular opinion: working harder isn't a flex when ${brand} solves it in 2 taps`,
      `the exact second I found the cheat code that handles ${cleanClause(rawProblem, 6).toLowerCase()}:`,
      `gatekeeping ${brand} felt like a crime so I'm finally showing you`,
      `no bc why did nobody tell me about ${brand} when I was literally losing my mind?`,
      `me trying to explain to everyone how ${brand} gives you ${cleanClause(rawBenefit, 6).toLowerCase()} in seconds:`,
      `life update: stopped stressing, started letting ${brand} handle everything`,
    ];
  }

  // Adjust for meme action / mood
  if (mood.includes('cry') || action.includes('cry') || action.includes('sad')) {
    creativeHooks.unshift(`me looking at all the hours I wasted before I discovered ${brand} 😭`);
  } else if (mood.includes('dance') || action.includes('dance') || action.includes('celebrat')) {
    creativeHooks.unshift(`how it feels when ${brand} handles the hardest part in literally 2 taps 🕺`);
  }

  const primaryHook = creativeHooks[index % creativeHooks.length];
  const alternativeHooks = creativeHooks.filter((h) => h !== primaryHook).slice(0, 3);

  // Creative Gen-Z Captions (Unique for every single video!)
  const captions = [
    `honestly gatekeeping this felt like a crime so here it is... if you're tired of ${cleanClause(rawProblem, 6).toLowerCase()}, ${brand} literally does the heavy lifting in minutes. thank me later 👇 link in bio to try it free!`,
    `real talk: why were we suffering through this manually when AI exists in 2026?? 😭 turned all my backlogged chaos into clean results in one tap. don't walk, run to the link in bio ⚡`,
    `my toxic trait used to be staring at my screen for 3 hours accomplishing zero... life update: ${brand} fixed that permanently. drop a 🔥 if you need this workflow!`,
    `POV: your friends think you worked 14 hours this weekend but you actually just let ${brand} cook in 2 minutes. work smarter, not harder besties. link in bio!`,
    `if this landed on your FYP right now, consider this your official sign to stop stressing. save this post before you forget! 🚀 link in bio to try it free`,
    `unpopular opinion: burning yourself out isn't a badge of honor. automate the boring stuff with ${brand} and take your free time back. link in bio 👇`,
    `not me finding the ultimate life hack and pretending I’ve been this organized all along 💀 check out ${brand} via link in bio!`,
    `the way this singlehandedly saved my sanity this week... how did we even survive before this existed?? link in bio to get access ✨`,
    `show this to anyone who still thinks spending hours on ${cleanClause(rawProblem, 5).toLowerCase()} is normal in 2026. link in bio to level up!`,
    `bestie emergency: stop wasting your energy. tap the link in bio and let ${brand} handle it while you actually sleep.`,
  ];

  const caption = captions[index % captions.length];
  const rationale = `Gen-Z Viral Angle: This visual (${action}, ${mood}) triggers instant pattern interruption. The hook flips audience frustration into relief, powered by ${brand}.`;

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
