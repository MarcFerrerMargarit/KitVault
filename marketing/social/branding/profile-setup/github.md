# GitHub — profile setup
<!-- status: DRAFT, awaiting approval · updated: 2026-09-25 · checked with the gh CLI on 2026-09-25 -->

**Audience:** developers, including developers who collect shirts, plus anyone checking whether
KitVault is real before signing up. **Job of the profile:** technical credibility (a real,
readable, shipped codebase) that points back at the product. KitVault is **not** a developer tool,
so every description leads with what it does for collectors.

## Current state (checked with `gh repo view`)
| Item | Now | Problem |
|---|---|---|
| Repo | `github.com/MarcFerrerMargarit/KitVault`, public, 0 stars | — |
| Description | *(empty)* | The repo doesn't say what it is in search results or on link previews |
| Website | `https://kit-vault-eight.vercel.app` | ⚠️ The old Vercel URL, not kitvault.dev |
| Topics | *(none)* | Invisible in GitHub topic search |
| Licence | **none** | ⚠️ See below |

### ⚠️ Licence: fix this before saying "open source"
The repo has **no LICENSE file**. Legally, public code without a licence is "all rights reserved":
people can read it but not reuse it. Developers check this, so calling it "open source" would be
the kind of claim that costs credibility. `foundation/positioning.md` lists "open source" as a
✅ claim, which **isn't true until a licence is added.**
- Until then, all copy here says **"the code is public"** / **"built in public"**.
- If you add a licence (your call: MIT is permissive, AGPL-3.0 keeps hosted forks open), change
  those lines to "open source (MIT)" or similar, and update the claims register.

## Step 1 — the repo's About box (do this whatever else you decide)
Repo → ⚙️ next to "About":

| Field | Value |
|---|---|
| Description (≤350) | see below |
| Website | `https://kitvault.dev/?utm_source=github&utm_medium=social&utm_campaign=profile` |
| Topics | see below |
| Include in the home page | ✅ Releases off (none yet), Packages off, Deployments off |

Description:
```
Football shirt collection app. Photograph a shirt; Gemini Vision identifies team, season, version and manufacturer with a confidence score, and you review it before it's saved. Next.js 16 · React 19 · Supabase · d3-geo · EN/ES. Live at kitvault.dev
```

Topics (lowercase; paste them one at a time):
```
football  football-shirts  collection-manager  nextjs  react  typescript  supabase  gemini  computer-vision  tailwindcss  d3-geo  i18n
```

Social preview image (repo → Settings → Social preview, 1280×640): spec below. This is the image
X, LinkedIn, Slack and Discord show when someone pastes the repo link.

## Step 2 — the organisation `kitvaultdev` (recommended: reserve it now)
`kitvaultdev` is **verified free** (GitHub API, 2026-09-25). `github.com/kitvault` belongs to
someone else. Creating the organisation (free plan) reserves the name, gives KitVault a GitHub
home that matches the other platforms, and lets you verify the domain.

**Moving the repo is a separate decision:**
| Option | Pros | Cons |
|---|---|---|
| **A. Keep the repo on your personal account** (recommended for now) | The build-in-public story is yours: commits, contribution graph and profile all say "one person built this" | The org stays nearly empty, with just its profile README pointing to the repo |
| B. Transfer the repo to `kitvaultdev` | Brand-consistent URL, `github.com/kitvaultdev/KitVault` | Update `GITHUB_URL` in `app/page.tsx`, the brand profile and the git remote. GitHub redirects the old URL, but only until someone creates a repo with the same name there |

Organisation profile fields (Settings → Profile):

| Field | Value |
|---|---|
| Organisation display name | `KitVault` |
| Username | `kitvaultdev` (fallbacks, all verified free: `getkitvault`, `kitvaultapp`, `kitvaulthq`) |
| Description (≤160) | `A web app for football shirt collectors. Photograph a shirt, AI identifies it, you check it. Built in public with Next.js, Supabase and Gemini.` |
| URL | `https://kitvault.dev/?utm_source=github&utm_medium=social&utm_campaign=profile` |
| Social accounts | Add X, Instagram, LinkedIn and TikTok (`kitvaultdev`) once they exist. GitHub shows up to 4 |
| Location | **leave blank** |
| Public email | **leave blank** (no public address in the project; see `links.md`) |
| Verified domains | **Add `kitvault.dev`** (a DNS TXT record at Cloudflare). It's free, gives a "Verified" badge, and proves the organisation is the real one |
| Avatar | `branding/profile-images/final/github-profile.png` (500²), or the KV monogram (`kitvault-profile-monogram-dark-1024.png`) if you want the quieter secondary mark (see `profile-images/recommendation.md`) |
| Sponsors | leave off |

### Organisation profile README
Create a public repo `kitvaultdev/.github` with `profile/README.md`:
```markdown
## KitVault

A web app for football shirt collectors. Photograph a shirt, and KitVault identifies the team,
season, version and manufacturer, with a confidence score. You check it, and it's in your
collection: filterable by country, league, season or version, and on a world map.

**Try it for free → [kitvault.dev](https://kitvault.dev/?utm_source=github&utm_medium=social&utm_campaign=profile)**
Free plan: 25 shirts, 5 AI identifications a day, no card.

### Built in public, by one developer
- Next.js 16 (App Router) + React 19, TypeScript (strict)
- Supabase: auth, Postgres with row-level security, private photo storage
- Google Gemini for image identification, with per-user and app-wide quotas
- d3-geo + world-atlas for the server-rendered collection map
- English and Spanish via a typed dictionary, no i18n library

Code: [MarcFerrerMargarit/KitVault](https://github.com/MarcFerrerMargarit/KitVault)
```
(Change the code link if you transfer the repo.)

## Step 3 — your personal profile
- Pin `KitVault` on your personal profile (Customize your pins).
- Bio suggestion: `Building KitVault — a football shirt collection app. Next.js · Supabase ·
  Gemini.` and set Website to the GitHub UTM link.

## CTA
**Try it for free** (README + org profile). The repo's README header already describes the app.
Consider adding a one-line `**Live:** [kitvault.dev](…github UTM…) — try it for free` under the
title.

## Keywords
football shirts · collection manager · Next.js 16 · React 19 · Supabase · row-level security ·
Gemini · computer vision · image identification · d3-geo · i18n without a library

## Pinned "post"
GitHub has no posts. The equivalents are the **pinned repo** (KitVault, on your profile and on
the organisation) and the **org profile README** above. They must communicate: a real, running
product (link to kitvault.dev), what it does in collector terms, the stack, and one-person build
in public.

## Social preview / banner (1280×640), to be made
GitHub has no profile banner. The repo's social preview image does that job:
- #0d0d0f with pitch stripes. Left: the Vault Tile + `KitVault` wordmark, then `Football shirt
  collection app`. Right: the real Add Shirt modal, AI-filled.
- Bottom strip in small Inter: `Next.js 16 · Supabase · Gemini · kitvault.dev`.
- Keep a 40 px safe margin. Many sites crop to 2:1 or 1.91:1.

## Leave blank on purpose
Location · public email · Sponsors · Discussions (until there's an audience asking) · Releases ·
the "open source" wording (until there's a licence).
