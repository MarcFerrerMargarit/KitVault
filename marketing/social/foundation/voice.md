# Voice — KitVault
<!-- version: 1.0 · updated: 2026-09-23 · derived from: the product's own copy (lib/i18n/messages/en.ts)
     and commit messages, since no social posts exist yet · confidence: medium. Re-run voice-builder
     once there are 10+ published posts. -->

Written for `brand-profile.md` v1.0. It is based on the copy already in the product, which is
the founder's writing and is consistently in one voice. Every rule below cites that copy.

## The fingerprint (the 6 things that make it KitVault)

1. **Plain promise, then the honest catch.** It states the benefit, then the limit, in the same
   breath.
   - "No card, no charge — just a heads-up when payments open."
   - "Paid plans aren't open yet. Everything on Free works today, and nothing is charged to
     anyone."
   - "Pick a photo anyway — you can fill the details in yourself."
2. **Collector nouns, not software nouns.** Shirts, kits, collection, vault, archive.
   - "Your vault is empty", "Room for every shirt", "Start your vault today".
   - It never says "items", "entries", "assets" or "users".
3. **Short declaratives with an em-dash turn.** One idea per sentence, and an em-dash for the
   aside.
   - "Show off your vault."
   - "You can close this — it keeps going in the background."
4. **Quiet warmth in small moments.** It is human at the edges, never cute throughout.
   - "Unrolling the world…" (map loading)
   - "Carry on — this runs in the background."
   - "Sent again — have another look."
5. **Specific over general.** It names the real thing.
   - "e.g. FC Barcelona", "e.g. 2019-20", "LaLiga (empty if none)".
   - Social copy names real shirts and seasons, never "your favourite jersey".
6. **Tells you what to do next.** Every problem comes with an action.
   - "Fill the details in manually, or come back tomorrow."
   - "Upgrade to keep adding, or delete one to make room."

## Negative space (what KitVault never does)
- No exclamation marks. There are none anywhere in the product copy, so keep it that way. One is
  allowed only in a genuine celebration reply to a fan.
- No hype adjectives: ultimate, revolutionary, seamless, next-level, game-changing.
- No fake urgency: "Only today!", "Last chance", countdowns.
- No emoji walls. At most one emoji per post.
- No "we're excited to announce" and no "Hey guys!".
- Tech jargon is never aimed at collectors: no "LLM", "vision model", "Supabase" or "RLS" in
  collector posts. Those words belong in build-in-public posts only.

## Lexicon

| Say | Don't say |
|---|---|
| shirt, kit | jersey (US-targeted copy only), apparel, merch |
| collection, vault, archive | inventory, database, library |
| add a shirt, catalogue it | upload an item, create an entry |
| 2004-05 (season format) | 04/05, 2004/2005 |
| Home · Away · Third · GK | primary/alternate |
| player version / fan version | authentic/replica (loaded words, since there are no authenticity claims) |
| AI identifies it, you check it | AI does it all, automatic magic |
| Try it for free | Sign up now, Get started today!! |
| collectors | users, customers, fans (when you mean collectors) |

- **Spelling:** British in English copy (catalogue, organised, colour, favourite).
- **Case:** Sentence case in captions. UPPERCASE Oswald only for on-image headlines, which
  matches the site.
- **Numbers:** Numerals always ("25 shirts", "5 a day").
- **Spanish:** Uses "tú". "Camiseta", not "jersey" or "playera" (Spain first). Take
  `lib/i18n/messages/es.ts` as the reference for tone.

## Tone map (voice stays the same, register shifts)

| Context | Shift |
|---|---|
| Instagram carousel/feed | Collector-to-collector, visual-led, captions of 1–4 short paragraphs |
| Reels / TikTok | Faster. On-screen text does the work. The first line is a shirt or a question, never the brand name |
| X — kit culture | Opinionated, quick, reply-worthy. Hot takes on kits, never on people |
| X / LinkedIn — build in public | First person (the founder), technical specifics welcome, honest numbers only |
| Replies & DMs | Warm, short. Name the shirt they mentioned |
| Something broke / limit hit | Say what happened, what to do, no grovelling. Model: "KitVault has reached today's shared AI limit. Fill the details in manually, or try again tomorrow." |

## Do / don't rewrites

1. ❌ "Revolutionise how you manage your jersey collection with AI-powered technology! 🚀"
   ✅ "Photo in. Liverpool · 2018-19 · Home · New Balance out. You check it, it's in your vault."
2. ❌ "Our app has amazing filtering capabilities for all your needs."
   ✅ "Every Serie A away shirt you own, in two taps. Filter by league, season, version or
   country."
3. ❌ "Sign up today and never lose track again!!"
   ✅ "Your first shirt takes under a minute. Try it for free — link in bio."
4. ❌ "Share your amazing collection with the world!" (not built yet)
   ✅ "Screenshot your map. How many countries is your collection in?"
5. ❌ "Our AI is 100% accurate."
   ✅ "It gets most shirts right and tells you how sure it is. You get the final say."

## Voice test (for validation)
A fresh post written only from this file, on a topic that isn't in the samples:

> The 1994 USA away (the denim one) is the shirt everyone photographs wrong. Flat on a bed, the
> stars fold into nothing. Hang it, light from the side, fill the frame. A clear photo like that
> also gives KitVault's identification its best shot. Try it for free — link in bio.

Checked against the fingerprint: specific shirt ✓, plain promise ✓, useful action ✓, no hype ✓,
no exclamation mark ✓, collector nouns ✓. Not yet checked by the founder, so confirm it reads
like you.
