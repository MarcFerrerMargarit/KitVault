# Social Strategy — KitVault
<!-- version: 1.0 · updated: 2026-09-23 · derived from: brand-profile, audience, content-pillars v1.0 -->

## Objective
- **Primary:** Drive collectors to https://kitvault.dev/ to try it. The target action is a
  signup that adds at least 1 shirt.
- **Secondary:** Build a recognisable collector-facing account on Instagram (reach among
  collectors, not follower count).
- **Meaningful metrics:** Link clicks with UTMs → signups → first shirt added. Signups and
  shirts are already in Supabase. For UTM attribution, the site needs analytics that read UTM
  parameters. The live site appears to load Vercel Analytics, but it isn't in the repo code, so
  confirm it before the first campaign. Platform signals come from native analytics only:
  sends, saves, completion rate, profile visits. Follower count is not a goal.
- **UTM convention:** `https://kitvault.dev/?utm_source={instagram|tiktok|x|linkedin}&utm_medium=social&utm_campaign={campaign-slug}`
- **Targets:** Not set yet. Set them after 4 weeks of baseline with `goals-and-kpis`. Never invent
  numbers.

## Channel choices

| Channel | Role | Why | Cadence (sustainable for one person) |
|---|---|---|---|
| **Instagram** | ⭐ Primary | Where shirt collectors already post their collections. Reels reach non-followers, and carousels get saved | 3 posts/week (2 Reels + 1 carousel) + Stories 3–4 days/week |
| **TikTok** | Secondary (repurpose + native tweaks) | Hauls, unboxings and "can the AI ID this?" fit the format. Search-driven discovery | 3 videos/week, mostly native versions of the IG Reels |
| **X** | Supporting | Kit launch/leak culture lives here, and it's the home of build-in-public | 3–5 posts/week + daily replies in kit conversations |
| **LinkedIn** | Maintenance | The founder's build story: credibility, developer and indie audience. Few collectors | 1 post/week, founder profile (not a company page) |

**Deliberately not doing (for now):** Facebook, Pinterest, YouTube long-form, Threads. Reddit
r/footballshirts is for listening and genuine participation only: no promo posts, and only
answer when someone asks "how do you catalogue your collection?".

## The wedge
Everyone else posts shirts. **KitVault posts shirts with the answer.** Every piece shows the
product doing the collector's hardest job (knowing exactly what a shirt is) using real screen
recordings. The recurring **"Can KitVault ID this?"** format is the signature. It's a game for
the audience, a demo for the product, and honest because the misses get shown too.

## Operating model
- **Engine:** foundation files → monthly pillar plan (`batch-content-plan`) → record real app
  footage in batches (one session → 6–8 clips) → Instagram-first edit → native TikTok/X cuts
  (`cross-platform-repurposing`) → the founder approves everything → the founder publishes
  manually.
- **Assets:** All real. The founder's shirts, screen recordings of kitvault.dev, the brand
  colours and Oswald/Inter. OpenArt only for abstract backgrounds/textures (see the AI policy in
  `brand-profile.md`). Demo and launch videos: `/brag` + Hyperframes.
- **Storage:** `marketing/social/{campaign}/{platform}/`.
- **Engagement:** 15 min/day. Reply to every comment in the first hour, and leave 5 genuine
  comments on collector accounts (IG) or kit threads (X).

## Phasing
1. **Weeks 1–4 (foundation):** Set up handles and bios. Instagram + TikTok with the "Can KitVault
   ID this?" series + map/collection posts. X light. Measure the baseline.
2. **Weeks 5–12 (double down):** Keep whatever format drives clicks-to-signup. Add X kit-culture
   replies daily. Start LinkedIn build posts.
3. **When sharing ships:** Re-run this strategy. Public vault links become the growth loop
   (collectors posting their own vaults), and that changes every channel.
4. **When payments open:** One launch campaign (`campaign-and-launch-planning`). Until then, Pro
   is only ever "join the waiting list".

## Before the first campaign (founder to-do)
- [ ] Reserve handles (IG, TikTok, X). Decide on a founder LinkedIn vs a company page (founder
      recommended).
- [ ] Decide whether the founder appears on camera/voice. Faceless screen + hands + shirts works
      fine.
- [ ] Photograph 20–30 of your own shirts for the asset library.
- [ ] Confirm the sharing roadmap. Consider softening "Share your collection" on the landing
      page until it ships, so the site and social say the same thing.
