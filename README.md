# 🚀 business-marketing_engine

> **RevenueCat Shipaton 2026 Submission**  
> **Theme Collision**: **13. Business** × **17. Photo & Video**  
> Autonomous viral short-form video generation & scheduling engine for businesses, SaaS founders, and creators.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React Native Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![RevenueCat](https://img.shields.io/badge/RevenueCat-Monetized-f2545b?style=flat-square&logo=revenuecat)](https://www.revenuecat.com/)
[![LangChain](https://img.shields.io/badge/LangChain-RAG%20Engine-1C3C3C?style=flat-square)](https://langchain.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-GPT--4o--mini-6366f1?style=flat-square)](https://openrouter.ai/)

---

## 💡 The Problem & The Collision

Short-form vertical video (TikTok, Instagram Reels, YouTube Shorts) is currently the highest-converting organic customer acquisition channel on the internet. However:
- **Businesses fail at video**: Creating, filming, and editing videos takes **10–15 hours every week**.
- **Founders hate corporate stock footage**: Generic corporate videos flop and get stuck at 200 views.
- **Viral pacing is hard**: Matching business value props with viral cultural meme timing requires specialized creative direction.

### The Solution: **`business-marketing_engine`**
We collide **Business (13)** with **Photo & Video (17)**:
1. **Zero-Login Brand Intake**: A frictionless 4-step questionnaire captures your brand, offer, pain points, and target audience.
2. **Multimodal Video & Meme RAG**: Vector-searches a curated catalog of **66 battle-tested 9:16 vertical video memes** using LangChain and ChromaDB.
3. **Tinder-Style Swipe Deck**: Founders swipe right (`Approve`) or swipe left (`Reject`) on generated video concepts.
4. **TikTok/Reels Floating Hooks**: Text overlays float naturally across the top third of the video with drop-shadows and breakable lines—just like authentic viral TikToks.
5. **1-Click Instagram & Calendar Deployment**: Instantly publishes to Instagram or exports standard `.ics` calendar events with peak-engagement time slots.
6. **RevenueCat Monetization**: Native in-app subscription paywall gating unlimited scheduling, 1080p HD clean exports, and AI Green Screen compositing.

---

## 📱 Platforms & Tech Stack

| Layer | Technology | Key Highlights |
| :--- | :--- | :--- |
| **Web Frontend** | Next.js 16 (React 19), Tailwind CSS, Lucide | 9:16 mobile simulator frame, `.no-scrollbar`, responsive desktop/mobile view |
| **Native Mobile App** | React Native, Expo SDK 57, `expo-av`, `expo-linear-gradient` | PanResponder Tinder swipe gesture physics, native video playback |
| **Monetization** | Official `react-native-purchases` SDK (RevenueCat) | Entitlement `pro_access`, Annual ($149.99/yr) & Monthly ($19.99/mo) tiers |
| **RAG & Vector Search** | Python 3, LangChain, ChromaDB, SQLite FTS5 | Semantic similarity retrieval matching brand attributes to 66 video scripts |
| **AI LLM Enrichment** | OpenRouter (`openai/gpt-4o-mini`) | Generates kinetic hooks, alternative subtitles, captions, and algorithmic rationales |
| **Prompt Architecture** | Hermes 5-Formula Algorithm + Codex Astra Directives | Centrally logged in [`prompts/`](prompts/) |

---

## ✨ Core Features Walkthrough

### 1. Zero-Login 4-Step Onboarding Wizard
- **Step 1: Brand Identity**: Brand name, founder name, logo upload, and 1-tap demo presets (**🚀 B2B SaaS**, **📸 Photo App**, **💼 Fintech**, **🍵 E-Commerce**).
- **Step 2: The Offer & Target Audience**: Comfortable multiline product description and demographic targeting.
- **Step 3: Pain & Transformation**: Problem solved (the struggle), key benefit (the transformation), tone of voice, and things to avoid.
- **Step 4: Business Classification**: Selectable Business Models (`B2B`, `B2C`, `Both`) and 8 multi-select Category grid chips.
- **Step 5: Animated Cooking Loader**: Glowing brain animation with dynamic step checklist.

### 2. Authentic TikTok / Reels Floating Hook Overlay
- Floating text positioned on the **upper third of the video** (matching authentic TikTok storytelling conventions).
- High-contrast text shadows (`drop-shadow`) ensure 100% legibility across light and dark video backgrounds.
- Unobstructed viewing: The middle and lower 65% of the video are clear to watch the meme action.
- Zero robotic word slicing: Clean phrase boundaries prevent mid-word cutoffs.

### 3. RevenueCat Monetization & Paywall
- Free tier allows testing and scheduling up to 3 posts.
- Upon approving the 4th post (or tapping the Pro pill in the header), the **RevenueCat Paywall Modal** triggers.
- Fully wired with `react-native-purchases` using the `pro_access` entitlement.

---

## 📂 Project Structure

```
├── mobile/                        # Native React Native / Expo SDK 57 App
│   ├── App.tsx                    # Native Tinder Feed, 4-Step Wizard & RevenueCat Paywall
│   ├── app.json                   # Expo configuration (iOS bundle & Android package)
│   ├── src/
│   │   ├── hookEngine.ts          # Mobile meme adapter & natural hook generator
│   │   └── types.ts               # Shared TypeScript data models
│   └── assets/                    # Native icons, splash screens & meme catalog
│
├── src/                           # Next.js 16 Web Application
│   ├── app/
│   │   ├── page.tsx               # Main container with dynamic state & tabs
│   │   ├── globals.css            # Tailwind styles & .no-scrollbar utilities
│   │   └── api/recommend/route.ts # Microservice bridge with local TypeScript fallback
│   ├── components/
│   │   ├── MobileFrame.tsx        # Frameless iPhone simulator container
│   │   ├── OnboardingWizard.tsx   # Airy 4-step questionnaire + cooking screen
│   │   ├── TinderFeed.tsx         # 9:16 Tinder swipe deck with top floating hook
│   │   ├── ScheduleModal.tsx      # Instagram & calendar publish scheduler
│   │   └── PaywallModal.tsx       # RevenueCat subscription paywall
│   └── lib/
│       ├── hookEngine.ts          # Natural breakable hook formulas & scoring
│       └── calendarExport.ts      # Standard iCalendar (.ics) export generator
│
├── video_rag/                     # Python LangChain + ChromaDB Retrieval Service
│   ├── server.py                  # FastAPI server exposing /api/recommend
│   ├── langchain_rag.py           # ChromaDB vectorstore & semantic query pipeline
│   └── ai_generator.py            # OpenRouter GPT-4o-mini enrichment
│
├── prompts/                       # Master Prompt Catalog
│   ├── 00_MASTER_PROMPT_INDEX.md
│   ├── 01_HERMES_COPYWRITING_AND_DIRECTOR_PROMPTS.md
│   ├── 02_CODEX_ASTRA_ENGINEERING_PROMPTS.md
│   ├── 03_OPENROUTER_LLM_PROMPTS.md
│   └── 04_RAG_VECTOR_SEARCH_PROMPTS.md
│
├── public/videos/                 # 66 vertical 9:16 video memes and photos
├── scripts/                       # 66 JSON metadata scripts (actions, moods, keywords)
└── docs/                          # Architecture & RevenueCat specifications
```

---

## 🚀 Quickstart Guide

### 1. Web Application (Next.js 16)
```bash
# Install dependencies
pnpm install

# Start production server
pnpm build
pnpm start
# Open http://localhost:3000
```

### 2. Native Mobile App (Expo SDK 57)
```bash
cd mobile

# Install dependencies
npm install

# Run Expo development server (scan QR with Expo Go on iOS or Android)
npx expo start

# Or test native compilation
npx expo export
```

### 3. Python LangChain + ChromaDB Microservice (Optional)
```bash
# Install Python dependencies
pip install fastapi uvicorn langchain chromadb pydantic

# Launch microservice
python3 -m uvicorn video_rag.server:app --port 8000 --host 127.0.0.1
# Health check: http://127.0.0.1:8000/health
```

---

## 🏆 RevenueCat Shipaton 2026 Checklist

- [x] **Theme Collision**: Business (13) × Photo & Video (17).
- [x] **RevenueCat Integration**: Configured with `react-native-purchases`, active entitlement checking (`pro_access`), and annual/monthly packages.
- [x] **Zero-Login User Experience**: Instant onboarding saving to `localStorage` (`bme_business_profile`).
- [x] **Authentic UI/UX**: TikTok/Reels top floating hook typography, Tinder swipe physics, and loose breathing layout.
- [x] **Production Verification**: Next.js 16 production build verified; Expo iOS and Android bytecode bundles compiled with 0 errors.

---

## 📄 License
MIT License. Built for the RevenueCat Shipaton 2026 Hackathon.
