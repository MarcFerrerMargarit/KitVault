# Recommendation — KitVault profile image

## Use Concept 01 (Vault Tile) as the main profile image everywhere
- It's already the brand's mark: the favicon (`app/icon.svg`) and the site header use the same
  geometry. Seeing the avatar and then landing on kitvault.dev feels like one brand.
- It has the most contrast and the biggest letterform, so it's the most recognisable at 32–48px
  (comment threads, tagged mentions, notification lists).
- A solid green disc is distinctive in a feed of photo avatars.

**Upload the full-bleed version** (`final/*-profile.png`, made from
`kitvault-profile-main-fullbleed-1024.png`). Every platform below crops avatars to a circle or
rounded square, and full-bleed gives the K the most room.

## Use Concept 02 (KV Monogram) as the secondary mark
Use it for the GitHub organisation (if you create one), a Product Hunt maker/team avatar, and
dark-mode placements where you want something quieter than a green disc. Keep one mark per
platform. Don't mix them on the same account.

## Concept 03 (Kit Crest): not recommended for avatars
It communicates "football", but it turns into a generic t-shirt icon at small sizes and splits
the brand from the favicon. Keep it for stickers or highlight covers.

## Dark vs light UI platforms

| Platform UI | Best file | Why |
|---|---|---|
| **Any (default)** | `kitvault-profile-main-fullbleed-1024.png` / the platform files | The green disc has strong contrast on both black and white UIs |
| **Dark UIs** (X dark, TikTok, GitHub dark, Instagram dark mode) | `kitvault-profile-main-dark-1024.png` or `kitvault-profile-monogram-dark-1024.png` | The near-black field blends into the UI, so the green tile or letters float |
| **Light UIs** (LinkedIn, Product Hunt, Instagram/GitHub light mode) | `kitvault-profile-main-light-1024.png` or `kitvault-profile-monogram-light-1024.png` | The light field blends in. The monogram's V uses the deeper #16a34a to hold contrast |
| **Unknown / overlays / decks** | `*-transparent-1024.png` | The main one is the green tile alone. The monogram sits on a dark rounded tile so it reads on any background |

Most platforms show the same avatar to both light and dark mode users, so the full-bleed green
version is the safe single choice.

## Platform files (final/)
| File | Size | Platform notes |
|---|---|---|
| `instagram-profile.png` | 1024×1024 | Displayed as a 110–320px circle |
| `tiktok-profile.png` | 1024×1024 | Circle. TikTok accepts ≥200×200 |
| `x-profile.png` | 400×400 | X's recommended size. Circle (business accounts using a square avatar: still safe) |
| `linkedin-profile.png` | 400×400 | Personal profile (circle) or company page logo (square). Both are safe |
| `github-profile.png` | 500×500 | GitHub shows a circle (users) or rounded square (orgs) |
| `producthunt-profile.png` | 240×240 | Product Hunt's product thumbnail size. Also fine as a maker avatar |

Sizes follow each platform's published guidance as of 2026. Check them quarterly, since platforms
change these.
