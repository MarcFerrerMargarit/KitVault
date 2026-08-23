import type { Messages } from "./messages/en";

/**
 * Supabase reports auth failures in English, from its own servers — they are
 * not ours to localise at the source. Rather than leave a Spanish page with an
 * English error, the handful a user actually hits are matched and replaced.
 *
 * Matching is on a substring of the known wording, so a rephrasing upstream
 * degrades to showing Supabase's own message rather than the wrong one.
 */
const PATTERNS: Array<{
  match: RegExp;
  pick: (t: Messages) => string;
}> = [
  {
    match: /invalid login credentials/i,
    pick: (t) => t.auth.errors.invalidCredentials,
  },
  {
    match: /email not confirmed/i,
    pick: (t) => t.auth.errors.emailNotConfirmed,
  },
  {
    match: /user already registered|already been registered/i,
    pick: (t) => t.auth.errors.userExists,
  },
  {
    match: /password should be at least|weak password/i,
    pick: (t) => t.auth.errors.weakPassword,
  },
];

export function translateAuthError(message: string, t: Messages): string {
  for (const { match, pick } of PATTERNS) {
    if (match.test(message)) return pick(t);
  }
  return message;
}
