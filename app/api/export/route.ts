import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { thumbPath } from "@/lib/image";
import { getTranslations } from "@/lib/i18n/server";

/** How long the photo links in an export stay valid. */
const PHOTO_LINK_SECONDS = 60 * 60 * 24 * 7; // 7 days

/**
 * GET /api/export
 *
 * Everything KitVault holds about the signed-in user, as one JSON download —
 * the right to data portability (GDPR art. 20), next to the account deletion
 * that already covers erasure.
 *
 * Photos are included as signed links rather than embedded: a collection can
 * run to hundreds of megabytes, and links keep the export instant. They last a
 * week, which is long enough to fetch them and short enough that a forwarded
 * file does not leave a collection readable for good.
 *
 * Every query filters by `user_id` as well as relying on RLS, the same defence
 * in depth as the collection page.
 */
export async function GET() {
  const { t } = await getTranslations();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: t.errors.notSignedIn }, { status: 401 });
  }

  const [profile, shirts, corrections, usage, support, interest] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("shirts")
        .select(
          "id, team, season, version, country, league, manufacturer, team_color, secondary_color, notes, image_path, ai_label, ai_confidence, created_at, updated_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("ai_corrections")
        .select("shirt_id, predicted, corrected, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("ai_usage")
        .select(
          "model, status, input_tokens, output_tokens, total_tokens, created_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("support_messages")
        .select("category, message, page, locale, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }),
      supabase
        .from("upgrade_interest")
        .select("plan, created_at")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

  // The collection is the part that matters; without it there is no export.
  // The rest come from later migrations and are reported as empty if absent.
  if (shirts.error) {
    console.error("[export] shirts:", shirts.error.message);
    return NextResponse.json({ error: t.errors.exportFailed }, { status: 500 });
  }

  const shirtRows = shirts.data ?? [];
  const avatarPath = (profile.data?.avatar_path as string | null) ?? null;
  const paths = shirtRows
    .map((s) => s.image_path as string | null)
    .filter((p): p is string => Boolean(p));

  const linkByPath = new Map<string, string>();
  const toSign = [
    ...paths,
    ...paths.map(thumbPath),
    ...(avatarPath ? [avatarPath] : []),
  ];
  if (toSign.length > 0) {
    const { data: signed } = await supabase.storage
      .from("shirts")
      .createSignedUrls(toSign, PHOTO_LINK_SECONDS);
    for (const s of signed ?? []) {
      if (s.path && s.signedUrl && !s.error) linkByPath.set(s.path, s.signedUrl);
    }
  }

  const exportedAt = new Date();
  const linksExpireAt = new Date(
    exportedAt.getTime() + PHOTO_LINK_SECONDS * 1000,
  );

  const body = {
    exported_at: exportedAt.toISOString(),
    service: "KitVault — https://kitvault.dev",
    account: {
      id: user.id,
      email: user.email ?? null,
      signed_up_at: user.created_at ?? null,
      plan: profile.data?.plan ?? null,
      display_name: profile.data?.display_name ?? null,
      bio: profile.data?.bio ?? null,
      favourite_team: profile.data?.favourite_team ?? null,
      public_vault: profile.data?.username
        ? {
            username: profile.data.username,
            is_public: profile.data.is_public === true,
            url: `https://kitvault.dev/u/${profile.data.username}`,
          }
        : null,
      avatar_url: avatarPath ? (linkByPath.get(avatarPath) ?? null) : null,
    },
    photo_links_expire_at: linksExpireAt.toISOString(),
    shirts: shirtRows.map((s) => {
      const path = s.image_path as string | null;
      return {
        ...s,
        photo_url: path ? (linkByPath.get(path) ?? null) : null,
        thumbnail_url: path ? (linkByPath.get(thumbPath(path)) ?? null) : null,
      };
    }),
    ai_corrections: corrections.data ?? [],
    ai_usage: usage.data ?? [],
    support_messages: support.data ?? [],
    upgrade_waiting_list: interest.data ?? null,
  };

  const day = exportedAt.toISOString().slice(0, 10);
  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="kitvault-export-${day}.json"`,
      // Personal data: never let a shared cache keep a copy.
      "Cache-Control": "no-store",
    },
  });
}
