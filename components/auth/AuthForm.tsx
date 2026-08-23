"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fill } from "@/lib/i18n/format";
import { useI18n } from "@/components/I18nProvider";
import { translateAuthError } from "@/lib/i18n/auth-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup";

interface AuthFormProps {
  mode: Mode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/collection";
  const { t } = useI18n();
  const copy = t.auth[mode];
  const altHref = mode === "login" ? "/signup" : "/login";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  // `/auth/callback` sends failures here. Seeding the error from the URL is
  // what makes a dead emailed link say so instead of looking like a no-op.
  const [error, setError] = React.useState<string | null>(() => {
    const fromCallback = searchParams.get("error");
    if (!fromCallback) return null;
    return fromCallback === "auth"
      ? t.auth.linkInvalid
      : translateAuthError(fromCallback, t);
  });
  const [checkEmail, setCheckEmail] = React.useState(false);
  const [resent, setResent] = React.useState(false);

  /** Ask Supabase to send the signup confirmation again. */
  async function handleResend() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setError(translateAuthError(error.message, t));
    else setResent(true);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(translateAuthError(error.message, t));
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) {
        setError(translateAuthError(error.message, t));
        setLoading(false);
        return;
      }
      // If email confirmation is on there is no session yet.
      if (data.session) {
        router.push(next);
        router.refresh();
      } else {
        setCheckEmail(true);
        setLoading(false);
      }
    }
  }

  if (checkEmail) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          {t.auth.checkEmail.title}
        </h1>
        <p className="text-sm text-muted">
          {fill(t.auth.checkEmail.body, { email })}
        </p>
        <p className="text-xs text-muted-2">{t.auth.checkEmail.spam}</p>

        {/* Confirmation emails do go missing; without this the only way back
            in is to sign up again with the same address. */}
        {resent ? (
          <p className="text-sm text-accent">{t.auth.checkEmail.resent}</p>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={loading}
            onClick={handleResend}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t.auth.checkEmail.resend}
          </Button>
        )}

        {error && (
          <p className="rounded-[var(--radius)] border border-danger/40 bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          {copy.title}
        </h1>
        <p className="mt-1 text-sm text-muted">{copy.subtitle}</p>
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

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <Label htmlFor="password">{t.auth.password}</Label>
          {mode === "login" && (
            <Link
              href="/forgot-password"
              className="mb-1.5 text-xs text-muted transition-colors hover:text-accent"
            >
              {t.auth.forgot}
            </Link>
          )}
        </div>
        <Input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        {copy.cta}
      </Button>

      <p className="text-center text-sm text-muted">
        {copy.altText}{" "}
        <Link
          href={altHref}
          className="font-medium text-accent hover:underline"
        >
          {copy.altLink}
        </Link>
      </p>
    </form>
  );
}
