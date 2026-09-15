# Fastlane - Multimodal Video RAG & Meme Catalog Specification

## 1. Catalog Overview
The asset library comprises **66 curated viral meme templates** (63 MP4 video memes + 3 photo carousel memes) cataloged in `/videos/` and `/scripts/`.
Every asset has an exhaustive 9-field semantic JSON representation:
- `video_id`: Filename mapping directly to `/public/videos/[video_id]`.
- `duration`: Runtime (e.g. `17s`, `8s`, `24s`).
- `category`: e.g. `Explaining & Pitching Memes`, `Coding & Frustration Memes`, `Relatable Struggles & Realizations`.
- `source_url`: Pinterest pin reference.
- `detailed_description`: 6 to 10 sentences detailing the chronological frame-by-frame visual actions.
- `objects_and_elements`: Key visual props (e.g. whiteboard, marker, laptop, headset).
- `actions`: Human gestures (e.g. frantic typing, pointing, facepalm, whiteboard sketching).
- `mood_and_vibe`: Psychological tone (e.g. hyperactive, despair, breakthrough, comedic relief).
- `search_keywords`: 12 high-intent search phrases.

---

## 2. SQLite Database Schema & Full-Text Search (FTS5)

To guarantee instant (< 50ms) matching without external network latency, Fastlane uses an embedded SQLite database with FTS5:

```sql
-- Core metadata table
CREATE TABLE IF NOT EXISTS memes (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    category TEXT NOT NULL,
    duration TEXT,
    mood_and_vibe TEXT,
    objects TEXT,            -- JSON array
    actions TEXT,            -- JSON array
    keywords TEXT,           -- JSON array
    description TEXT,
    source_url TEXT
);

-- FTS5 Virtual Table for semantic keyword matching
CREATE VIRTUAL TABLE IF NOT EXISTS memes_fts USING fts5(
    id UNINDEXED,
    filename,
    category,
    mood_and_vibe,
    description,
    actions,
    keywords,
    tokenize = 'porter unicode61'
);
```

---

## 3. RAG Matching Algorithm

When an onboarded user completes their brand profile:
1. **Query Construction**:
   A weighted composite search term is generated from the user's questionnaire:
   - Primary: `productService` + `problemSolved` + `categories`
   - Secondary: `audience` + `businessModel`
   - Tone Modifier: `tonePositioning` (e.g. witty, sarcastic, bold, energetic)
2. **Relevance Scoring**:
   - Matches against `memes_fts` using SQLite `bm25()` rank.
   - Bonus weighting (+25%) for memes matching the specific `businessModel` (B2B SaaS vs B2C E-commerce).
   - Top 10 to 15 candidates are ranked and selected for the swipe card deck.

---

## 4. Viral Hook Adaptation Formulas

For each matched meme, Fastlane synthesizes a viral kinetic hook dynamically tailored to the user's answers:

| Formula | Pattern | Example Output |
| :--- | :--- | :--- |
| **POV (Point of View)** | `pov: [company] finally solved [problem] for [audience]` | *"pov: Fastlane finally solved 6-hour support queues for SaaS founders"* |
| **The Realization** | `When your [audience] realizes [company] gives them [benefit]` | *"When your team realizes Fastlane gives them 24/7 instant AI ticket resolutions"* |
| **The Contrast / Stop Doing** | `Stop [things_to_avoid] when [company] exists` | *"Stop drowning in manual support tickets when Fastlane exists"* |
| **Hypothetical Reaction** | `Me explaining how [company] [key_benefit] without [things_to_avoid]` | *"Me explaining how Fastlane cuts support costs 10x without corporate BS"* |
| **Before / After** | `My life before vs after using [company] for [problem]` | *"My life before vs after using Fastlane for customer support"* |

---

## 5. "Why This Content?" Rationale Generator

Every card features an expandable rationale explaining the psychological marketing hook:
- **Structure**:
  `[Meme Core Emotion] + [User Audience Connection] + [Business Angle]`
- **Example**:
  *"This whiteboard pitching meme taps into hyper-animated startup energy. It hooks [Audience] who are actively struggling with [Problem], immediately framing [Company] as the obvious breakthrough solution."*
