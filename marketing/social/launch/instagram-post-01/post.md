# Instagram Post 01 — Launch static ad
<!-- campaign: launch · platform: instagram (feed, 4:5) · status: DRAFT, awaiting approval · created: 2026-09-23
     reads: marketing/social/foundation/ (brand-profile, voice, positioning, platforms/instagram.md) -->

**Audience:** football shirt collectors. The brief said developers. It changed after the founder
confirmed that "Your dev setup. Finally organized." would misdescribe the product.
**Pillar:** The organised collection. **Goal:** stop the scroll → profile visit → bio link → try it
free.

## Assets
| File | What |
|---|---|
| `post-01.png` | **Final visual**, 1080×1350 (4:5). Upload this one |
| `post-01.jpg` | Same, as JPEG, if you prefer it |
| `source/post-01.html` | Editable source. Re-render with the headless Chrome command below |

### How it was made
- Built from the real KitVault UI, not AI art:
  - The **Add Shirt modal** in its AI-filled state, the **ShirtCard**, and the **collection map**
    (real world-atlas/d3-geo projection paths, lit with the app's green ramp).
  - Markup and tokens are lifted from `components/AddShirtModal.tsx`, `ShirtCard.tsx`,
    `CollectionMap.tsx`, `Brand.tsx` and `app/globals.css` (via the /brag composition).
- Type: Oswald 700 uppercase for display, Inter for UI and body.
- Colours: #0d0d0f / #1a1a1f / #4ade80, with pitch stripes and the stadium glow from the landing
  hero.
- **OpenArt was not used.** No AI-generated asset was needed: the real UI carries the ad. A
  generated shirt photo would have broken the brand rules (no generated club kits, no fake shirts
  shown as real). So no account check or credit spend happened.
- Demo data shown: FC Barcelona 2019-20 Home, Nike, 87% confidence, "25 shirts · 9 countries".
  This is illustrative, the same demo data as the launch Reel.

Re-render:
```
~/.cache/hyperframes/chrome/chrome-headless-shell/linux-152.0.7977.30/chrome-headless-shell-linux64/chrome-headless-shell \
  --no-sandbox --hide-scrollbars --window-size=1080,1350 --virtual-time-budget=8000 \
  --screenshot=$PWD/post-01.png file://$PWD/source/post-01.html
```

## On-image copy
- **Headline:** YOUR COLLECTION. / FINALLY ORGANIZED. The site's own tagline, spelled as on
  kitvault.dev and in the Reel.
- **Sub:** Photograph a football shirt. AI fills in the team, season, version and maker. You check
  it. It's in your vault.
- **CTA:** Try it for free → · **URL:** kitvault.dev · **Pill:** Free to start · no card

## Caption
```
Photograph a football shirt. KitVault tells you what it is.

Team, season, version, manufacturer — filled in by AI, with a confidence score so you know when to double-check. You review it, you save it, and it lands in your vault.

Once it's in, find any shirt in seconds by league, season or version, and see every country your collection covers on a map.

Free to start: up to 25 shirts, 5 AI identifications a day, no card.

Try it for free → kitvault.dev (link in bio)

How many shirts are in your collection right now?

Football shirt collection app · catalogue your kit collection · football shirt identification

#footballshirts #footballshirtcollection #classicfootballshirts #footballkits #kitvault
```

- **CTA:** Try it for free → kitvault.dev (link in bio). Caption links aren't clickable, so the
  bio link carries the traffic.
- **Keywords:** football shirt collection app, catalogue kit collection, football shirt
  identification, football shirts, football kits.
- **Hashtags:** #footballshirts #footballshirtcollection #classicfootballshirts #footballkits
  #kitvault

## Alt text
> KitVault ad on a dark background. Headline: "Your collection. Finally organized." Below it,
> the KitVault app's Add New Shirt window shows a shirt photo with fields filled in by AI:
> FC Barcelona, 2019-20, Home, Nike, with a note "AI suggested these details (87% confidence)".
> Beside it, a map of Europe with Spain, the UK, France, Germany and Italy highlighted green, and
> a FC Barcelona shirt card. Button: "Try it for free", kitvault.dev.

## Before posting
- [ ] Bio link: `https://kitvault.dev/?utm_source=instagram&utm_medium=social&utm_campaign=launch-post-01`
- [ ] Upload `post-01.png` natively at 4:5 and paste the alt text under Advanced settings → Accessibility.
- [ ] No AI label needed (no AI-generated imagery).
- [ ] Reply to every comment in the first hour.

## Guardrail check
- ✅ Real UI, no fake/generated product shots, no club crest or kit generated.
- ✅ No sharing promise, no accuracy %, no user counts, Free limits stated correctly.
- ✅ No hype words, no exclamation marks, no emoji.
