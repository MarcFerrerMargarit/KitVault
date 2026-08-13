# KitVault

A web app to **collect and organize football shirts**. Photograph a shirt, let
AI identify it, and build a clean, private archive of every jersey you own.

> **Status — Phases 1-3 done.** The app has real auth, a Postgres database,
> private photo storage and Gemini Vision identification. It needs a Supabase
> project and a Gemini API key to run (see [Setup](#setup)).

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Supabase** — auth (email + password), Postgres with RLS, private Storage
- **Google Gemini** (`gemini-2.5-flash`) for shirt identification
- **Tailwind CSS v4** (dark-only design system)
- **TypeScript** (strict, no `any`)
- **d3-geo** + **world-atlas** for the collection map (server-side projection)
- **Lucide React** icons, shadcn/ui-style primitives built locally in `components/ui`

## Setup

### 1. Prerequisites

Node.js 20+ and npm. Then:

```bash
npm install
```

### 2. Supabase project

Create a project at [supabase.com](https://supabase.com), then:

1. **SQL Editor → New query** → paste and run [`supabase/schema.sql`](supabase/schema.sql).
   That creates the `profiles`, `shirts` and `ai_corrections` tables, the RLS
   policies, the private `shirts` storage bucket and its per-user policies, plus
   the trigger that creates a profile row on signup.
2. Run the migrations in `supabase/migrations/`, in order. Both are idempotent:
   - `001_free_form_manufacturer.sql` — a no-op on a database created from the
     current `schema.sql`; needed only for projects made from an older one.
   - `002_ai_usage_quota.sql` — **required**. Creates the AI quota tables and
     functions; `/api/identify` returns 500 until it has been run.
3. **Authentication → URL Configuration** → set the Site URL to
   `http://localhost:3000` and add `http://localhost:3000/auth/callback` to the
   redirect allow-list, so email confirmation links come back to the app.
4. **Project Settings → API Keys** → copy the project URL and the anon
   (publishable) key for the next step.

### 3. Gemini API key

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
It is used server-side only, by `POST /api/identify`.

### 4. Environment variables

Copy [`.env.example`](.env.example) to `.env.local` and fill in the three values:

```bash
cp .env.example .env.local
```

| Variable                        | Where it comes from                | Exposed to browser |
| ------------------------------- | ---------------------------------- | ------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Project Settings → API  | yes                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API  | yes (safe)         |
| `GEMINI_API_KEY`                | Google AI Studio                   | **no — server only** |

`.env.local` is gitignored. Restart `npm run dev` after changing it.

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000, sign up, confirm the email, and you land on
`/collection`.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Routes

| Route                 | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| `/`                   | Landing page — hero, kit marquee, CTAs                          |
| `/login`, `/signup`   | Email + password auth (redirects to `/collection` when signed in) |
| `/auth/callback`      | Exchanges the Supabase confirmation code for a session          |
| `/collection`         | The collection — server-rendered from Postgres; auth-protected  |
| `POST /api/identify`  | Gemini Vision identification (auth required, 10 MB image limit) |
| `GET /api/world-map`  | Projected country outlines for the map view (static, cached)    |

`middleware.ts` refreshes the Supabase session on every request, gates
`/collection`, and bounces signed-in users away from the auth screens.

## How a shirt gets added

1. Drag or pick a photo in the Add Shirt modal.
2. The file is posted to `/api/identify`, which claims an [AI credit](#ai-quota)
   and sends the photo to `gemini-2.5-flash` with a JSON response schema,
   returning team, season, version, manufacturer, country, league and a 0-100
   confidence. If the call fails or the quota is spent, the form opens blank so
   the shirt can still be added by hand.
3. The user reviews or corrects the fields.
4. On save, the photo is uploaded to the private `shirts` bucket under
   `<user-id>/<uuid>.<ext>`, and a Server Action inserts the row. The original
   prediction and the corrected values are stored in `ai_corrections` — training
   data for Phase 5.
5. `/collection` mints 1-hour signed URLs for the photos, since the bucket is
   private.

## The map view

`/collection` toggles between the grid and a world map where each country is
shaded by how many shirts you have from it. Hovering reads out the country and
its count; clicking one filters the collection down to it and drops back to the
grid, as a removable chip.

The fill runs along a deep pine → grass → mint ramp, and the scale is stretched
between your least- and most-collected country rather than from zero, so the
full range is always in use: a collection of 1s and 2s would otherwise be two
shades of the same dark green. A square root keeps one dominant country from
flattening the rest onto the floor. When every country ties — a brand-new
collection of single shirts — everything sits at the accent colour and the
legend hides itself, since a "1 → 1" scale says nothing. The bars in the
ranking below the map use the same ramp, so the list reads as a key to the map.

Two things make this less trivial than it looks:

- **`shirts.country` is free text.** `lib/country-match.ts` normalises it
  (accents, punctuation, case) and carries an alias table onto Natural Earth's
  names — `USA`, `Czech Republic`, `Ivory Coast`, `Türkiye` and friends all land
  where you would expect.
- **Football nations are not ISO countries.** England, Scotland, Wales and
  Northern Ireland have their own associations but share one shape, so they are
  tallied together on the United Kingdom outline and the hover readout names the
  breakdown. Clicking it filters by all four at once, which is why
  `ShirtFilters.countryIn` holds a list rather than a single value. Microstates
  with national teams but no shape at this resolution (Andorra, Gibraltar…) are
  listed under the map instead of being silently dropped.

The geometry is projected on the server (Equal Earth, so a country's ink matches
its real area) and served from `/api/world-map` — about 110 KB, cached for a
year in production and never in development. It is deliberately *not* part of
the `/collection` payload: the map pays for it once, on first open.

## AI quota

Every account shares one `GEMINI_API_KEY`, and **Gemini rate limits are applied
per project, not per key** — so a second key would not buy more capacity. Two
independent limits guard the budget, both enforced in Postgres:

| Limit                   | Default | Where it lives                        |
| ----------------------- | ------- | ------------------------------------- |
| Per-user identifications/day | 5 (free) / 100 (pro) | `plan_limits.daily_identifications` |
| App-wide identifications/day | 150     | `ai_limits.global_daily_limit`        |
| App-wide requests/minute     | 6       | `ai_limits.global_burst_per_minute`   |
| Counter reset timezone       | Europe/Madrid | `ai_limits.reset_timezone`      |

Change any of them with an `UPDATE` — no redeploy needed. There is no payment
integration yet; upgrade someone by hand:

```sql
update public.profiles set plan = 'pro' where email = 'someone@example.com';
```

### How it works

- `ai_usage` logs one row per identification and is both the counter and the
  **cost ledger** (model, input/output/total tokens, status).
- `consume_ai_credit()` checks all three limits and inserts the reservation row
  inside one transaction, guarded by an advisory lock. Doing the check in
  TypeScript would let two simultaneous uploads both spend the last credit.
- `POST /api/identify` claims a credit *after* validating the image but *before*
  calling Gemini, then settles the row with the real token counts. If Gemini
  fails the credit is released — a failed call bills nothing, so it should not
  cost the user a slot. A stale `pending` row stops counting after 5 minutes.
- Refusals return **429** with a reason (`user_quota`, `global_quota`, `burst`)
  and a human message. The app never hard-blocks: the Add Shirt modal drops
  straight to the manual form, and saving shirts is never rationed.
- The route is **fail-closed** — if the quota functions are missing it returns
  500 rather than spending money, so run the migration before deploying.

### Where the user sees it

`ai_quota_status()` is read on the server for `/collection` and shared through
`QuotaProvider`, so two places stay in sync without a reload:

- a counter in the collection header (`AiQuotaBadge`) — green, amber at 1 left,
  red at 0, with the reset time in its tooltip;
- a line in the Add Shirt modal's upload step, which turns into an explanation
  when the allowance is gone.

`/api/identify` returns the authoritative `quota` object on both success and
refusal, and the modal pushes it into the provider.

### Cost per identification

A shirt photo costs roughly 1,000-1,800 input tokens (images are billed as
768×768 tiles at 258 tokens each) and ~80 output tokens — about **$0.0007**, or
~1,400 identifications per dollar. Thinking is explicitly disabled
(`thinkingBudget: 0`): thinking tokens bill as output at $2.50/1M and buy
nothing when the answer is constrained by a response schema.

Check what you are actually spending:

```sql
select u.user_id, count(*) filter (where u.status = 'success') as calls,
       sum(u.total_tokens) as tokens
  from public.ai_usage u
 where u.created_at >= public.ai_day_start()
 group by u.user_id order by calls desc;
```

Your project's real Gemini rate limits are at
[aistudio.google.com/rate-limit](https://aistudio.google.com/rate-limit) —
Google no longer publishes a stable table, so set `global_daily_limit` from
what the dashboard reports.

## Project structure

```
app/
  page.tsx                 # Landing page
  login/, signup/          # Auth screens
  auth/callback/route.ts   # Supabase code → session exchange
  collection/page.tsx      # Collection dashboard (server component)
  collection/actions.ts    # Server Actions: create / update / delete shirt
  api/identify/route.ts    # Gemini Vision identification endpoint
  layout.tsx               # Fonts (Oswald display / Inter body) + metadata
  globals.css              # Tailwind v4 theme tokens & design system
components/
  Brand.tsx                # KitVault wordmark
  CollectionHeader.tsx     # Collection top bar + account menu
  ShirtCard.tsx            # Card with team-color side band
  ShirtGrid.tsx            # Stateful controller: filtering + modals
  FilterBar.tsx            # Search + country/league/season/version filters
  StatsBar.tsx             # Headline stats
  AddShirtModal.tsx        # Upload → Gemini analysis → editable form → upload
  ShirtDetailModal.tsx     # Large detail view + AI identification
  AiQuotaBadge.tsx         # "3/5 AI left today" counter in the header
  QuotaProvider.tsx        # Shares the quota between header and modal
  CollectionMap.tsx        # Choropleth world map + country ranking
  auth/AuthForm.tsx        # Shared login / signup form
  landing/                 # HeroBackdrop, KitMarquee
  ui/                      # Button, Card, Dialog, Select, Input, Badge, …
lib/
  supabase/                # Browser, server and middleware clients
  db.ts                    # `shirts` row shape + row → domain mapper
  quota.ts                 # Quota types, RPC reader, refusal messages
  world-map.ts             # Projects the country outlines (server only)
  country-match.ts         # Free-text country → map country
  types.ts                 # Domain types
  mock-data.ts             # Suggestion lists + sample kits for the landing page
  shirt-helpers.ts         # Version badge colors, placeholder gradients
  utils.ts                 # cn() class merge helper
supabase/
  schema.sql               # Full database + storage setup
  migrations/              # Incremental SQL applied on top of an older schema
```

## Data model

Only `version` is a closed set (`Home | Away | Third | GK`). Country, league and
manufacturer are free-form text so Gemini — or the user — can enter any
real-world value, including lower divisions, national teams and rare brands.
The lists in `lib/mock-data.ts` are input suggestions, not constraints.

Every table is protected by RLS: a user can only read and write their own rows,
and storage policies restrict each user to their own `<user-id>/` folder. Photos
live in a private bucket and are served through 1-hour signed URLs.

RLS is what actually enforces the separation — it holds even against someone
using the public anon key directly. The queries in `app/collection/` *also*
filter by `user_id` even though the policies make it redundant, so that a
dropped or disabled policy cannot quietly turn into a data leak.

## Design system

Dark, premium and sporty — inspired by Letterboxd / Discogs but for kits.

- Background `#0D0D0F`, cards `#1A1A1F`, grass-green accent `#4ADE80`
- Condensed bold display type (Oswald), clean body (Inter)
- Minimal border radius for an angular, serious feel
- Signature: each shirt card carries a **vertical team-color band** on its left
  edge, like the trim of the shirt itself

Tokens live in `app/globals.css` under `@theme` (e.g. `bg-bg`, `text-accent`,
`border-border-strong`).

## Roadmap

- ✅ **Phase 1** — UI prototype
- ✅ **Phase 2** — Supabase auth + Postgres + storage
- ✅ **Phase 3** — Gemini Vision identification (`POST /api/identify`)
- ✅ **Phase 3.5** — Per-user AI quota + global daily cap (see
  [AI quota](#ai-quota)). Payment integration is still missing: `profiles.plan`
  is set by hand.
- ✅ **Phase 3.6** — Interactive world map of the collection (see
  [The map view](#the-map-view))
- 🔜 **Phase 4** — Automatic reference-image enrichment
- 🔜 **Phase 5** — Model improvement from correction feedback (`ai_corrections`
  is already collecting the data)
- 🔜 **Phase 6** — Social profiles, collection stats, PWA
