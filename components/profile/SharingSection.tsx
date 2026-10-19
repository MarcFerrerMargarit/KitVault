"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, ExternalLink, Globe2, Loader2, Lock } from "lucide-react";
import { updateSharing } from "@/app/profile/actions";
import {
  normaliseUsername,
  usernameProblem,
  vaultPath,
} from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/I18nProvider";

interface SharingSectionProps {
  username: string | null;
  isPublic: boolean;
}

/** The origin never changes during a page's life, so nothing to subscribe to. */
const noSubscribe = () => () => {};

/** Choose the public address and switch the vault on or off. */
export function SharingSection(props: SharingSectionProps) {
  const { t } = useI18n();
  const router = useRouter();

  const [username, setUsername] = React.useState(props.username ?? "");
  const [isPublic, setIsPublic] = React.useState(props.isPublic);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // The origin is only known in the browser: empty during server rendering,
  // then the real one — without an effect, and without a hydration mismatch.
  const origin = React.useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => "",
  );

  const normalised = normaliseUsername(username);
  const problem = normalised ? usernameProblem(normalised) : null;
  const dirty =
    normalised !== (props.username ?? "") || isPublic !== props.isPublic;

  // The link only works once it is saved and switched on.
  const live = props.isPublic && props.username;
  const link = live ? `${origin}${vaultPath(props.username!)}` : null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !dirty) return;
    setSaving(true);
    setError(null);
    const res = await updateSharing({ username, isPublic });
    setSaving(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    setUsername(res.username ?? "");
    setSaved(true);
    router.refresh();
  }

  async function handleCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be refused (permissions, insecure context); the link is
      // on screen to copy by hand.
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <p className="max-w-prose text-sm text-muted">{t.sharing.description}</p>

      <div>
        <Label htmlFor="sharing-username">{t.sharing.usernameLabel}</Label>
        <div className="flex items-stretch overflow-hidden rounded-[var(--radius)] border border-border bg-surface-2 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/40">
          <span className="flex items-center border-r border-border px-3 text-sm text-muted-2">
            kitvault.dev/u/
          </span>
          <Input
            id="sharing-username"
            value={username}
            maxLength={24}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="marc"
            className="rounded-none border-0 bg-transparent focus-visible:ring-0"
            onChange={(e) => {
              setUsername(e.target.value);
              setSaved(false);
              setError(null);
            }}
          />
        </div>
        <p
          className={cn(
            "mt-1.5 text-xs",
            problem ? "text-warning" : "text-muted-2",
          )}
        >
          {problem === "reserved"
            ? t.sharing.errors.reserved
            : problem === "format"
              ? t.sharing.errors.format
              : t.sharing.usernameHint}
        </p>
      </div>

      {/* A switch, not a checkbox: it changes who can see the collection. */}
      <button
        type="button"
        role="switch"
        aria-checked={isPublic}
        onClick={() => {
          setIsPublic((v) => !v);
          setSaved(false);
          setError(null);
        }}
        className="flex w-full items-center gap-3 rounded-[var(--radius)] border border-border bg-surface-2 p-3 text-left transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <span
          className={cn(
            "relative h-5 w-9 shrink-0 rounded-full transition-colors",
            isPublic ? "bg-accent" : "bg-border-strong",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 h-4 w-4 rounded-full bg-bg transition-transform",
              isPublic ? "translate-x-[18px]" : "translate-x-0.5",
            )}
          />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-medium text-ink">
            {t.sharing.toggleLabel}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            {isPublic ? (
              <Globe2 className="h-3.5 w-3.5" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
            {isPublic ? t.sharing.toggleOn : t.sharing.toggleOff}
          </span>
        </span>
      </button>

      {isPublic && (
        <p className="text-xs text-muted-2">{t.sharing.notIndexed}</p>
      )}

      {error && (
        <p className="rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={!dirty || saving || Boolean(problem)}>
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? t.sharing.saving : t.sharing.save}
        </Button>
        {saved && !dirty && (
          <span className="inline-flex items-center gap-1.5 text-sm text-accent">
            <Check className="h-4 w-4" />
            {t.sharing.saved}
          </span>
        )}
      </div>

      {link && !dirty && (
        <div className="flex flex-col gap-2 rounded-[var(--radius)] border border-accent/25 bg-accent-soft p-3 sm:flex-row sm:items-center">
          <span className="min-w-0 flex-1 truncate font-mono text-sm text-accent">
            {link}
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? t.sharing.copied : t.sharing.copy}
            </Button>
            <a href={vaultPath(props.username!)} target="_blank" rel="noopener">
              <Button type="button" variant="secondary" size="sm">
                <ExternalLink className="h-4 w-4" />
                {t.sharing.view}
              </Button>
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
