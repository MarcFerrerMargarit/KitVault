# Email templates

Supabase stores auth email templates in its dashboard, not in the project, so
they are invisible to `git` and easy to lose when someone edits them in a hurry.
These files are the source of truth: edit here, then paste.

## Where they go

Supabase → **Authentication** → **Emails** → **Templates**

| File | Template | Subject |
|------|----------|---------|
| `confirm-signup.html` | Confirm signup | `Activa tu vitrina de KitVault` |
| `reset-password.html` | Reset password | `Restablece tu contraseña de KitVault` |

The remaining templates (Magic Link, Invite user, Change Email Address,
Reauthentication) stay on Supabase's defaults — no flow in the app sends them
yet. Write them here first when one does.

## Why they look the way they do

Email clients are two decades behind browsers: no external stylesheets, no
custom fonts, no flex or grid, and Outlook still renders through Word. So the
layout is nested tables with inline styles and `bgcolor` attributes, which is
the only combination every client agrees on. The palette is the app's own
(`app/globals.css`), and the condensed wordmark falls back to Arial Narrow since
Oswald cannot be loaded.

Every message carries the link twice — once as a button, once as plain text —
because some clients strip the button, and some corporate scanners rewrite it.

## One language only

Supabase picks a template by type, not by who is receiving it, so these cannot
follow the recipient's chosen locale the way the app does. They are written in
Spanish, which is what most of the first users read. Anyone who switches the app
to English will still get a Spanish email; the only real fix is sending the mail
from the app instead of from Supabase Auth, which is a much bigger change than
it sounds.

## After editing

Send yourself one of each from a real browser — not the dashboard preview, which
does not run the same rendering path — and check it against a phone, since that
is where most of them are opened.
