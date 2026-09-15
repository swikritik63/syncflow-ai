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
  onboarded: boolean;
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
}
