# Hyperframes Composition Brief: KitVault (vertical ad)

## Objective
Make a high-impact, commercial vertical ad for KitVault for Instagram Reels and TikTok.

## Output
- Composition directory: `brag-output-2026-09-23-091001/composition/`
- Rendered video: `brag-output-2026-09-23-091001/brag.mp4`
- Format: vertical, 1080x1920
- Duration: 20.5 seconds

## Source Material
- Project root: /home/marc/KitVault
- Primary files read: app/globals.css, lib/i18n/messages/en.ts, lib/mock-data.ts, components (ShirtCard, AddShirtModal, CollectionMap, Brand, KitMarquee), lib/world-map.ts, app/icon.svg
- UI markup was reused from the earlier KitVault composition (`brag-output-2026-09-23-085839/composition`). It was recreated from the same source files.
- Product name: KitVault
- Tagline: "Your football shirt collection, finally organized"
- Copy that must appear verbatim:
  - Collect football shirts?
  - Finally organized.
  - Snap a photo. / AI does the rest.
  - Analyzing with AI… / AI suggested these details (87% confidence)
  - Find any shirt in seconds.
  - Try it for free
  - https://kitvault.dev/

## Creative Direction
- Tone: app-store preset pushed toward a bold premium social ad (user direction)
- Hook: a question that calls out the audience, slammed onto the downbeat over a bursting kit wall
- Avoid: generic SaaS language, abstract filler, and copy in the Reels UI zones (top ~220px, bottom ~450px, right ~140px), except for the centered final CTA
- Final frame: only "Try it for free" and "https://kitvault.dev/", large and centered, held ≥3s, and the video ends on it

## Visual Identity
#0d0d0f / #1a1a1f / #4ade80 / #f5f5f7 / #8a8a96; Oswald 700 uppercase for display text, Inter for body text.

## Storyboard
See brag-plan.md: Hook 2.1s → Promise 2.6s → AI 4.8s → Grid 3.1s → Map 3.2s → Logo 1.3s → CTA 3.4s.

## Audio
- Music: vol-9, `data-media-start="1.07"` so the grid starts at 0; volume 0.5; fade out 1.2s
- Cue locks: 0.00, 2.11, 15.79; field beat-grid at 6.33/6.85/7.37/7.89
- SFX: impactSoft_heavy_000 (hook), impactSoft_heavy_002 (tagline), drop_002 (photo), click_003 ×4 (fields), bong_001 (banner), card-place-1 / card-slide-2 (grid), switch_002 (map), impactSoft_medium_001 (logo)
- Audio-reactive: RMS drives the glow opacity

## Hyperframes Instructions
The Hyperframes domain skills are not installed locally. The composition was built from `hyperframes docs` and the conventions of the previous composition in this project. `hyperframes check` is the gate.
