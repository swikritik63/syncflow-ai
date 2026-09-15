# Fastlane - Multi-Agent Orchestration Plan: Antigravity, Hermes & Codex Astra

## 1. Multi-Agent Team Architecture

To deliver an exceptional, award-winning hackathon submission for RevenueCat Shipaton26, we utilize a coordinated 3-agent pipeline:

```
                      ┌─────────────────────────────────────────┐
                      │        Antigravity (Orchestrator)        │
                      │  - System Architecture & Docs           │
                      │  - SQLite RAG Indexing & Asset Serving  │
                      │  - Multi-Agent Task Dispatch & QA       │
                      └────────────────────┬────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
  ┌───────────────────────────────────┐         ┌───────────────────────────────────┐
  │     Hermes (AI Video Director)    │         │      Codex Astra (gpt-6-astra)    │
  │ - Copywriting Hook Engine         │         │ - Next.js 16 / React 19 UI Engine │
  │ - "Why This Content?" Rationale   │         │ - Tinder Swipeable Card Deck      │
  │ - Viral Marketing Angle Scoring   │         │ - Onboarding Multi-Step Wizard    │
  │ - Hashtag & Caption Generation    │         │ - Schedule & Instagram Modal      │
  └───────────────────────────────────┘         └───────────────────────────────────┘
```

---

## 2. Agent Responsibilities & Task Division

### 2.1 Antigravity (Lead Orchestrator)
- **Status**: Active.
- **Responsibilities**:
  1. Author and maintain all architectural documentation in `./docs/`.
  2. Index all 66 JSON metadata scripts into `./video_rag/videos.db` with SQLite FTS5.
  3. Ensure `./public/videos/` correctly serves all 66 video/photo meme assets.
  4. Generate calibrated prompts for Hermes and Codex Astra.
  5. Execute integration testing and end-to-end QA.

### 2.2 Hermes (AI Video Director & Copywriting Specialist)
- **CLI Invocations**: `hermes -z "<prompt>" -r 20260915_002822_cf8285 --yolo`
- **Responsibilities**:
  1. Analyze user onboarding answers (Product/service, Audience, Problem solved, Key benefits, Tone, Avoid, Model, Categories).
  2. Implement the dynamic Hook Generator library in TypeScript (`src/lib/hookEngine.ts`) mapping onboarding persona data to the 66 meme archetypes.
  3. Implement the intelligent "Why This Content?" rationale synthesizer.

### 2.3 Codex Astra (Full-Stack Frontend & Interaction Engineer)
- **CLI Invocations**: `codex exec --dangerously-bypass-approvals-and-sandbox -m gpt-6-astra -c model_reasoning_effort="low" "<prompt>"`
- **Responsibilities**:
  1. Build the zero-login **Onboarding Wizard** (`src/components/OnboardingWizard.tsx`) with Screen 1 (Brand Profile), Screen 2 (Business Model & Category Grid), and Screen 3 (Cooking Animation).
  2. Build the **Tinder Swipe Feed** (`src/components/TinderFeed.tsx`) with 9:16 card stack, left/right reject/approve buttons (`[←]` / `[→]`), and rationale pill.
  3. Build the **Schedule Post Modal** (`src/components/ScheduleModal.tsx`) with Instagram toggle, timing selector, `.ics` Calendar export, and RevenueCat paywall trigger.
  4. Wire everything cleanly into `src/app/page.tsx`.
