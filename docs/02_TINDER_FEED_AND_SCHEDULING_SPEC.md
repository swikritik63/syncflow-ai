# Fastlane - Tinder Swipe Feed & Scheduling Specification

## 1. Feed UX Architecture (Tinder-Style Card Deck)

The Fastlane Feed turns social media brainstorming into an addictive swipeable experience. Users evaluate high-potential viral video ideas one by one.

### 1.1 Card Deck Visuals & Layout
- **Container**: 9:16 vertical phone aspect ratio card stack.
- **Card Layers**:
  - Top Card: Active, interactive, draggable, responds to touch/pointer and keyboard shortcuts.
  - Background Cards (1 to 2): Scaled down (e.g. `scale(0.95)`, `translateY(12px)`) with subtle shadow and lowered opacity for 3D depth perception.
- **Top Metadata Bar**:
  - **Type Badge**: `Video Meme` or `Slideshow` (subtle dark pill with frosted backdrop-blur).
  - **Category Tag**: Pill showing matched niche (e.g., `SaaS`, `B2B`, `E-commerce`).
  - **"Why This Content?" Pill**:
    - Interactive pill with info icon.
    - When clicked, smoothly expands an explanation card or bottom sheet:
      *"Why this works for your brand: Matches your audience frustration with 'manual support tickets' using hyper-animated whiteboard pitching to create an engaging POV hook."*
- **Card Center Media**:
  - High-definition 9:16 MP4 video looping smoothly (served locally from `/videos/...` without buffering) or multi-slide photo carousel with slide counter dots (`• • •`).
  - Play/Pause toggle on tap.
  - Sound/Mute toggle button in corner.
- **Dynamic Kinetic Hook Overlay**:
  - Rendered over the lower third or middle of the video.
  - Stylized in viral TikTok/Reels typography: High-contrast white bold font, dark drop shadow / semi-opaque frosted backplate.
  - Dynamically personalized with the user's brand name, audience, and problem:
    - *Example*: `"pov: Fastlane finally made ai agents for customer support teams"`
    - *Example*: `"When your clients realize Fastlane deflects 90% of tickets in 2 minutes"`
    - *Example*: `"Stop spending 6 hours on support tickets when Fastlane exists"`

---

## 2. Gesture Controls & Action Dock

### 2.1 Three-Button Floating Action Dock
Located directly below the card deck:
1. **❌ Reject Button (Left)**:
   - Round red circle button with white `X` icon.
   - Hover: Expands slightly with red glow.
   - Click / Key `[←]`: Triggers exit animation to the left (fly left offscreen with rotation `rotate(-20deg)` and red tint overlay). Moves immediately to the next card.
2. **✏️ Customize / Edit Button (Center)**:
   - Smaller round dark pill with pencil icon.
   - Click: Opens Hook & Caption Customizer modal where the user can tweak the hook text, select alternative AI hook formulas, or edit the hashtags.
3. **✅ Approve Button (Right)**:
   - Round green circle button with white checkmark icon.
   - Hover: Expands with green glow.
   - Click / Key `[→]`: Triggers card fly right offscreen with green tint overlay and opens the **Schedule Post Modal**.

### 2.2 Fluid Touch & Keyboard Controls
- **Swipe Left**: Reject card.
- **Swipe Right**: Approve card.
- **Keyboard Shortcuts**:
  - `Left Arrow [←]`: Reject.
  - `Right Arrow [→]`: Approve.
  - `Space`: Pause/Play video.

---

## 3. Post-Approval Scheduling Flow (Image 3 Mockup)

When a card is approved (via Green Check or swipe right), the **Schedule Post Modal** appears with pre-filled AI metadata:

### 3.1 Modal Layout & Components
1. **Header**:
   - Title: "Schedule Post"
   - Thumbnail preview of the approved card and hook.
2. **Destination Channel Selector**:
   - Checkbox: **Instagram** (Checked by default, with Instagram icon and handle `@fastlane_app`).
   - TikTok / YouTube Shorts (Badged with "Pro" unlock).
3. **Smart Timing Picker**:
   - Recommended Peak Slots:
     - `Today, 6:30 PM (Peak Engagement)`
     - `Tomorrow, 12:15 PM (Lunch Break)`
     - `Custom Date & Time...`
4. **Auto-Generated Viral Caption & Hashtags**:
   - Editable caption tailored from the brand's key benefits and problem solved.
   - Trending hashtag pills (e.g. `#b2bmarketing`, `#saashacks`, `#fastlane`, `#viralreels`).
5. **Primary Action Buttons**:
   - **`Add to Calendar`**:
     - Generates an official standard `.ics` (iCalendar) calendar file that the user can import into Apple Calendar, Google Calendar, or Outlook.
     - Adds the post directly into Fastlane's in-app **Calendar View** tab.
   - **`Post to Instagram`**:
     - Connects with Instagram Graph API / simulates live publish.
     - If free tier post limit reached, triggers RevenueCat Paywall modal.
   - Confetti burst animation upon confirmation (`canvas-confetti`).

---

## 4. Calendar Tab Integration

- Fastlane features a dedicated **Calendar Tab**:
  - Monthly / Weekly view showing scheduled video posts.
  - Each item shows thumbnail, time, target platform (Instagram icon), and status (`Scheduled`, `Published`).
  - Allows 1-click preview, rescheduling, or downloading of the asset bundle.
