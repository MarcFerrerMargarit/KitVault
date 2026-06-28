import Link from "next/link";
import {
  ArrowRight,
  ScanSearch,
  SlidersHorizontal,
  Users,
  ExternalLink,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "AI identification",
    body: "Snap a photo and KitVault recognises the team, season, version and manufacturer automatically — no manual data entry.",
  },
  {
    icon: SlidersHorizontal,
    title: "Filter & search",
    body: "Slice your collection by country, league, season or version in real time. Find any shirt in seconds.",
  },
  {
    icon: Users,
    title: "Multi-user collections",
    body: "Every collector gets their own private vault. Your shirts, your data — organised exactly how you want it.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <nav className="flex items-center gap-2">
            <Link href="/collection">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/collection">
              <Button variant="primary" size="sm">
                Sign up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border pitch-stripes">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            A monthly shirt, a growing collection
          </span>
          <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
            Your football shirt
            <br />
            collection,{" "}
            <span className="text-accent">finally organized</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted sm:text-lg">
            KitVault is the home for your kits. Photograph a shirt, let AI
            identify it, and build a beautifully organised archive of every
            jersey you own.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/collection">
              <Button size="lg">
                Get started free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/collection">
              <Button size="lg" variant="outline">
                View demo collection
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Built for collectors
          </h2>
          <p className="mt-3 text-muted">
            Everything you need to catalogue a serious shirt collection.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-[var(--radius)] border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <span className="absolute left-0 top-0 h-full w-1 bg-accent/0 transition-colors group-hover:bg-accent" />
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius)] bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Start your vault today
          </h2>
          <p className="max-w-xl text-muted">
            Free to start. Add your first shirt in under a minute.
          </p>
          <Link href="/collection">
            <Button size="lg">
              Get started free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Brand />
          <p className="text-xs text-muted-2">
            © {new Date().getFullYear()} KitVault. A prototype for football
            shirt collectors.
          </p>
          <a
            href="#"
            className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
          >
            <ExternalLink className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
