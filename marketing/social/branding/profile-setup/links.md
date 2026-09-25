# Links — KitVault profiles
<!-- status: DRAFT, awaiting approval · updated: 2026-09-25 -->

## Profile links (copy-paste)

| Platform | Profile link | Where it goes |
|---|---|---|
| Instagram | `https://kitvault.dev/?utm_source=instagram&utm_medium=social&utm_campaign=profile` | Edit profile → Links → Add external link |
| TikTok | `https://kitvault.dev/?utm_source=tiktok&utm_medium=social&utm_campaign=profile` | Edit profile → Website |
| X | `https://kitvault.dev/?utm_source=x&utm_medium=social&utm_campaign=profile` | Edit profile → Website |
| LinkedIn | `https://kitvault.dev/?utm_source=linkedin&utm_medium=social&utm_campaign=profile` | Page → Edit → Page info → Website URL, and the custom button |
| GitHub | `https://kitvault.dev/?utm_source=github&utm_medium=social&utm_campaign=profile` | Organisation settings → URL, and the repo's About → Website |
| Product Hunt | `https://kitvault.dev/?utm_source=producthunt&utm_medium=social&utm_campaign=profile` | Product page → Website link |

## Which profiles link straight to kitvault.dev
**All of them.** KitVault has one product, one page and one action (try it for free). A
link-in-bio page (Linktree and similar) would add a tap between the collector and the sign-up
button, and there's nothing else worth linking to yet.
- The landing page already does the job of a link hub: the pitch, pricing, the sign-up button and
  a "View on GitHub" link.
- **Revisit when** there's a second destination worth a tap, for example public vault pages once
  sharing ships, or a Pro checkout once payments open.

## Link labels
| Platform | Label | Notes |
|---|---|---|
| Instagram | `Try it for free` | Instagram shows the title instead of the URL. Use it |
| TikTok | none | TikTok shows the raw link. The bio's last line ("Try it for free ↓") labels it |
| X | none | X shows a shortened URL. The bio carries the CTA |
| LinkedIn | Custom button: `Visit website` | See `linkedin.md` |
| GitHub | none | Shown as a plain link |
| Product Hunt | none | The "Visit website" button is built in |

## UTM notes
- **One convention**, the same as `foundation/social-strategy.md`:
  `utm_source={platform}&utm_medium=social&utm_campaign={campaign}`. The profile links use
  `utm_campaign=profile`.
- **Campaign links vs profile links:** The launch drafts (`launch/instagram-post-01`,
  `launch/instagram-reel-01`) suggest swapping the bio link to
  `utm_campaign=launch-post-01` / `launch-reel-01` while those posts run. That's fine, but
  **put the `profile` link back afterwards.** Otherwise later traffic gets credited to a campaign
  that ended. When in doubt, leave the profile link in place: the `profile` bucket is still
  useful.
- **Links inside posts** (X first replies, the LinkedIn first comment, Product Hunt launch posts)
  use their own campaign slug, for example
  `https://kitvault.dev/?utm_source=x&utm_medium=social&utm_campaign=pinned-post`.
- **Where to read them:** The site runs Vercel Web Analytics (README → Analytics). Check whether
  your Vercel plan shows UTM parameters before relying on them. If it doesn't, the referrer
  column (instagram.com, t.co, linkedin.com…) still gives a rough per-platform split.
- **Visible-URL trade-off:** X, GitHub and Product Hunt can show the whole URL, tracking
  parameters included. Developers on GitHub especially notice `?utm_…`. If it looks noisy once
  it's live, change that one platform to plain `https://kitvault.dev/` and rely on the referrer.
  Instagram (title) and LinkedIn (button) hide it.

## Other links in the project
| Link | Use |
|---|---|
| `https://kitvault.dev/` | Canonical site. Plain version for spoken or on-screen use ("kitvault.dev") |
| `https://github.com/MarcFerrerMargarit/KitVault` | The public repo, linked from the site footer. See `github.md` for whether it moves to an organisation |
| `https://kit-vault-eight.vercel.app` | ⚠️ **Old.** It's still the repo's "Website" on GitHub. Replace it (see `github.md`) |

## Contact
There's **no public contact address in the project.** The only address is
`noreply@kitvault.dev` (the sender for auth and help-form emails), and it must not be published as
a contact. Signed-in collectors reach the founder through the in-app help form (the lifebuoy icon
in the collection header).

So **every contact/email field is left blank** in these profiles. If you want one, create a real
inbox first (for example `hello@kitvault.dev`), then add it to Instagram's contact options, the
GitHub organisation and the LinkedIn page.
