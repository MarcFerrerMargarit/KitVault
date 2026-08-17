import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing point for every emailed link: signup confirmation, password
 * recovery, magic links.
 *
 * Supabase can deliver the credential in three different shapes depending on
 * the flow and the email template, and only one of them used to be handled —
 * the rest bounced to the login page with an error nothing displayed, which
 * looks exactly like clicking the link doing nothing at all.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // Supabase reports its own failures here (expired link, already used…).
  const supabaseError =
    searchParams.get("error_description") ?? searchParams.get("error");

  // A recovery link must end at the password form even if `next` says
  // otherwise, or the user is quietly signed in and never asked to set one.
  const next =
    type === "recovery"
      ? "/update-password"
      : (searchParams.get("next") ?? "/collection");

  if (supabaseError) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(supabaseError)}`,
    );
  }

  const supabase = await createClient();

  // 1. PKCE: `?code=` exchanged for a session.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`,
      );
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  // 2. Email OTP: `?token_hash=&type=`, what the default templates send.
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`,
      );
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  // 3. Implicit flow: the token is in the URL fragment, which never reaches a
  // server. Forward and let the browser client read it — a redirect keeps the
  // fragment, and the Supabase browser client picks it up on load.
  return NextResponse.redirect(`${origin}${next}`);
}
