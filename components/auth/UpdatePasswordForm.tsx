"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MIN_LENGTH = 6;

/**
 * Set a new password after following a recovery link.
 *
 * Reaching this page means `/auth/callback` already traded the link's code for
 * a session, so `updateUser` is authenticated. If it did not — an expired or
 * reused link — there is no session and we say so rather than failing on save.
 */
export function UpdatePasswordForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  const [checking, setChecking] = React.useState(true);
  const [hasSession, setHasSession] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();
    let settled = false;
    let timer: ReturnType<typeof setTimeout>;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      setHasSession(ok);
      setChecking(false);
    };

    // In the implicit flow the session arrives from the URL fragment, which the
    // browser client parses after mount — so watch for it rather than deciding
    // on the first read that the link is dead.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) finish(true);
    });

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) finish(true);
      else timer = setTimeout(() => finish(false), 2000);
    });

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError(t.updatePassword.mismatch);
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    router.refresh();
  }

  if (checking) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          {t.updatePassword.expiredTitle}
        </h1>
        <p className="text-sm text-muted">{t.updatePassword.expiredBody}</p>
        <Link
          href="/forgot-password"
          className="mt-2 text-sm font-medium text-accent hover:underline"
        >
          {t.updatePassword.sendNew}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          {t.updatePassword.doneTitle}
        </h1>
        <p className="text-sm text-muted">{t.updatePassword.doneBody}</p>
        <Link href="/collection" className="mt-2">
          <Button size="lg">{t.updatePassword.goToCollection}</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          {t.updatePassword.title}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {fill(t.updatePassword.subtitle, { min: MIN_LENGTH })}
        </p>
      </div>

      <div>
        <Label htmlFor="password">{t.updatePassword.newPassword}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div>
        <Label htmlFor="confirm">{t.updatePassword.repeat}</Label>
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_LENGTH}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-1">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {t.updatePassword.cta}
      </Button>
    </form>
  );
}
