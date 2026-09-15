export type BusinessModel = 'B2B' | 'B2C' | 'Both';

export type BusinessCategory =
  | 'E-commerce'
  | 'SaaS'
  | 'Agency'
  | 'Services'
  | 'Marketplace'
  | 'Media/Content'
  | 'Mobile app'
  | 'Other';

export interface BusinessProfile {
  name: string;
  companyName: string;
  logoUrl?: string;
  productService: string;
  audience: string;
  problemSolved: string;
  keyBenefits: string;
  tonePositioning: string;
  thingsToAvoid: string;
  businessModel: BusinessModel;
  categories: BusinessCategory[];
  onboarded?: boolean;

  // Backwards compatibility aliases
  tagline?: string;
  category?: string;
  targetAudience?: string;
  keyBenefit?: string;
  painPoint?: string;
}

export type Category = 'tech' | 'ecommerce' | 'saas' | 'local_biz' | 'creative' | 'fitness';

export type MarketingAngle = 'curiosity' | 'negativity_bias' | 'fomo' | 'speed_hack' | 'comparison' | 'relatable';

export interface SubtitleStyle {
  textColor: string;
  bgColor: string;
  fontStyle: 'bold' | 'highlight' | 'kinetic' | 'neon';
  position: 'center' | 'top' | 'bottom';
}

export interface MemeTemplate {
  id: string;
  video_id: string;
  video_url: string;
  is_carousel: boolean;
  duration: string;
  category: string;
  detailed_description: string;
  objects_and_elements: string[];
  actions: string[];
  mood_and_vibe: string;
  search_keywords: string[];
  hook: string;
  alternativeHooks: string[];
  whyRationale: string;
  caption: string;
  hashtags: string[];
  viralScore?: number;
}

// Backward compatibility for existing components
export interface ViralTemplate {
  id: string;
  title: string;
  category: Category | string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  soundName: string;
  soundAuthor: string;
  views: string;
  defaultHook: string;
  subtitleStyle: SubtitleStyle;
  hashtags: string[];
  viralScore: number;
  marketingAngle: MarketingAngle;
  whyRationale?: string;
  isCarousel?: boolean;
}

export interface ScheduledPost {
  id: string;
  templateId: string;
  videoUrl: string;
  hook: string;
  caption: string;
  hashtags: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published';
  viewsForecast: string;
  channel?: 'instagram' | 'tiktok' | 'youtube';
}

export interface ProductPhotoAsset {
  id: string;
  name: string;
  originalImage: string;
  processedImage: string;
  preset: 'amazon_white' | 'luxury_marble' | 'neon_cyber' | 'minimalist_studio';
  status: 'ready' | 'processing';
}

export interface GeneratedVideoProject {
  id: string;
  title: string;
  engine: 'gemini_omni_flash' | 'wan_2_1' | 'minimax_hailuo' | 'elevenlabs_talking_head';
  prompt: string;
  videoUrl: string;
  duration: number;
  status: 'completed' | 'rendering';
  createdAt: string;
}

export interface RevenueCatPlan {
  id: string;
  identifier: string;
  title: string;
  price: string;
  period: string;
  popular?: boolean;
  features: string[];
}
