# Product Hunt — product page + launch copy
<!-- status: DRAFT, awaiting approval · updated: 2026-09-25 · nothing submitted or scheduled -->

**Audience:** makers, developers, early adopters. A few collectors, plus people who know one.
**Job:** one day of concentrated, qualified traffic, plus a permanent product page that ranks for
"KitVault". Product Hunt voters respect honesty and a founder who is present in the comments.

## Accounts
- **Maker account:** your personal Product Hunt account (Product Hunt is person-first. There's no
  brand handle to register). Set its avatar to your own photo, and its headline to `Building
  KitVault`.
- **Product page slug:** it comes from the name, so it should be `producthunt.com/products/kitvault`
  (that URL returned 404 on 2026-09-25, a signal it's free, not proof). Fallbacks if Product Hunt
  assigns something else: `kitvaultdev`, `getkitvault`, `kitvault-app`.

## Copy-paste values

| Field | Value |
|---|---|
| Product name | `KitVault` |
| Tagline (≤60) | `Catalogue your football shirt collection from a photo` |
| Website | `https://kitvault.dev/?utm_source=producthunt&utm_medium=social&utm_campaign=profile` |
| Short description (≤260) | see below |
| Topics (up to 3, from Product Hunt's list) | `Sports` · `Artificial Intelligence` · `Web App` (if one isn't offered: `Productivity`) |
| Pricing | **Free options** / freemium (the free plan is live, Pro is announced, and payments aren't open) |
| Thumbnail | `branding/profile-images/final/producthunt-profile.png` (240²) |
| Gallery | 4–5 images at 1270×760, list below |
| Video (optional) | The 20s launch video, if you upload it to YouTube (Product Hunt takes a link, not a file) |
| Makers | You |
| Links → GitHub | `https://github.com/MarcFerrerMargarit/KitVault` |
| X account | `@kitvaultdev` (once registered) |
| Open source | Only tick it once the repo has a licence (see `github.md`) |

### Tagline (≤60 characters)
```
Catalogue your football shirt collection from a photo
```
Alternatives:
- `Photograph a football shirt. AI tells you what it is.`
- `Your football shirt collection, finally organised`

### Short description (≤260 characters)
```
Photograph a football shirt and KitVault identifies the team, season, version and manufacturer, with a confidence score. You check it, it's saved. Then filter your collection by league, season or version, or see it on a world map. Free for 25 shirts.
```

### Full product description (the "About" section of the product page)
```
KitVault is a web app for football shirt collectors.

Most collections live in a wardrobe, a camera roll and a half-finished spreadsheet. KitVault turns them into an archive you can actually search, starting from a photo instead of a form.

How it works
1. Photograph a shirt (or pick a photo you already have).
2. AI identifies the team, season, version (home, away, third or goalkeeper) and manufacturer, and shows how confident it is.
3. You check it and correct anything that's wrong. Nothing is saved without your review.
4. It's in your vault.

What you get
• Filters by country, league, season and version, plus team search
• Collection stats: shirts, countries, leagues
• An interactive world map of every country your collection covers
• English and Spanish
• Works in any browser, including on your phone. No app to install
• Private by default. Delete your account and everything goes with it: photos, shirts, the lot

Plans
• Free: up to 25 shirts, 5 AI identifications a day, no card.
• Pro (€4.99/month, announced): unlimited shirts, 100 identifications a day, bulk upload of up to 20 photos at once. Payments aren't open yet, so Pro has a waiting list and nobody is charged.

What it doesn't do: it doesn't value shirts, and it doesn't authenticate them or spot fakes. It tells you what a shirt is, and helps you keep track of what you own.

Built solo, in public, with Next.js 16, Supabase and Google Gemini.
```

### Maker comment (first comment, posted the moment the launch goes live)
```
Hi Product Hunt, I'm Marc, and I built KitVault on my own.

Football shirt collections have a cataloguing problem. Every tool I found started with a form: type the team, pick the season, choose the version, find the manufacturer, and repeat for every shirt. Most collections never get catalogued, because that's an evening of typing per shelf.

KitVault starts from the photo instead. You photograph a shirt, Gemini reads the team, season, version and manufacturer, and it tells you how confident it is. You check it, fix anything it got wrong, and save it. After that, your collection is searchable: by league, season or version, or on a world map of everywhere your shirts come from.

A few honest notes:
• The AI gets things wrong sometimes, especially with obscure or very similar seasons. That's why it shows a confidence score and never saves without your review. Every correction is kept, and that's the data I'll use to improve it.
• The free plan is 25 shirts and 5 identifications a day. Each identification costs real money, and I'd rather be upfront about the limit than quietly throttle it.
• Pro is announced, but payments aren't open yet. There's a waiting list, and nobody gets charged.
• It's a web app, and it works fine in your phone's browser. In English and Spanish.

What I'd love from you today: photograph the most obscure shirt you own and tell me whether it got it right. The misses are the most useful thing you can send me.

Try it for free: kitvault.dev
```
⚠️ **Confirm before using:** the second paragraph ("every tool I found started with a form") is
the positioning from `foundation/positioning.md`, written as your own experience. Keep it only if
it matches what actually happened. Never name the other apps.

### Launch CTA
- **On the page / in the maker comment:** `Try it for free — no card. Then tell me which shirt it
  got wrong.`
- **Social posts on launch day** (X, LinkedIn, Instagram Story): `KitVault is on Product Hunt
  today. Photograph a football shirt, AI tells you what it is.` + the Product Hunt link.
  **Don't ask for upvotes** (Product Hunt penalises it, and it goes against the voice). "Have a
  look" / "tell me what it got wrong" instead.

## Gallery (1270×760), to be made from the real app only
1. **Hero:** `CATALOGUE YOUR FOOTBALL SHIRT COLLECTION FROM A PHOTO` + the AI-filled Add Shirt
   modal (the same source as `launch/instagram-post-01`).
2. **How it works:** photo → fields filling in → confidence % → saved (3 panels).
3. **The collection:** the grid of shirt cards with the filter bar in use.
4. **The map:** the collection map with countries lit up and a hover count.
5. **Plans:** the real pricing section (Free live, Pro greyed out with "Notify me").
Use real shirts where you can. If a screen uses demo data, keep it plausible and don't show
invented collection totals as if they were real.

## Before you schedule a launch (readiness)
- [ ] **AI capacity:** the app-wide daily AI ceiling (`ai_limits`, README → AI quota) is a fuse.
      A launch-day spike can trip it, and then every visitor sees "KitVault has reached today's
      shared AI limit". Review the numbers the day before and keep an eye on `ai_usage` during
      the launch.
- [ ] **Landing page vs reality:** the hero and features still promise "Share your collection"
      (not built), and the footer says "A prototype for football shirt collectors". Product
      Hunt's audience will ask about both. Consider softening the sharing copy before launch
      (already flagged in `foundation/social-strategy.md`).
- [ ] **Licence** decided (see `github.md`), so "open source" is either true or not claimed.
- [ ] Gallery images made from the real UI (1270×760).
- [ ] Launch at 00:01 Pacific time (Product Hunt's day starts then). Be in the comments all day.
- [ ] Product Hunt link with UTMs for your own posts:
      `https://kitvault.dev/?utm_source=producthunt&utm_medium=social&utm_campaign=launch`.

## Leave blank on purpose
Promo code / offer (there's nothing to discount, since payments aren't open) · "Hunter" (launch it
yourself) · paid Product Hunt promotions · any claimed number (users, accuracy).
