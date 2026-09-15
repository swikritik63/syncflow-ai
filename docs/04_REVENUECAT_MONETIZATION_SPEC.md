# Fastlane - RevenueCat Monetization & Paywall Specification

## 1. Hackathon Category Collision
- **Categories**: **13. Business** × **07. Productivity**
- **The Monetization Thesis**:
  Businesses and creators will gladly pay for automated short-form video generation if it saves them 10+ hours a week of video editing and social scheduling. Fastlane uses **RevenueCat** to power its subscription paywall.

---

## 2. Subscription Offerings & Pricing

Fastlane provides two subscription tiers via RevenueCat:

| Offering Plan | Price | Billing Period | Value Proposition |
| :--- | :--- | :--- | :--- |
| **Pro Monthly** | **$19.99 / month** | Recurring Monthly | Full access, cancel anytime |
| **Pro Annual (Best Value)** | **$149.99 / year** | Billed Annually ($12.49/mo) | **38% Savings** + 7-day free trial |

---

## 3. Entitlement & Feature Gating

Fastlane gates high-value marketing and video processing capabilities behind the `pro_access` RevenueCat entitlement:

| Feature | Free Tier | Fastlane Pro |
| :--- | :--- | :--- |
| **Swipe Feed Access** | Unlimited swipes | Unlimited swipes |
| **Meme Templates** | All 66 templates | All 66 templates + trending updates |
| **Video Resolution** | 720p with Fastlane Watermark | **1080p 60fps Crystal Clear (No Watermark)** |
| **Scheduled Posts** | Max 3 active posts | **Unlimited Scheduled Posts** |
| **Direct Instagram Auto-Post** | Manual export / Calendar sync | **1-Click Direct Instagram Publishing** |
| **Multi-Channel Sync** | Instagram only | **Instagram + TikTok + YouTube Shorts** |
| **AI Green Screen Studio** | 3 preview credits | **Unlimited AI Green Screen Background Compositing** |

---

## 4. Paywall UX & Triggers

### 4.1 Paywall Trigger Moments
1. **4th Post Scheduled**: Attempting to approve and schedule a 4th post displays:
   *"You've hit the 3-post free limit! Upgrade to Pro for unlimited viral scheduling."*
2. **Watermark-Free Export**: Clicking "Export 1080p without Watermark" in the Studio or Post modal.
3. **Direct Instagram Auto-Publish**: Selecting direct API auto-publish.
4. **Header Pro Pill**: Tapping the golden "Upgrade Pro" badge in the navigation bar.

### 4.2 Paywall Modal Components
- **Visual Badge**: Golden crown / lightning badge with subtle particle glow.
- **Headline**: "Supercharge Your Brand's Growth with Fastlane Pro"
- **Benefits Checklist**:
  - ✨ Clean 1080p HD exports without Fastlane watermarks
  - 🚀 Unlimited Instagram, TikTok & Shorts auto-publishing
  - 📅 Full social calendar sync with peak engagement timing
  - 🪄 AI Green Screen video compositing & product placement
- **Toggle**: Monthly ($19.99/mo) vs Annual ($149.99/yr, "Save 38%").
- **CTA Button**: "Start 7-Day Free Trial" / "Upgrade Now".
- **Footer**: "Secured by RevenueCat • Cancel anytime • Restore purchases".
