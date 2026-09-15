import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "@/lib/i18n/server";

/** Categories the form offers; mirrors the CHECK constraint in migration 007. */
const CATEGORIES = ["bug", "idea", "question", "other"] as const;
type Category = (typeof CATEGORIES)[number];

const MIN_LENGTH = 10;
const MAX_LENGTH = 4000;

/** Row returned by the `submit_support_message()` Postgres function. */
interface SubmitRow {
  allowed: boolean;
  reason: string;
  message_id: string | null;
}

/**
 * POST /api/support
 * Body: { category, message, page?, locale? }
 *
 * Records the message and emails it on. The database row is the record; the
 * email is only the notification, so a mail failure is logged and swallowed
 * rather than losing what someone took the trouble to write.
 */
export async function POST(request: Request) {
  const { t } = await getTranslations();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: t.errors.notSignedIn }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: t.errors.supportFailed }, { status: 400 });
  }

  const category = String(body.category ?? "") as Category;
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json({ error: t.errors.supportFailed }, { status: 400 });
  }

  const message = String(body.message ?? "").trim();
  if (message.length < MIN_LENGTH || message.length > MAX_LENGTH) {
    return NextResponse.json(
      { error: t.errors.supportTooShort },
      { status: 400 },
    );
  }

  const page = body.page ? String(body.page).slice(0, 200) : null;
  const locale = body.locale ? String(body.locale).slice(0, 10) : null;

  // Store first. This both keeps the message and enforces the ration, in one
  // statement so two quick submissions cannot both slip through.
  const { data: submitted, error: submitError } = await supabase
    .rpc("submit_support_message", {
      p_category: category,
      p_message: message,
      p_page: page,
      p_locale: locale,
    })
    .single<SubmitRow>();

  if (submitError || !submitted) {
    console.error("[support] could not record:", submitError?.message);
    return NextResponse.json({ error: t.errors.supportFailed }, { status: 500 });
  }

  if (!submitted.allowed) {
    return NextResponse.json(
      { error: t.errors.supportRateLimit, reason: submitted.reason },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  await notify({
    category,
    message,
    page,
    locale,
    email: user.email ?? "unknown",
    userId: user.id,
    messageId: submitted.message_id,
  });

  return NextResponse.json({ ok: true });
}

interface Notification {
  category: Category;
  message: string;
  page: string | null;
  locale: string | null;
  email: string;
  userId: string;
  messageId: string | null;
}

/**
 * Email the message on. Never throws and never fails the request: the row is
 * already saved, and `support_messages` can be read directly if mail breaks.
 */
async function notify(n: Notification) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SUPPORT_EMAIL;

  if (!apiKey || !to) {
    console.warn(
      "[support] RESEND_API_KEY or SUPPORT_EMAIL is unset — message saved but not emailed",
    );
    return;
  }

  const from = process.env.SUPPORT_FROM ?? "KitVault <noreply@kitvault.dev>";
  const label = n.category.toUpperCase();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // Replying in the mail client answers the person who wrote in.
        reply_to: n.email,
        subject: `[KitVault · ${label}] ${n.email}`,
        text: plainText(n),
        html: html(n),
      }),
    });

    if (!res.ok) {
      console.error("[support] Resend rejected:", res.status, await res.text());
    }
  } catch (err) {
    console.error(
      "[support] could not send:",
      err instanceof Error ? err.message : err,
    );
  }
}

/** Plain-text part, so the message is readable wherever it is opened. */
function plainText(n: Notification): string {
  return [
    n.message,
    "",
    "—",
    `From:     ${n.email}`,
    `Category: ${n.category}`,
    `Page:     ${n.page ?? "—"}`,
    `Language: ${n.locale ?? "—"}`,
    `User:     ${n.userId}`,
    `Message:  ${n.messageId ?? "—"}`,
  ].join("\n");
}

function html(n: Notification): string {
  const rows: [string, string][] = [
    ["From", n.email],
    ["Category", n.category],
    ["Page", n.page ?? "—"],
    ["Language", n.locale ?? "—"],
    ["User id", n.userId],
    ["Message id", n.messageId ?? "—"],
  ];

  const meta = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:3px 14px 3px 0;color:#8a8a96;white-space:nowrap;">${k}</td>` +
        `<td style="padding:3px 0;color:#f5f5f7;word-break:break-all;">${escape(v)}</td></tr>`,
    )
    .join("");

  return `<div style="background:#0d0d0f;padding:24px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#1a1a1f;border:1px solid #2a2a33;border-radius:4px;padding:26px;">
    <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#4ade80;margin-bottom:14px;">
      ${escape(n.category)}
    </div>
    <div style="font-size:15px;line-height:1.6;color:#f5f5f7;white-space:pre-wrap;">${escape(n.message)}</div>
    <table style="margin-top:22px;padding-top:16px;border-top:1px solid #2a2a33;font-size:12px;line-height:1.5;">
      ${meta}
    </table>
  </div>
</div>`;
}

/** The message is user input on its way into an HTML email. */
function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
