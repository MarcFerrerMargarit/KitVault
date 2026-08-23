"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Request a password reset link.
 *
 * The link lands on `/auth/callback`, which exchanges the code for a session
 * and forwards to `/update-password` — without that `next`, the user would be
 * silently signed in and never asked for a new password.
 */
export function ForgotPasswordForm() {
  const { t } = useI18n();
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        "/update-password",
      )}`,
    });

    // Deliberately not reporting whether the address exists: that would turn
    // this form into a way to check who has an account here.
    if (error && !/rate|limit|many/i.test(error.message)) {
      setSent(true);
      setLoading(false);
      return;
    }
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          {t.forgotPassword.sentTitle}
        </h1>
        <p className="text-sm text-muted">
          {fill(t.forgotPassword.sentBody, { email })}
        </p>
        <Link
          href="/login"
          className="mt-2 text-sm font-medium text-accent hover:underline"
        >
          {t.forgotPassword.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          {t.forgotPassword.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{t.forgotPassword.subtitle}</p>
      </div>

      <div>
        <Label htmlFor="email">{t.auth.email}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.auth.emailPlaceholder}
        />
      </div>

      {error && (
        <p className="rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={loading} className="mt-1">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {t.forgotPassword.cta}
      </Button>

      <p className="text-center text-sm text-muted">
        {t.forgotPassword.remembered}{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          {t.forgotPassword.login}
        </Link>
      </p>
    </form>
  );
}
