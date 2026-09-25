# LinkedIn Company Page — profile setup (maintenance channel)
<!-- status: DRAFT, awaiting approval · updated: 2026-09-25 · reads: foundation/platforms/linkedin.md -->

**Audience:** developers, indie makers, potential collaborators, and anyone checking who's behind
KitVault after seeing your posts. **Job of the page:** a credible, professional home for the
product, so that your personal profile can list KitVault as your work. As
`foundation/platforms/linkedin.md` says, **the posting happens from your personal profile**,
because company pages get very little organic reach. The page is the credible landing spot, not
the engine.

## Copy-paste values

| Field | Value |
|---|---|
| Page type | Company |
| Name | `KitVault` |
| LinkedIn public URL | `linkedin.com/company/kitvaultdev` (fallbacks: `kitvault`, `getkitvault`, `kitvault-app`; LinkedIn couldn't be checked, see `usernames.md`) |
| Website | `https://kitvault.dev/?utm_source=linkedin&utm_medium=social&utm_campaign=profile` |
| Industry | `Software Development` |
| Organisation size | `0-1 employees` |
| Organisation type | `Self-employed`. There's no legal entity yet (README → "Before charging anyone"). Change it when one exists |
| Founded | `2026` (first commit: 2026-06-28) |
| Tagline (≤120) | see below |
| About / Overview (≤2,000) | see below |
| Specialties | see below |
| Location | **leave blank** (none in the project. Add a city only if you want local visibility) |
| Phone | **leave blank** |
| Custom button | `Visit website` → the same UTM link |
| Logo | `branding/profile-images/final/linkedin-profile.png` (400²) |
| Cover | 1128×191, spec below |
| Languages | English. Add a Spanish (`es`) tagline and description with the text below |

### Tagline (≤120 characters)
```
Catalogue a football shirt collection from a photo. AI identifies each shirt; the collector checks it.
```

### About / Overview
```
KitVault is a web app for football shirt collectors. Photograph a shirt and it identifies the team, season, version (home, away, third or goalkeeper) and manufacturer, with a confidence score. The collector reviews every suggestion before anything is saved, and corrections are kept.

Once a shirt is in, the collection becomes an archive you can use: filter by country, league, season or version, search by team, see collection stats, and view an interactive world map of every country the collection covers.

What it is today:
• Free plan: up to 25 shirts and 5 AI identifications a day, no card required.
• Pro (announced, €4.99/month): unlimited shirts, 100 identifications a day and bulk upload of up to 20 photos. Payments aren't open yet, so Pro has a waiting list.
• Works in any browser, including on a phone. English and Spanish.
• Private by default. Accounts, photos and collections can be deleted completely.

How it's built: KitVault is built and run by one developer, in public. Next.js 16 and React 19, Supabase (Postgres with row-level security, private photo storage), Google Gemini for image identification, and d3-geo for the server-rendered collection map. The code is public on GitHub.

Try it for free at kitvault.dev.
```
(About 1,200 characters, which leaves room to add a licence line once there is one; see
`github.md`.)

### Spanish (secondary language)
Tagline:
```
Cataloga tu colección de camisetas de fútbol a partir de una foto. La IA identifica cada camiseta y tú la revisas.
```
About (short version):
```
KitVault es una web para coleccionistas de camisetas de fútbol. Haz una foto a una camiseta y la IA identifica el equipo, la temporada, la versión y el fabricante, con un porcentaje de confianza. Tú lo revisas antes de guardarlo. Después, filtra tu colección por país, liga, temporada o versión y mírala en un mapa del mundo. Gratis hasta 25 camisetas, sin tarjeta. Pruébalo gratis en kitvault.dev.
```

### Specialties (LinkedIn allows up to 20; enter each one separately)
```
Football shirt collections
Football kit cataloguing
AI image identification
Computer vision
Collection management
Web applications
Next.js
Supabase
Build in public
```

## CTA
**Try it for free** (the About text's last line), plus the **Visit website** button. In posts
from your personal profile: "If you own more than a handful of football shirts, try it for free —
link in the first comment". LinkedIn reach drops when a link is in the post body.

## Keywords
football shirt collection · football kit · AI image identification · computer vision · Gemini ·
Next.js · Supabase · indie product · build in public · collector app

## Pinned post (on the company page, and reshared from your profile)
**What it must communicate:** why KitVault exists and what it does, told by the person who built
it, with a real demo. LinkedIn rewards a first-person decision or lesson over a product ad.

Suggested first pinned post (native video: the 20s launch video, or a 30s screen recording):
```
I own more football shirts than I can remember, and the spreadsheet I started for them died somewhere around row 30.

So I built KitVault. You photograph a shirt, and Gemini Vision reads the team, season, version and manufacturer, with a confidence score. You check it, fix it if it's wrong, and it's in your collection. Then you can filter everything by league, season or version, or see it on a world map.

A few decisions I'd make again:
• The AI suggests, the collector decides. Nothing is saved without a review, and every correction is stored.
• Honest limits. The free plan has 25 shirts and 5 identifications a day, because every identification costs real money.
• Paid plans are visible but greyed out. Payments aren't built yet, so there's a waiting list instead of a fake checkout.

Built solo with Next.js 16, Supabase and Gemini. The code is public on GitHub.

If you (or someone you know) collect football shirts, try it for free — link in the first comment.
```
First comment: `https://kitvault.dev/?utm_source=linkedin&utm_medium=social&utm_campaign=pinned-post`

⚠️ **Confirm before posting:** the opening two lines (your own collection, the abandoned
spreadsheet) are a *suggested* story, taken from the "why this exists" angle in the foundation.
Nothing in the project records them. Keep them only if they're true, and rewrite them in your
own words if not. Everything after them is verified against the code and README.

## Profile image (logo)
`branding/profile-images/final/linkedin-profile.png`. It's shown as a square on company pages;
the full-bleed tile works there.

## Cover (1128×191), to be made
- #0d0d0f with pitch stripes. On the right half: the real collection view (shirt cards + the
  filter bar) or the map, cropped into a strip.
- Left-centre, Inter or Oswald: `Your football shirt collection, finally organised.`
- Keep the **left ~300 px clear** (the logo overlaps it on desktop) and keep text off the top and
  bottom 20 px.

## Other fields to complete
- [ ] On your personal profile: add KitVault as your current position (after the page exists, so
      the logo links). Headline: `Building KitVault — AI that catalogues your football shirt
      collection from a photo` (from the foundation).
- [ ] Personal profile → Featured: kitvault.dev (UTM), the GitHub repo, the pinned post.
- [ ] Add the Spanish language version of the tagline and About.

## Leave blank on purpose
Location · phone · a public email (none exists yet) · Products tab / Services page (it doesn't
apply yet) · Careers / hiring · LinkedIn Premium Page (paid) · paid "Promote" boosts.
