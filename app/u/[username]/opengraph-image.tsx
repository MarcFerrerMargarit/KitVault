import { ImageResponse } from "next/og";
import { fetchPublicVault } from "@/lib/public-vault";
import { getTranslations } from "@/lib/i18n/server";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "KitVault";

/*
 * Drawn by Satori, which supports a subset of CSS: every element with more
 * than one child — text fragments included — needs `display: flex`. Text is
 * therefore built with template strings, so each element holds one node.
 */

/**
 * The card a link preview shows — WhatsApp, X, iMessage. A shared vault is the
 * product's best advert, and a blank preview wastes it. Drawn from data rather
 * than a screenshot, in the app's own colours; the shirts are the owner's
 * latest, so every card is different.
 */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [vault, { t }] = await Promise.all([
    fetchPublicVault(username),
    getTranslations(),
  ]);

  const name = vault ? vault.displayName || `@${vault.username}` : "KitVault";
  const photos = (vault?.shirts ?? [])
    .map((s) => s.thumbUrl ?? s.imageUrl)
    .filter((u): u is string => Boolean(u))
    .slice(0, 4);
  const stats = vault
    ? [
        [vault.stats.shirts, t.stats.shirts],
        [vault.stats.countries, t.stats.countries],
        [vault.stats.leagues, t.stats.leagues],
      ]
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0d0d0f",
          color: "#f5f5f7",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 30, fontWeight: 800, letterSpacing: 4 }}>
            <span>KIT</span>
            <span style={{ color: "#4ade80" }}>VAULT</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {vault?.avatarUrl && (
                <img
                  src={vault.avatarUrl}
                  width={104}
                  height={104}
                  alt=""
                  style={{ borderRadius: 999, border: "3px solid #4ade80", objectFit: "cover" }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontSize: name.length > 18 ? 60 : 76, fontWeight: 800, textTransform: "uppercase", lineHeight: 1 }}>
                  {name}
                </div>
                {vault && (
                  <div style={{ display: "flex", fontSize: 30, color: "#8a8a96", marginTop: 10 }}>
                    {`@${vault.username}`}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 48, marginTop: 44 }}>
              {stats.map(([value, label]) => (
                <div key={String(label)} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", fontSize: 64, fontWeight: 800, color: "#4ade80", lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ display: "flex", fontSize: 22, color: "#8a8a96", textTransform: "uppercase", letterSpacing: 2, marginTop: 6 }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", fontSize: 24, color: "#5f5f6b" }}>
            {`kitvault.dev/u/${vault?.username ?? username}`}
          </div>
        </div>

        {photos.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", width: 420, gap: 12, alignContent: "center", marginLeft: 40 }}>
            {photos.map((src) => (
              <img
                key={src}
                src={src}
                width={204}
                height={240}
                alt=""
                style={{ objectFit: "cover", borderRadius: 6, border: "1px solid #2a2a33" }}
              />
            ))}
          </div>
        )}
      </div>
    ),
    size,
  );
}
