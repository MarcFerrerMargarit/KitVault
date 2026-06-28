# KitVault

A web app to **collect and organize football shirts**. Photograph a shirt, let
AI identify it, and build a clean, private archive of every jersey you own.

> **Phase 1 — UI prototype.** Everything runs on local mock data. No backend,
> auth, or real AI yet (those arrive in later phases — see the roadmap below).

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4** (dark-only design system)
- **TypeScript** (strict, no `any`)
- **Lucide React** icons
- shadcn/ui-style primitives (built locally in `components/ui`)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Routes

| Route         | Description                                              |
| ------------- | ------------------------------------------------------- |
| `/`           | Landing page — hero, features, CTAs                     |
| `/collection` | The collection: stats, real-time filters, grid, modals  |

## Project structure

```
app/
  page.tsx               # Landing page
  collection/page.tsx    # Collection dashboard
  layout.tsx             # Fonts (Oswald display / Inter body) + metadata
  globals.css            # Tailwind v4 theme tokens & design system
components/
  Brand.tsx              # KitVault wordmark
  CollectionHeader.tsx   # Collection top bar + account menu
  ShirtCard.tsx          # Card with team-color side band
  ShirtGrid.tsx          # Stateful controller: filtering + modals
  FilterBar.tsx          # Search + country/league/season/version filters
  StatsBar.tsx           # Headline stats
  AddShirtModal.tsx      # Upload → mock AI analysis → editable form
  ShirtDetailModal.tsx   # Large detail view + AI identification
  ui/                    # Button, Card, Dialog, Select, Input, Badge, …
lib/
  mock-data.ts           # 14 sample shirts + option lists + AI suggestions
  types.ts               # Domain types
  shirt-helpers.ts       # Version badge colors, placeholder gradients
  utils.ts               # cn() class merge helper
```

## Design system

Dark, premium and sporty — inspired by Letterboxd / Discogs but for kits.

- Background `#0D0D0F`, cards `#1A1A1F`, grass-green accent `#4ADE80`
- Condensed bold display type (Oswald), clean body (Inter)
- Minimal border radius for an angular, serious feel
- Signature: each shirt card carries a **vertical team-color band** on its left
  edge, like the trim of the shirt itself

Tokens live in `app/globals.css` under `@theme` (e.g. `bg-bg`, `text-accent`,
`border-border-strong`).

## Notable interactions

- **Real-time, client-side filtering** over the mock collection
- **Add Shirt flow**: drag-and-drop → 2s mock "Analyzing with AI…" → form
  pre-filled with random suggested data the user can correct
- **Add / edit / delete** update local state immediately
- Modals close on **Escape** and **backdrop click**, with body-scroll lock

## Roadmap

- ✅ **Phase 1** — UI prototype (this repo)
- 🔜 **Phase 2** — Supabase auth + Postgres + storage
- 🔜 **Phase 3** — Gemini Vision identification (`POST /api/identify`)
- 🔜 **Phase 4** — Automatic reference-image enrichment
- 🔜 **Phase 5** — Model improvement from correction feedback
- 🔜 **Phase 6** — Social profiles, collection stats, PWA
