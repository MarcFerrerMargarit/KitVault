"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Globe2, Heart, LayoutGrid, Shirt as ShirtIcon, X } from "lucide-react";
import { Brand } from "@/components/Brand";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ShirtCard } from "@/components/ShirtCard";
import { ShirtDetailModal } from "@/components/ShirtDetailModal";
import { CollectionMap } from "@/components/CollectionMap";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initialsFor } from "@/lib/profile";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";
import type { Shirt } from "@/lib/types";
import type { PublicVault as Vault } from "@/lib/public-vault";

type View = "grid" | "map";

/**
 * Someone else's collection, read-only. Every visitor is a potential collector,
 * so the way to start a vault of their own is on screen the whole time —
 * this page is where sharing turns into signups.
 */
export function PublicVault({
  vault,
  memberSince,
}: {
  vault: Vault;
  /** Pre-formatted on the server, in the visitor's language. */
  memberSince: string | null;
}) {
  const { t } = useI18n();
  const [view, setView] = React.useState<View>("grid");
  const [country, setCountry] = React.useState<{
    label: string;
    values: string[];
  } | null>(null);
  const [selected, setSelected] = React.useState<Shirt | null>(null);

  const name = vault.displayName || `@${vault.username}`;
  const shown = country
    ? vault.shirts.filter((s) => country.values.includes(s.country))
    : vault.shirts;
  const isEmpty = vault.shirts.length === 0;

  const stats: [string, number][] = [
    [t.stats.shirts, vault.stats.shirts],
    [t.stats.countries, vault.stats.countries],
    [t.stats.leagues, vault.stats.leagues],
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Brand />
          <Link href="/signup">
            <Button size="sm">
              <span className="sm:hidden">{t.publicVault.ctaShort}</span>
              <span className="hidden sm:inline">{t.publicVault.cta}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {/* Owner */}
        <section className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar
            fallback={initialsFor(vault.displayName, vault.username)}
            src={vault.avatarUrl}
            className="h-24 w-24 text-2xl sm:h-28 sm:w-28"
          />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-5xl">
              {name}
            </h1>
            <p className="mt-2 text-sm text-muted">
              @{vault.username}
              {memberSince && <span className="text-muted-2"> · {memberSince}</span>}
            </p>
            {vault.favouriteTeam && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-[3px] border border-border-strong px-2 py-1 text-xs text-ink">
                <Heart className="h-3.5 w-3.5 text-accent" />
                <span className="text-muted">{t.publicVault.favouriteTeam}:</span>
                {vault.favouriteTeam}
              </p>
            )}
            {vault.bio && (
              <p className="mt-4 max-w-prose whitespace-pre-line text-[15px] leading-relaxed text-muted">
                {vault.bio}
              </p>
            )}
          </div>
        </section>

        {/* Numbers */}
        <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border">
          {stats.map(([label, value]) => (
            <div key={label} className="bg-surface px-4 py-4 sm:px-6">
              <dt className="text-xs uppercase tracking-wide text-muted-2">{label}</dt>
              <dd className="mt-1 font-display text-3xl font-semibold tabular-nums text-ink">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Collection */}
        {isEmpty ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-[var(--radius)] border border-dashed border-border-strong bg-surface py-16 text-center">
            <ShirtIcon className="h-8 w-8 text-muted-2" />
            <p className="text-sm text-muted">{t.publicVault.empty}</p>
          </div>
        ) : (
          <section className="mt-10">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              {country && view === "grid" ? (
                <button
                  type="button"
                  onClick={() => setCountry(null)}
                  className="inline-flex items-center gap-2 rounded-[var(--radius)] border border-accent/40 bg-accent-soft px-3 py-1.5 text-sm text-accent transition-colors hover:border-accent"
                >
                  <Globe2 className="h-3.5 w-3.5" />
                  {fill(t.publicVault.filteredBy, { country: country.label })}
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <span />
              )}
              <div
                role="tablist"
                aria-label={t.collection.viewLabel}
                className="flex items-center gap-0.5 rounded-[var(--radius)] border border-border bg-surface p-0.5"
              >
                {(
                  [
                    { id: "grid", label: t.collection.viewGrid, Icon: LayoutGrid },
                    { id: "map", label: t.collection.viewMap, Icon: Globe2 },
                  ] as const
                ).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={view === id}
                    onClick={() => setView(id)}
                    className={`flex h-9 items-center gap-1.5 rounded-[3px] px-2.5 text-sm font-medium transition-colors ${
                      view === id ? "bg-surface-2 text-accent" : "text-muted hover:text-ink"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {view === "map" ? (
              <CollectionMap
                shirts={vault.shirts}
                onSelectCountry={(label, values) => {
                  setCountry({ label, values });
                  setView("grid");
                }}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {shown.map((shirt) => (
                  <ShirtCard key={shirt.id} shirt={shirt} onView={setSelected} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* The pitch, once they have seen what it does */}
        <section className="mt-16 rounded-[var(--radius)] border border-accent/25 bg-accent-soft p-6 text-center sm:p-10">
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-ink">
            {t.publicVault.pitch}
          </p>
          <Link href="/signup" className="mt-5 inline-block">
            <Button size="lg">
              {t.publicVault.cta}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
          <Brand />
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-ink">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-ink">{t.footer.terms}</Link>
            <LocaleSwitcher />
          </nav>
        </div>
      </footer>

      <ShirtDetailModal
        shirt={selected}
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </div>
  );
}
