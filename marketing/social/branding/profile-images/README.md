# KitVault profile images

Profile images for Instagram, TikTok, X, LinkedIn, GitHub and Product Hunt. **Status: draft,
awaiting approval. Nothing has been uploaded.**

**Recommendation:** Concept 01 (Vault Tile), full-bleed, on every platform. Details and the
dark/light UI guidance are in [`recommendation.md`](recommendation.md).

## How they were made
- Everything is vector, drawn from the real KitVault mark. The K is copied from `app/icon.svg`
  (the favicon). Colours come from `app/globals.css`: #0d0d0f, #f5f5f7, #4ade80, plus #16a34a
  for green on light backgrounds.
- `source/build.py` generates every file (rsvg-convert + ImageMagick):
  `python3 marketing/social/branding/profile-images/source/build.py`. The SVG sources are written
  to `source/svg/`.
- **OpenArt was not used.** A logo needs exact, repeatable geometry that matches the favicon,
  and image models can't guarantee crisp letterforms at 32px. No credits were spent and no
  external API was called.

## Concepts
| Folder | Concept | Summary |
|---|---|---|
| `concept-01/` | Vault Tile ⭐ | The existing green tile + dark K + vault bar. Strongest at small sizes, matches the favicon |
| `concept-02/` | KV Monogram | White K + green V over a green bar, like the wordmark's split. Premium on dark UIs. The secondary mark |
| `concept-03/` | Kit Crest | A green shirt silhouette with the K knocked out. Says "football", but turns generic at small sizes |

Each folder has `concept-description.md`, `preview.png` (the master + circular crops at 160/64/32px
on dark and light UIs) and the 1024px masters.

## Final assets (`final/`)
| File | Size | Description |
|---|---|---|
| `kitvault-profile-main-dark-1024.png` | 1024² | Vault Tile on #0d0d0f |
| `kitvault-profile-main-light-1024.png` | 1024² | Vault Tile on #f5f5f7 |
| `kitvault-profile-main-transparent-1024.png` | 1024² | Vault Tile, transparent background |
| `kitvault-profile-main-fullbleed-1024.png` | 1024² | Full-bleed green + K. **The master for all platform uploads** (extra file, not in the original list) |
| `kitvault-profile-monogram-dark-1024.png` | 1024² | KV on #0d0d0f |
| `kitvault-profile-monogram-light-1024.png` | 1024² | KV on #f5f5f7, V/bar in #16a34a |
| `kitvault-profile-monogram-transparent-1024.png` | 1024² | KV on a dark rounded tile, transparent corners |
| `instagram-profile.png` | 1024² | Full-bleed main |
| `tiktok-profile.png` | 1024² | Full-bleed main |
| `x-profile.png` | 400² | Full-bleed main |
| `linkedin-profile.png` | 400² | Full-bleed main |
| `github-profile.png` | 500² | Full-bleed main |
| `producthunt-profile.png` | 240² | Full-bleed main |

All the important content sits inside the inscribed circle, so it's safe for circular crops.
