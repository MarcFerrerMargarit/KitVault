# X — profile setup (supporting channel)
<!-- status: DRAFT, awaiting approval · updated: 2026-09-25 · reads: foundation/platforms/x.md -->

**Audience:** two lanes on one account. **Build in public** (developers, indie makers) sets the
bio. **Kit culture** (collectors in kit-launch threads) is covered by the display name.
**Job of the profile:** a developer sees a real, solo-built AI product. A collector sees a shirt
app. Both reach the link.

> **Decision for you:** `foundation/platforms/x.md` recommends running X mainly from **your
> personal account**, because people follow people on X. This file sets up the **brand account**
> you asked for. The two work together: the brand account posts, and your personal account says
> `Building @kitvaultdev` (bio below). If you only want one account, use the founder bio and skip
> the brand account.

## Copy-paste values

| Field | Value |
|---|---|
| Name (≤50) | `KitVault · Football Shirts` |
| Username (≤15) | `kitvaultdev` (`@KitVault` is taken by "The Kit Vault", a fitness gear site. Fallbacks: `getkitvault`, `kitvaultapp`, `kitvaulthq`) |
| Bio (≤160) | see below |
| Location (≤30) | **leave blank** |
| Website | `https://kitvault.dev/?utm_source=x&utm_medium=social&utm_campaign=profile` |
| Birth date | X requires one. Use the account owner's real date and set its visibility to **only you** |
| Professional category (optional, free) | The closest to software or an app, if X asks. Otherwise skip |
| Profile photo | `branding/profile-images/final/x-profile.png` (400², full-bleed Vault Tile) |
| Header | 1500×500, spec below |

### Bio (≤160 characters, developer-leaning)
```
Football shirt collection app, built in public by one dev. Photo in → Gemini reads team, season, version → you check it. Next.js 16 · Supabase.
```
Why this works for both lanes: "Football shirt collection app" tells a collector what it is.
"Built in public", "Gemini" and the stack tell a developer it's a real build worth following.
Tech names are allowed on X (voice.md allows them in build-in-public copy) but they aren't the
first words.

Collector-leaning alternative (if kit culture turns out to be the bigger lane):
```
Your football shirt collection, finally organised. Photograph a shirt, AI identifies it, you check it. Kit takes and the build, in public.
```

### Founder account bio (your personal @)
```
Building @kitvaultdev — photograph a football shirt, AI identifies it, it's in your collection. Next.js 16 · Supabase · Gemini. Try it for free ↓
```
Website: the same `utm_source=x` link.

### Long description
Not supported on X.

## CTA
**Try it for free.** X throttles links in posts, so **the link goes in the first reply**, never
in the post itself. The profile's Website field is the only link that stays on the profile.

## Keywords (bio + posts, since X search reads them)
football shirts · football shirt collection · kit · shirt identification · build in public ·
indie hacker · Next.js · Supabase · Gemini

Hashtags: 0–1 per post (`#buildinpublic` on build posts only).

## Pinned post (draft, ready to post)
**What it must communicate:** what KitVault is, shown working (not described), who built it and
how, and that it's free to try. Attach the **20s launch video** (`brag/brag.mp4`, 9:16, which
plays fine on X) or a screen recording of one shirt being added.

Post:
```
KitVault: photograph a football shirt and it tells you what it is.

Team, season, version, manufacturer — read by Gemini Vision, with a confidence score. You check it before it's saved. Then filter the whole collection, or see it on a map.

Built solo, in public. Next.js 16, Supabase, Gemini.
```
First reply (post it immediately after):
```
Free to start: 25 shirts, 5 AI identifications a day, no card.
Try it for free → https://kitvault.dev/?utm_source=x&utm_medium=social&utm_campaign=pinned-post
```
Alt text for the video: "Screen recording of KitVault: a football shirt photo is added, and the
app fills in the team, season, version and manufacturer with a confidence score, then shows the
shirt in the collection and a world map of the collection."

Replace it later with the best "Can KitVault ID this?" post, or a "why I built it" thread, once
one of those beats it on replies.

## Profile image
`branding/profile-images/final/x-profile.png`. The green disc reads well on X's dark and light
themes.

## Header (1500×500), to be made
- #0d0d0f background with the site's pitch-stripe texture and stadium glow (from
  `launch/instagram-post-01/source/post-01.html`).
- Right-centre: the real Add Shirt modal in its AI-filled state (the same component used in
  post-01).
- Centre-left, Oswald uppercase: `YOUR FOOTBALL SHIRT COLLECTION,` / `FINALLY ORGANISED.` (the
  second line in #4ade80).
- Keep the **bottom-left ~400×200 px clear**, because the avatar covers it. Keep the text inside
  the middle 1500×360, because X crops the header differently on mobile.
- No club crests, no AI-generated UI.

## Leave blank on purpose
Location · a public birth date · X Premium / verified checkmark (paid, which CLAUDE.md rules out)
· Subscriptions · a Communities link.
