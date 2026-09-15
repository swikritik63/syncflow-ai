# Fastlane (ReelCat) - Product & Onboarding Specification

## 1. Product Vision & Category Collision
- **Hackathon**: RevenueCat Shipaton 2026.
- **Theme Collision**: **13. Business** × **17. Photo & Video**.
- **The Core Value Proposition**:
  Most businesses, SaaS founders, e-commerce stores, and mobile app developers struggle with short-form video marketing (TikTok, Instagram Reels, YouTube Shorts). Creating viral videos is slow, expensive, and intimidating.
  
  **Fastlane** transforms viral video marketing into a high-frequency, Tinder-style swipe experience:
  1. **Zero Login Friction**: The user enters immediately into a high-converting brand intake questionnaire.
  2. **Multimodal Meme & Video RAG**: Instantly matches the user's business model, audience, problem, and benefits with a catalog of 66 battle-tested viral meme templates.
  3. **Tinder Swipe Feed**: Businesses swipe through personalized 9:16 video cards with kinetic hooks.
  4. **1-Click Instagram & Calendar Deployment**: Swiping right or clicking the green check instantly schedules the reel, adds it to their calendar, or posts to Instagram.
  5. **RevenueCat Monetization**: Monetizes pro features like HD watermark removal, auto-publishing, green-screen compositing, and unlimited scheduled reels.

---

## 2. Zero-Login Onboarding Architecture

Fastlane requires **no sign-up or login** before experiencing the core magic. The onboarding flow saves directly to browser `localStorage` (`fastlane_business_profile`) so state is preserved across refreshes.

### Screen 1: Brand & Persona Profile
- **Header**: "Welcome to Fastlane"
- **Banner**: *"Everything you enter here will be used directly across the platform to craft your viral hooks."*
- **Inputs**:
  1. **Company Logo**: Upload button (supports PNG, JPG max 5MB with live circular image preview, or auto-generates a branded gradient avatar if skipped).
  2. **Your Name**: Full name or first name (e.g., "Swikriti").
  3. **Company Name**: Brand or app name (e.g., "Fastlane", "Lumina AI").
  4. **Product/Service**: Detailed description of what the company offers (e.g., "An autonomous AI agent platform that turns customer support into instant resolutions").
  5. **Audience**: Primary demographic and target buyers (e.g., "Founders, Customer Support Leads, E-commerce store managers, Indie hackers").
  6. **Problem Solved**: The painful frustration eliminated (e.g., "Spending 6 hours a day replying to repetitive support tickets and losing impatient customers").
  7. **Key Benefits**: Measurable positive outcomes (e.g., "90% deflection rate, 24/7 instant replies, under 2-minute setup, 10x cheaper than human agents").
  8. **Tone/Positioning**: Brand voice style (e.g., "Witty, relatable, authoritative yet playful, bold tech-forward").
  9. **Things to Avoid**: Negative constraints or off-brand topics (e.g., "No corporate jargon, no boring corporate stock photos, don't mention legacy enterprise competitors").
- **Navigation Button**: `Continue →`

---

### Screen 2: Business Classification
- **Headline**: "What type of business do you run?"
- **Subheadline**: *"This helps us create content that resonates with your audience."*
- **Section 1: Business Model** (Single Select - Card selector with active ring & checkmark):
  - `B2B` (Business to Business)
  - `B2C` (Business to Consumer)
  - `Both` (Hybrid / B2B2C)
- **Section 2: Business Category** (Multi-Select - Grid cards with icons & badges):
  - `E-commerce` 🛍️
  - `SaaS` 💻
  - `Agency` 🏢
  - `Services` 🛠️
  - `Marketplace` 🌐
  - `Media/Content` 🎬
  - `Mobile app` 📱
  - `Other` ✨
- **Navigation Buttons**:
  - `← Back` (Returns to Screen 1 with state preserved)
  - `Generate Content Deck →` (Validates inputs, saves to storage, and initiates generation)

---

### Screen 3: The Content Cooking Animation
- **Trigger**: Displayed immediately upon submitting Screen 2.
- **Visuals**:
  - Central pulsing and glowing icon (AI Brain / Sparkle flame with animated violet/indigo gradient glow).
  - Headline: *"Generating more suggestions..."*
  - Subtitle: *"Cooking up fresh content ideas for you. Hang tight! This won't take long..."*
  - Animated progress bar / multi-step status stepper:
    - Step 1: `Analyzing brand tone and target audience...` ✓
    - Step 2: `Searching 66 viral video meme blueprints...` ✓
    - Step 3: `Drafting high-conversion kinetic hooks...` ✓
    - Step 4: `Optimizing for Instagram & TikTok algorithms...` ✓
  - Total duration: 2.2 seconds (fast yet delivers high perceived value), then smoothly reveals the Tinder Deck!

---

## 3. Data Schema (TypeScript)

```typescript
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

export interface OnboardingProfile {
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
  onboardedAt: string;
}
```
