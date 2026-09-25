# KitVault — social profile setup
<!-- status: DRAFT, awaiting approval · created: 2026-09-25 · nothing has been registered, created or published
     reads: marketing/social/foundation/ (all), branding/profile-images/, README.md, lib/i18n/messages/en.ts -->

Everything needed to fill in the KitVault accounts, copy-paste ready. **No account has been
created and nothing has been published.** Work through `checklist.md`.

## Master table (final recommendations)

| Platform | Display name | Username | Bio | Link | CTA |
|---|---|---|---|---|---|
| **Instagram** ⭐ | KitVault · Football Shirt Collection | `@kitvaultdev` | Your football shirt collection, finally organised. / Photograph a shirt — AI fills in team, season, version. You check it. / Try it for free ↓ | [instagram UTM](https://kitvault.dev/?utm_source=instagram&utm_medium=social&utm_campaign=profile), titled "Try it for free" | Try it for free — link in bio |
| **TikTok** | KitVault · Football Shirts | `@kitvaultdev` | Collection app: photograph a football shirt, AI identifies it. Try it for free ↓ | [tiktok UTM](https://kitvault.dev/?utm_source=tiktok&utm_medium=social&utm_campaign=profile) | Try it for free — link in bio |
| **X** | KitVault · Football Shirts | `@kitvaultdev` | Football shirt collection app, built in public by one dev. Photo in → Gemini reads team, season, version → you check it. Next.js 16 · Supabase. | [x UTM](https://kitvault.dev/?utm_source=x&utm_medium=social&utm_campaign=profile) | Try it for free (link in the first reply) |
| **LinkedIn** (company page) | KitVault | `/company/kitvaultdev` | Catalogue a football shirt collection from a photo. AI identifies each shirt; the collector checks it. | [linkedin UTM](https://kitvault.dev/?utm_source=linkedin&utm_medium=social&utm_campaign=profile) + "Visit website" button | Try it for free (link in the first comment) |
| **GitHub** | KitVault | `kitvaultdev` (org) + the existing repo | A web app for football shirt collectors. Photograph a shirt, AI identifies it, you check it. Built in public with Next.js, Supabase and Gemini. | [github UTM](https://kitvault.dev/?utm_source=github&utm_medium=social&utm_campaign=profile) | Try it for free (README + About) |
| **Product Hunt** | KitVault | `/products/kitvault` + your maker account | Catalogue your football shirt collection from a photo | [producthunt UTM](https://kitvault.dev/?utm_source=producthunt&utm_medium=social&utm_campaign=profile) | Try it for free — no card. Then tell me which shirt it got wrong. |

Profile image everywhere: the full-bleed **Vault Tile**, `branding/profile-images/final/<platform>-profile.png`
(see `branding/profile-images/recommendation.md`).

## Files
| File | What's in it |
|---|---|
| `usernames.md` | The handle strategy, **what was actually verified**, who holds `@kitvault`, fallbacks |
| `links.md` | UTM links, which profiles link where, link labels, contact policy |
| `instagram.md` · `tiktok.md` · `x.md` · `linkedin.md` · `github.md` · `product-hunt.md` | Every field per platform, copy-paste values, pinned post, images, fields to leave blank |
| `checklist.md` | A checkbox list to work through, account by account |

## Key decisions and findings

1. **The handle is `@kitvaultdev`, not `@kitvault`.** `@kitvault` is **taken on GitHub, X and
   TikTok** (all verified 2026-09-25). `kitvaultdev` is verified free on GitHub, shows no profile
   on X or TikTok, and matches the domain. Instagram and LinkedIn couldn't be checked from here.
   Only the sign-up forms confirm availability. Details are in `usernames.md`.
2. **⚠️ Name collision on TikTok.** `@kitvault` on TikTok is a shirt seller ("Premium Affordable
   Jerseys", 1,510 followers). Same audience, same name. The TikTok bio leads with "Collection
   app", and we never use `#kitvault` on TikTok.
3. **Every profile links straight to kitvault.dev.** There's one product and one action, so a
   link-in-bio page would only add a tap. Revisit when sharing or Pro checkout ships.
4. **Pinned-post message, everywhere:** what KitVault does (photo → AI identifies team, season,
   version, maker → **you check it** → it's in your vault), shown with the **real app**, and that
   it's **free to try**. No sharing promise, no numbers. On Instagram, the already-drafted launch
   Reel and post fill the first two pins.
5. **CTA per platform:** `Try it for free` everywhere. The difference is *where the link lives*:
   the bio link (Instagram, TikTok), the first reply (X), the first comment (LinkedIn), the
   About/README (GitHub), the maker comment (Product Hunt).
6. **⚠️ The repo has no licence.** Public code without a licence isn't open source, so no profile
   here says "open source" yet. The foundation's claims register lists it as ✅, and that needs
   correcting or a licence added. See `github.md`.
7. **⚠️ GitHub's "Website" still points to `kit-vault-eight.vercel.app`**, and the description and
   topics are empty. It's a 2-minute fix (`github.md`, step 1).
8. **No public contact address exists** (only `noreply@kitvault.dev`), so every email/contact
   field is intentionally blank. Create `hello@kitvault.dev` (or similar) first if you want one.
9. **No location is set anywhere.** The project doesn't state one, and it doesn't help discovery
   for a web app.
10. **Bios are platform-native, not copies:** Instagram and TikTok use the plainest collector
    language, X leans developer, LinkedIn is the professional company description, GitHub is
    technical, and Product Hunt has launch copy. All of them are British spelling, with no
    exclamation marks and no banned words (`foundation/voice.md`).

## Open questions for you
- `@kitvaultdev` or `@getkitvault`? (The recommendation is kitvaultdev; the trade-off is in
  `usernames.md`.)
- X: a brand account, your personal account, or both? (The foundation recommends personal first.)
- Add a licence to the repo? Which one?
- Move the repo into a `kitvaultdev` GitHub organisation, or keep it on your personal account?
- A public contact inbox?
- The LinkedIn pinned post and the Product Hunt maker comment include personal story lines (your
  collection, the abandoned spreadsheet, other tools starting with a form). Confirm they're true.

## Still to make (image assets)
The avatars exist. These headers/covers are specced in the platform files but **not made yet**:
X header 1500×500 · LinkedIn cover 1128×191 · GitHub social preview 1280×640 · Product Hunt gallery
1270×760 (×4–5) · Instagram highlight covers 1080×1920 (×4). They can all be built from the real UI
in `launch/instagram-post-01/source/post-01.html`, the same way post-01 was, without OpenArt.
