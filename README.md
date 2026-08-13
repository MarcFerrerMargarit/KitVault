# KitVault

A web app to **collect and organize football shirts**. Photograph a shirt, let
AI identify it, and build a clean, private archive of every jersey you own.

> **Status — feature-complete for a first release.** Real auth, a Postgres
> database, private photo storage, Gemini Vision identification, per-plan
> limits and account deletion. Not yet wired up: taking payments — see
> [Before charging anyone](#before-charging-anyone). Needs a Supabase project
> and a Gemini API key to run (see [Setup](#setup)).

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
   - `003_collection_limit_and_account_deletion.sql` — **required**. The
     per-plan collection limit and the account-deletion function.
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

| Variable                        | Where it comes from               | Exposed to browser   |
| ------------------------------- | --------------------------------- | -------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Project Settings → API | yes                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | yes (safe)           |
| `GEMINI_API_KEY`                | Google AI Studio                  | **no — server only** |

`.env.local` is gitignored. Restart `npm run dev` after changing it.

### 5. Run

```bash
npm run dev
```

Open http://localhost:3000, sign up, confirm the email, and you land on
`/collection`.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Deployment

The app needs a **Node server**, not static file hosting: it runs Server
Components, Server Actions, route handlers and middleware. Vercel is the
straightforward choice for Next.js, and its free Hobby plan covers a personal
project — but read the "when you start paying" note at the end first.

### What it actually costs

| Piece               | Cost         | Notes                                             |
| ------------------- | ------------ | ------------------------------------------------- |
| Domain (`.com`)     | ~€10-15/year | The only unavoidable payment                      |
| Hosting (Vercel)    | €0           | Hobby plan — **non-commercial use only**          |
| Database (Supabase) | €0           | Free tier; the project pauses after a week idle   |
| Transactional email | €0           | Resend/similar free tier — see step 6             |
| Gemini              | €0           | The same free-tier key, see [AI quota](#ai-quota) |
| HTTPS certificate   | €0           | Issued and renewed automatically                  |

### Checklist

1. **Push to GitHub** — done; Vercel deploys from the repo.
2. **Create a Vercel account** and import the repo. It detects Next.js on its
   own; no build settings to change.
3. **Set the three environment variables** in Vercel → Settings →
   Environment Variables (the same ones as `.env.local`). `GEMINI_API_KEY` must
   _not_ be prefixed with `NEXT_PUBLIC_`, or it ends up in the browser bundle.
4. **Raise the identify route's timeout.** Vercel Hobby functions default to a
   10s limit and a Gemini call with a photo can approach it. Add to
   `app/api/identify/route.ts`:
   ```ts
   export const maxDuration = 60; // seconds; Hobby allows up to 60
   ```
5. **Point the domain at Vercel** — buy it anywhere, add it under Vercel →
   Domains, and set the DNS records it gives you. HTTPS is automatic.
6. **Configure custom SMTP in Supabase** → Authentication → Emails. This is not
   optional: the built-in sender is capped at **2 emails per hour for the whole
   project**, and signup depends on a confirmation email, so the third person to
   register in an hour silently gets nothing. A custom SMTP provider raises it
   to 30/hour, adjustable.
7. **Update Supabase → Authentication → URL Configuration**: set the Site URL to
   the real domain and add `https://yourdomain.com/auth/callback` to the redirect
   allow-list. Otherwise confirmation links keep pointing at `localhost:3000`.
   No code change is needed — the app derives its origin from the request.
8. **Run the migrations** against the production database (`schema.sql` if it is
   a fresh project, then `001`, `002` and `003`). `/api/identify` returns 500
   until `002` has run, and the paywall does not exist until `003` has.
9. **Check it end to end**: sign up with a real address, confirm, add a shirt
   with a photo, and watch the quota counter go down.

### One Supabase project or two?

One is fine for friends-and-family testing — simpler, and there is nothing to
keep in sync. The tradeoff is that local development writes to the same tables
and spends from the same daily AI quota as the live site. Split into a second
project when that starts to matter.

### When you start paying

- **Vercel Hobby forbids commercial use** — explicitly including taking
  payments, ads and donations. The `pro` plan in `plan_limits` is a placeholder
  today, but the day you charge anyone, this needs Vercel Pro ($20/month/member).
- **Supabase free** pauses a project after a week of inactivity and gives 500 MB
  of database and 1 GB of storage for photos. Pro is $25/month.
- **Gemini** stays free until you exceed the project's daily quota; the caps in
  [AI quota](#ai-quota) exist to keep you inside it.

## Routes

| Route                | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `/`                  | Landing page — hero, kit marquee, CTAs                            |
| `/login`, `/signup`  | Email + password auth (redirects to `/collection` when signed in) |
| `/auth/callback`     | Exchanges the Supabase confirmation code for a session            |
| `/collection`        | The collection — server-rendered from Postgres; auth-protected    |
| `POST /api/identify` | Gemini Vision identification (auth required, 10 MB image limit)   |
| `GET /api/world-map` | Projected country outlines for the map view (static, cached)      |

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
year in production and never in development. It is deliberately _not_ part of
the `/collection` payload: the map pays for it once, on first open.

## Plans and limits

Two different things are rationed, and they are easy to confuse:

| Limit                      | What it protects                  | Where                               |
| -------------------------- | --------------------------------- | ----------------------------------- |
| Shirts per account         | The product — this is the paywall | `plan_limits.max_shirts`            |
| AI identifications per day | The Gemini budget                 | `plan_limits.daily_identifications` |

Defaults: `free` holds **25 shirts** and 5 identifications a day; `pro` is
unlimited shirts (`max_shirts is null`) and 100 a day. Change either with an
`UPDATE` — no redeploy. There is no payment integration yet, so upgrades are
manual:

```sql
update public.profiles set plan = 'pro' where email = 'someone@example.com';
```

**The collection limit is enforced by a trigger on `shirts`, not by the Server
Action.** It has to be: users hold a valid session and the anon key, so they can
POST straight to PostgREST and insert rows without going through the app at all,
and RLS will happily allow it because the row is theirs. Only the database can
hold a paywall. The trigger takes a per-user advisory lock so two shirts saved at
the same moment cannot both take the last slot, and raises SQLSTATE `KV001`,
which `createShirt` turns into a readable message. Raising the limit later never
strands anyone: users already over a new, lower limit keep everything they have,
and only new inserts are refused.

In the UI the allowance appears once the collection is more than half full, the
Add button disables at the limit, and a failed insert cleans up the photo that
was already uploaded so it does not sit in the user's storage forever.

## Deleting an account

The account menu has **Delete account**, gated behind typing your own email
address. It removes the photos first, then the account:

- Storage objects are **not** covered by the database's `on delete cascade`, and
  once `auth.users` is gone no session survives that the storage policies would
  accept — the files would be stranded for good. So the action lists the user's
  whole `<uid>/` folder (which also catches uploads whose row never made it in),
  deletes it, and only then removes the account. If the photos cannot be
  deleted it stops and reports, leaving the account intact so the user can retry.
- `delete_own_account()` then deletes the row from `auth.users`, and `profiles`,
  `shirts`, `ai_corrections` and `ai_usage` cascade from it.

It is a `security definer` function rather than a call with the service_role
key deliberately: the app never has to hold a credential that bypasses RLS
entirely, and the function can only ever delete its own caller.

## AI quota

Every account shares one `GEMINI_API_KEY`, and **Gemini rate limits are applied
per project, not per key** — so a second key would not buy more capacity. Two
independent limits guard the budget, both enforced in Postgres:

| Limit                        | Default              | Where it lives                                                                  |
| ---------------------------- | -------------------- | ------------------------------------------------------------------------------- |
| Per-user identifications/day | 5 (free) / 100 (pro) | `plan_limits.daily_identifications` (see [Plans and limits](#plans-and-limits)) |
| App-wide identifications/day | 150                  | `ai_limits.global_daily_limit`                                                  |
| App-wide requests/minute     | 6                    | `ai_limits.global_burst_per_minute`                                             |
| Counter reset timezone       | Europe/Madrid        | `ai_limits.reset_timezone`                                                      |

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
- `POST /api/identify` claims a credit _after_ validating the image but _before_
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
  DeleteAccountDialog.tsx  # GDPR account deletion, confirmed by email
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
using the public anon key directly. The queries in `app/collection/` _also_
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
- ✅ **Phase 3.5** — Per-user AI quota + global daily cap (see [AI quota](#ai-quota))
- ✅ **Phase 3.6** — Interactive world map of the collection (see
  [The map view](#the-map-view))
- 🔜 **Phase 4** — Automatic reference-image enrichment
- 🔜 **Phase 5** — Model improvement from correction feedback (`ai_corrections`
  is already collecting the data)
- ✅ **Phase 3.7** — Per-plan collection limit + account deletion (see
  [Plans and limits](#plans-and-limits))
- 🔜 **Phase 6** — Social profiles, collection stats, PWA

### Before charging anyone

- **Payments.** Nothing is integrated; `profiles.plan` is set by hand. For EU
  consumers, a merchant of record (Paddle, Lemon Squeezy) handles VAT that
  Stripe would leave to you.
- **Move Gemini to the paid tier.** Free-tier content may be used to improve
  Google's products, and the inputs here are photos uploaded by paying users.
- **Vercel Hobby forbids commercial use**, and Supabase's free tier pauses a
  project after a week idle — both need their paid plans. See
  [Deployment](#deployment).
- **Terms, privacy policy and legal entity.** The account deletion above covers
  the right to erasure; the paperwork is still yours to do.
