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
   - `004_plan_features_and_pricing.sql` — **required**. Bulk upload as a plan
     feature, plan prices, and public read access for the pricing table.
   - `005_upgrade_interest.sql` — **required**. The upgrade waiting list.
3. **Authentication → URL Configuration** → set the Site URL to
   `http://localhost:3000` and add `http://localhost:3000/**` to the redirect
   allow-list. The wildcard matters: password-reset links come back as
   `/auth/callback?next=/update-password&code=…`, and an entry without it can
   reject the extra query.
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
| Transactional email | €0           | Resend/similar free tier — see step 5             |
| Gemini              | €0           | The same free-tier key, see [AI quota](#ai-quota) |
| HTTPS certificate   | €0           | Issued and renewed automatically                  |

### Checklist

1. **Push to GitHub** — done; Vercel deploys from the repo.
2. **Create a Vercel account** and import the repo. It detects Next.js on its
   own; no build settings to change.
3. **Set the three environment variables** in Vercel → Settings →
   Environment Variables (the same ones as `.env.local`). `GEMINI_API_KEY` must
   _not_ be prefixed with `NEXT_PUBLIC_`, or it ends up in the browser bundle.
4. **Point the domain at Vercel** — buy it anywhere, add it under Vercel →
   Domains, and set the DNS records it gives you. HTTPS is automatic.
5. **Configure custom SMTP in Supabase** → Authentication → Emails. This is not
   optional: the built-in sender is capped at **2 emails per hour for the whole
   project**, and signup depends on a confirmation email, so the third person to
   register in an hour silently gets nothing. A custom SMTP provider raises it
   to 30/hour, adjustable.
6. **Update Supabase → Authentication → URL Configuration**: set the Site URL to
   the real domain and add `https://yourdomain.com/**` to the redirect
   allow-list. Otherwise confirmation links keep pointing at `localhost:3000`.
   No code change is needed — the app derives its origin from the request.
7. **Run the migrations** against the production database (`schema.sql` if it
   is a fresh project, then `001` through `005`). `/api/identify` returns 500
   until `002` has run, and the paywall does not exist until `003` has.
8. **Check it end to end**: sign up with a real address, confirm, add a shirt
   with a photo, watch the quota counter go down — then log out, use
   **Forgot it?** and complete a password reset.

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
| `/`                  | Landing page — hero, kit marquee, pricing, CTAs                   |
| `/login`, `/signup`  | Email + password auth (redirects to `/collection` when signed in) |
| `/upgrade`           | Plan comparison + the upgrade waiting list (auth-protected)       |
| `/forgot-password`   | Request a password-reset link                                     |
| `/update-password`   | Set a new password after following that link                      |
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

## Photos and bandwidth

Phone photos are 3-5 MB. Stored and served raw, a 25-shirt grid would pull
~75 MB **on every page view** — the largest variable cost of running this app
(Supabase Pro includes 250 GB of egress, then charges per GB) and painful on
mobile data. So nothing is uploaded at its original size.

`lib/image.ts` downscales in the browser before anything leaves it, producing
two JPEGs from each pick:

| Version | Long edge | Typical size | Used by             |
| ------- | --------- | ------------ | ------------------- |
| `full`  | 1600px    | ~600 KB      | The detail view     |
| `thumb` | 400px     | ~40 KB       | The collection grid |

Measured on a synthetic 4032×3024 photo: **3.2 MB → 588 KB full, 39 KB thumb**,
in 117 ms. Real photos compress better than the noise used in that test. The
grid therefore loads ~1 MB instead of ~80 MB.

Details worth knowing:

- The thumbnail's path is a convention, not a column: `<uid>/<uuid>.jpg` →
  `<uid>/<uuid>_thumb.jpg`. Shirts added before thumbnails existed have no file
  there, the signed-URL call skips them, and the grid falls back to the full
  image — no migration, no backfill.
- Re-encoding as JPEG also **strips EXIF**, including any GPS coordinates the
  camera wrote into the original. Worth keeping in mind before changing this.
- If the browser cannot decode a file, the original is uploaded unchanged
  rather than the upload being refused.
- `/api/identify` receives the downscaled copy. Gemini tiles images to a capped
  number of tokens, so this costs no accuracy and uploads far quicker.

## Signing up and getting back in

Both email flows run through the same `/auth/callback`. Supabase can deliver the
credential in three different shapes, and the route handles all of them —
handling only the first is why an emailed link can appear to do nothing at all:

| Shape                | When                                     | How it is handled                                                                |
| -------------------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| `?code=`             | PKCE, the default for the browser client | `exchangeCodeForSession`                                                         |
| `?token_hash=&type=` | Email OTP, what the stock templates send | `verifyOtp`                                                                      |
| `#access_token=`     | Implicit flow                            | Fragments never reach a server: forward, and the browser client reads it on load |

A `type=recovery` link is forced to `/update-password` whatever `next` says, and
any error Supabase reports (`?error_description=`) is passed to the login page,
**which now displays it**. Previously the callback redirected to
`/login?error=auth` and nothing rendered that param, so a dead link looked
identical to a link that did nothing.

| Flow                  | Where the link lands                   | Then                         |
| --------------------- | -------------------------------------- | ---------------------------- |
| Confirm a new account | `/auth/callback?next=/collection`      | Straight into the collection |
| Reset a password      | `/auth/callback?next=/update-password` | Asked to choose a new one    |

That `next` on the reset link is the whole trick. Without it the recovery link
signs the user in and drops them in the app, **never asking for a new
password** — they end up logged in with the password they could not remember.

Other details that matter more than they look:

- `/update-password` is deliberately not in the middleware's auth-route list.
  Those routes bounce signed-in users away, and by the time someone reaches this
  page the recovery link has already signed them in — bouncing them would make
  the reset impossible to finish.
- Reaching `/update-password` without a session means the link was expired or
  already used, so the page says exactly that and offers a fresh one instead of
  failing on save.
- **The reset form never reveals whether an address has an account.** It reports
  the same "check your email" either way; anything else turns it into a way to
  probe who is registered here.
- The "check your email" screen after signup can **resend the confirmation**.
  Those emails go missing often enough that without it the only way back is to
  sign up again with the same address.

### Email confirmation is a Supabase setting

**Authentication → Sign In / Providers → Confirm email** decides whether signup
sends anything at all. With it off, `signUp` returns a session immediately and
the app takes the user straight to their collection — the "check your email"
screen never appears. That is a reasonable way to test with people you know.

Turn it on before opening the app to strangers: without it, anyone can register
under an address they do not own, and there is then no way to reach the real
owner or to trust the address for a password reset.

Password recovery is **not** affected by that setting — it always emails.

Either way, configure a custom SMTP sender before letting people in: Supabase's
built-in one sends **2 emails per hour for the whole project**. That is enough
to test the reset flow on your own address a couple of times, and nowhere near
enough for real users. See step 5 of the [deployment checklist](#checklist).

## Plans and limits

Different things are rationed, and they are easy to confuse:

| Limit                      | What it protects                  | Where                               |
| -------------------------- | --------------------------------- | ----------------------------------- |
| Shirts per account         | The product — this is the paywall | `plan_limits.max_shirts`            |
| AI identifications per day | The Gemini budget                 | `plan_limits.daily_identifications` |
| Bulk upload                | A paid perk, not a cost           | `plan_limits.bulk_upload`           |

Defaults: `free` holds **25 shirts**, 5 identifications a day and no bulk
upload; `pro` is unlimited shirts (`max_shirts is null`), 100 a day, bulk
upload, at a **placeholder €4.99/month** — set your real price before launch.
Change any of them with an `UPDATE`: no redeploy, and the landing page's
pricing table follows, because it reads the same rows. There is no payment
integration yet, so upgrades are manual:

```sql
update public.profiles set plan = 'pro' where email = 'someone@example.com';
```

### Which plan am I on?

A chip in the collection header says so at all times, and the account menu
repeats it. On the free plan the chip is a link to `/upgrade`, which compares
the plans and shows how much of the allowance is already used.

**Payments are not wired up.** Rather than an Upgrade button that does nothing,
`/upgrade` records interest in `upgrade_interest` — which doubles as the one
number worth having before paying for Vercel Pro and Supabase Pro:

```sql
select u.email, i.created_at
  from public.upgrade_interest i
  join auth.users u on u.id = i.user_id
 order by i.created_at desc;
```

Upgrades are still applied by hand (`update public.profiles set plan = 'pro' …`).

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

## Bulk upload (Pro)

Plans with `bulk_upload` get a second button next to **Add shirt**: pick up to
20 photos, let them all be identified, then walk the batch and correct anything
wrong before saving. A filmstrip across the top shows every photo with a tick or
a warning, so it is obvious which ones still need a team and a season — the save
button stays disabled until none do.

**The batch runs in the background.** Closing the review — backdrop click,
Escape, the "Keep working" button — only hides it; the job lives in
`BulkJobProvider`, above the dialog, so it keeps going. A floating badge reports
progress, reopens the review on demand, and can cancel the batch. The tab title
carries the progress too (`(3/12) Analyzing…`), so it is visible from another
tab, and leaving the page while a batch is unsaved asks for confirmation —
those identifications cost AI credits.

The other parts that are not obvious:

- **Photos are identified one at a time, paced ~1.2s apart.** The server's
  per-minute burst guard exists to stay inside Gemini's requests-per-minute
  ceiling, and firing 20 requests at once would trip it on most of them. If it
  trips anyway, the batch waits it out and retries rather than failing the photo.
- **A spent daily quota stops the calls early.** Once the API reports the
  allowance is gone, the rest of the batch skips identification instead of
  collecting 15 identical refusals; those photos are simply filled in by hand.
- **Saving inserts row by row, not as one statement.** The collection limit is a
  per-row trigger, so a single multi-row insert would roll the whole batch back
  the moment the allowance ran out. One at a time, the shirts that fit are kept
  and the user is told exactly how many were refused. Photos belonging to
  refused shirts are deleted from storage rather than left orphaned.
- The button is hidden for plans without the feature, but that is presentation
  only. Nothing here is a security boundary: what costs money — AI credits and
  collection size — is enforced in the database either way.

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
  BulkAddModal.tsx         # Pro: the batch review dialog
  BulkJobProvider.tsx      # The batch itself — outlives the dialog
  BulkJobBadge.tsx         # Floating progress pill for a background batch
  ShirtFields.tsx          # The editable shirt fields, shared by both flows
  DeleteAccountDialog.tsx  # GDPR account deletion, confirmed by email
  PlanBadge.tsx            # Free/Pro chip in the header; free links to /upgrade
  UpgradeInterest.tsx      # Joins the waiting list
  auth/AuthForm.tsx        # Shared login / signup form
  auth/ForgotPasswordForm.tsx  # Request a reset link
  auth/UpdatePasswordForm.tsx  # Set the new password
  landing/                 # HeroBackdrop, KitMarquee, Pricing
  ui/                      # Button, Card, Dialog, Select, Input, Badge, …
lib/
  supabase/                # Browser, server and middleware clients
  db.ts                    # `shirts` row shape + row → domain mapper
  quota.ts                 # Quota types, RPC reader, refusal messages
  image.ts                 # Browser-side downscaling + thumbnail paths
  plans.ts                 # Public plan catalogue for the pricing table
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
- ✅ **Phase 3.8** — Bulk upload for paid plans + a pricing table on the landing
  page driven by `plan_limits` (see [Bulk upload](#bulk-upload-pro))
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
