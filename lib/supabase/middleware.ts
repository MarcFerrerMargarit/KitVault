import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Routes that require an authenticated user. */
const PROTECTED_PREFIXES = ["/collection"];

/**
 * Routes that an already-authenticated user should be bounced away from.
 *
 * `/update-password` is deliberately absent: following a recovery link signs
 * the user in *before* they reach it, so bouncing authenticated users would
 * make the password reset impossible to finish.
 */
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

/**
 * Refreshes the Supabase auth session on every request and enforces access
 * rules. Must run in middleware so cookies are written back to the response.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do NOT run any logic between creating the client and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Gate protected routes.
  if (!user && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Keep signed-in users out of the auth screens.
  if (user && AUTH_ROUTES.some((p) => pathname.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/collection";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
