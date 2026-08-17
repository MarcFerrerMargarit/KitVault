"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup";

interface AuthFormProps {
  mode: Mode;
}

const COPY: Record<
  Mode,
  {
    title: string;
    cta: string;
    altText: string;
    altHref: string;
    altLink: string;
  }
> = {
  login: {
    title: "Welcome back",
    cta: "Log in",
    altText: "Don't have an account?",
    altHref: "/signup",
    altLink: "Sign up",
  },
  signup: {
    title: "Create your vault",
    cta: "Sign up",
    altText: "Already have an account?",
    altHref: "/login",
    altLink: "Log in",
  },
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/collection";
  const copy = COPY[mode];

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  // `/auth/callback` sends failures here. Seeding the error from the URL is
  // what makes a dead emailed link say so instead of looking like a no-op.
  const [error, setError] = React.useState<string | null>(() => {
    const fromCallback = searchParams.get("error");
    if (!fromCallback) return null;
    return fromCallback === "auth"
      ? "That link is no longer valid. Request a new one below."
      : fromCallback;
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
    if (error) setError(error.message);
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
        setError(error.message);
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
        setError(error.message);
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
          Check your email
        </h1>
        <p className="text-sm text-muted">
          We sent a confirmation link to{" "}
          <span className="text-ink">{email}</span>. Click it to activate your
          vault.
        </p>
        <p className="text-xs text-muted-2">
          Nothing after a minute or two? Check your spam folder.
        </p>

        {/* Confirmation emails do go missing; without this the only way back
            in is to sign up again with the same address. */}
        {resent ? (
          <p className="text-sm text-accent">Sent again — have another look.</p>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={loading}
            onClick={handleResend}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Resend the email
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
        <p className="mt-1 text-sm text-muted">
          {mode === "login"
            ? "Log in to reach your collection."
            : "Start cataloguing your shirts in seconds."}
        </p>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <Label htmlFor="password">Password</Label>
          {mode === "login" && (
            <Link
              href="/forgot-password"
              className="mb-1.5 text-xs text-muted transition-colors hover:text-accent"
            >
              Forgot it?
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
          href={copy.altHref}
          className="font-medium text-accent hover:underline"
        >
          {copy.altLink}
        </Link>
      </p>
    </form>
  );
}
