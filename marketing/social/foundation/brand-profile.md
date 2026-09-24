# Brand Profile — KitVault
<!-- version: 1.0 · last updated: 2026-09-23 · review: quarterly, or when sharing ships / payments open / a mobile app ships
     · type: b2c-app (consumer web app, freemium) -->

Read this before writing any KitVault social content. The companion files are in the same
folder: `voice.md`, `audience.md`, `positioning.md`, `content-pillars.md`, `social-strategy.md`
and `platforms/`.

## Identity
- **What it is (one sentence):** KitVault is a web app for football shirt collectors: photograph
  a shirt, AI reads the team, season, version and manufacturer, and it's filed in a private,
  searchable archive.
- **Category:** Football shirt collection tracker/cataloguing app.
- **Stage:** Early. The free plan is live. Pro (€4.99/month) is announced but payments aren't
  open yet, so people can only join the waiting list.
- **Made by:** Built by one person (Marc). The code is public on GitHub
  (github.com/MarcFerrerMargarit/KitVault).
- **Languages:** English and Spanish (the app is fully translated).

## Positioning (full version: `positioning.md`)
- **What's different:** Take a photo and the shirt is identified for you. The other collector
  apps start with a form or a database search. KitVault starts with the photo in your hand.
  Bulk add turns 20 photos into 20 catalogued shirts in one go.
- **Why believe it:** Gemini Vision identifies team, season, version (Home/Away/Third/GK) and
  manufacturer, and shows a confidence %. You review every AI suggestion before it's saved, and
  your corrections are stored.
- **Point of view:**
  1. A collection you can't search is just a pile. Collectors deserve the same care for their
     shirts as the shirts got from the kit designers.
  2. Cataloguing should take seconds per shirt, not an evening with a spreadsheet.
  3. Your collection is yours. Private by default, deletable completely, nothing sold.
- **Won't say:** that it values shirts, authenticates shirts or spots fakes. It does none of
  these. It also won't say sharing is live (see Guardrails).

## Audience (full version: `audience.md`)
### Segment 1 — The serious collector ⭐ primary
- **Who:** Owns roughly 20–300+ shirts, buys on Vinted, eBay, Depop and in retro shops, and
  knows what "2004-05 away, player version" means.
- **Cares about:** Knowing exactly what they own, spotting gaps and not buying duplicates.
  They also want to show the collection off.
- **Where:** Instagram (collection posts, #footballshirts), TikTok (hauls, unboxings, "rate my
  collection"), X (kit launches, leaks), Reddit r/footballshirts, and Vinted/eBay.
- **Sophistication:** Expert on kits. Not technical. Allergic to anyone who gets a kit detail
  wrong.
### Segment 2 — The growing collector
- **Who:** Has 5–30 shirts: holiday buys, their club's kits, a few retro pieces. Collecting is
  becoming a hobby rather than an accident.
- **Cares about:** Getting organised before it gets out of hand, and seeing the collection "as
  a collection".
### Secondary (build-in-public only) — developers and indie makers
- **Who:** Follows solo builders on X and LinkedIn. Reaches KitVault through the build story
  (Next.js 16, Supabase, Gemini, open source).
- **Buyer vs follower note:** Developers amplify and give credibility. Collectors are the ones
  who try it. Every developer-facing post still points at the product, and never at the code as
  the product.
- **Transformation:** A wardrobe or storage box of shirts you half-remember → a searchable
  archive, with a map of every country your collection covers.

## Voice (full version: `voice.md`)
- **Dimensions:** Formality 2/5 · Warmth 3/5 · Authority 4/5 · Energy 3/5 · Humor 2/5 · Polish 4/5
- **We sound ___, never ___:**
  - knowledgeable about kits, never trivia-show-off
  - precise, never salesy
  - a collector talking to collectors, never a startup talking to "users"
  - calm and confident, never hype
- **Words we use:** shirt, kit, collection, archive, vault, catalogue, season (written "2004-05"),
  home/away/third/GK, player version, "add a shirt", "your vault"
- **Words we ban:** jersey (except in US-targeted copy), "users", "game-changer",
  "revolutionise", "unlock", "seamless", "next-level", "elevate", "🚀", "AI-powered" as a lead
  adjective, "the ultimate", "#1"
- **Signature devices:** Real shirts named precisely ("Liverpool 2018-19 home"). Short
  declarative lines. Sentence case. British spelling (catalogue, organised) in English copy. At
  most one emoji per post: ⚽ or 🟢, or none.
- **Pronunciation guide:** KitVault = "KIT-vawlt" (two words run together, stress on KIT).

## Proof
- **Numbers:** None yet. Don't invent user counts, shirts catalogued or accuracy rates.
  → ASK the founder before using any number.
- **Real product facts that can be used:** Free plan up to 25 shirts and 5 AI identifications a
  day. Pro: unlimited shirts, 100 a day, bulk upload of up to 20 photos. AI shows a confidence %.
  Manual entry always works. Collection map by country. Filters by country, league, season and
  version. EN and ES. Open source.
- **Named customers / testimonials:** None yet. Collect them with written permission and record
  whether each one is cleared for organic reposting or for paid ads (those are different
  permissions).

## Offers & CTAs
- **Primary CTA:** "Try it for free" → https://kitvault.dev/
- **Supporting line:** "Add your first shirt in under a minute." This comes from the product's
  own copy. Only use it where the claim holds (single add, with the AI working).
- **Secondary CTAs:** "Save this for your next charity-shop hunt", "What's the first shirt you'd
  scan?", follow, reply with your collection count.
- **Pro:** "Join the Pro waiting list", only when relevant. Never "buy Pro" while
  `PAYMENTS_ENABLED` is false.
- **Hard-sell rules:** No hard sell on Reddit or in other people's comment sections. At most 1
  in 5 posts carries the CTA as the main message. The rest earn the profile visit.

## Channels (details: `social-strategy.md`, `platforms/`)
- **Primary:** Instagram. **Secondary:** TikTok. **Supporting:** X (kit culture + build in
  public). **Maintenance:** LinkedIn (founder build story).
- **Handles:** TBD. → ASK. Keep them consistent: @kitvault or @kitvault.app.
- **Link in bio:** https://kitvault.dev/ with UTM per platform (see `social-strategy.md`).
- **Languages / markets:** English first. Spanish versions for Spain/LatAm where a post is about
  LaLiga or Spanish-speaking clubs. Spanish copy is written natively, not translated word for
  word.

## Operational defaults
- **AI & synthetic media policy:**
  - Real product screen recordings and real shirts beat everything. Never mock up a fake UI with
    AI. Record the actual app.
  - AI-generated imagery (OpenArt) is for backgrounds, textures and abstract brand visuals only.
    Never generate a fake shirt presented as real, and never generate a real club's crest or kit
    design.
  - No AI avatars and no voice clones. A voiceover is the founder's own voice or on-screen text.
  - Label AI-generated visuals where platforms require it (Meta and TikTok AI labels; EU AI Act
    disclosure applies from Aug 2026).
- **Accessibility:** Alt text on every image, naming the shirts shown. Burned-in captions on
  every video (most views are sound-off). The dark UI needs enough contrast in text overlays:
  white or #4ade80 on #0d0d0f.
- **Visual identity:** Taken from the product (`app/globals.css`).
  - Colours: background #0d0d0f, surface #1a1a1f, ink #f5f5f7, accent grass green #4ade80.
  - Version colours: Home #4ade80, Away #60a5fa, Third #c084fc, GK #fbbf24.
  - Type: Oswald (bold, uppercase, condensed) for headlines, Inter for body text.
  - Shape: angular 4px corners, "pitch stripes" texture, dark only.
  - If a `design-and-templates` brand kit is created later, it becomes the source of truth.

## Guardrails
- **Sharing is not built yet.** The landing page says "Share your collection", but there are no
  public collection pages or share links in the product today. Don't promise sharing on social
  until it ships. Talk about showing your collection via screenshots of your vault and map.
- **Club IP:** Photographing real shirts the founder or collectors own is fine. Never use club
  crests or logos as KitVault branding, imply a club partnership, or generate a club kit with
  AI.
- **No valuation or authenticity claims.** "Know what you own", not "know what it's worth" or
  "spot fakes".
- **AI honesty:** AI identification can be wrong. Show the confidence % and the review step. Don't
  say "instant" or "perfect". "Identified in seconds, reviewed by you" is fine.
- **Limits exist:** 5 AI identifications a day on Free. Never imply unlimited AI on Free.
- **Competitors** (MyFootballShirts, Shirt Squad, spreadsheets): never name or knock them.
  Contrast with "a spreadsheet" or "a notes app" as the generic alternative.
- **Sensitivity:** Club rivalries are fun, but no tribal abuse, no player personal lives, no
  tragedies or memorial shirts used for engagement.
- **Never publish automatically.** Everything is prepared for the founder's approval (see
  CLAUDE.md).

## Show, don't tell — example posts
There are no KitVault posts yet, so these are aspirational patterns. Replace them with real
posts once they exist.
- **Loves:**
  - A screen recording of photo → "Liverpool · 2018-19 · Home · New Balance · 94%" appearing.
    Why: the product is the hook, and every detail is precise.
  - A carousel titled "Every shirt in my vault from a country I've never been to", built from
    the map view. Why: it's personal and specific, it uses a real feature, and people save it.
  - An X post: "Weekend project: 212 shirts, one bulk upload at a time. The 1998 Nigeria away
    fooled the AI. Here's why." Why: honest, specific, and it invites replies.
- **Hates:**
  - "🚀 Unlock the ULTIMATE football shirt experience with AI-powered collection management!"
    Why: hype, a banned word, and it says nothing.
  - A generic AI-rendered "app UI" on a phone. Why: fake product, and collectors notice.

## Notes
- Big moments for the calendar: kit launch season (roughly May–August), transfer windows,
  derbies, international tournaments, and end-of-season retro nostalgia.
- The product is web-only (no native app). Say "works in your phone's browser", never "download
  the app".
