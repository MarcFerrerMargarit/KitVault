import Link from "next/link";
import {
  ArrowRight,
  ScanSearch,
  SlidersHorizontal,
  Share2,
} from "lucide-react";
import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { HeroBackdrop } from "@/components/landing/HeroBackdrop";
import { KitMarquee } from "@/components/landing/KitMarquee";
import { Pricing } from "@/components/landing/Pricing";
import { fetchPlans } from "@/lib/plans";

const GITHUB_URL = "https://github.com/MarcFerrerMargarit/KitVault";

/** GitHub mark — lucide dropped its brand icons, so we inline the logo. */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56v-2.2c-3.34.71-4.04-1.58-4.04-1.58-.55-1.36-1.33-1.72-1.33-1.72-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.82 0-1.29.47-2.34 1.23-3.16-.12-.3-.53-1.51.12-3.15 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 6 0c2.29-1.53 3.3-1.21 3.3-1.21.65 1.64.24 2.85.12 3.15.77.82 1.23 1.87 1.23 3.16 0 4.52-2.81 5.51-5.49 5.81.43.36.81 1.08.81 2.18v3.23c0 .31.22.68.83.56A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  );
}

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
    icon: Share2,
    title: "Share your collection",
    body: "Show off your vault. Share your collection with friends and discover the kits other collectors are hunting down.",
  },
];

/** Plans change rarely; re-read them hourly rather than on every request. */
export const revalidate = 3600;

export default async function LandingPage() {
  const plans = await fetchPlans();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />
          <nav className="flex items-center gap-2">
            <Link
              href="#pricing"
              className="mr-1 hidden text-sm text-muted transition-colors hover:text-ink sm:block"
            >
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">
                Sign up
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border pitch-stripes">
        <HeroBackdrop />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 sm:py-32">
          <span
            className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface/80 px-3 py-1 text-xs font-medium text-muted backdrop-blur-sm"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Collect &middot; Organize &middot; Share
          </span>
          <h1
            className="reveal font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl"
            style={{ animationDelay: "90ms" }}
          >
            Your football shirt
            <br />
            collection, <span className="text-accent">finally organized</span>
          </h1>
          <p
            className="reveal mt-6 max-w-2xl text-base text-muted sm:text-lg"
            style={{ animationDelay: "180ms" }}
          >
            KitVault is the home for your kits. Catalogue every shirt with AI,
            keep your archive perfectly organised, and share your collection
            with fellow collectors around the world.
          </p>
          <div
            className="reveal mt-9 flex flex-col items-center gap-3 sm:flex-row"
            style={{ animationDelay: "280ms" }}
          >
            <Link href="/signup">
              <Button size="lg">
                Get started free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Log in
              </Button>
            </Link>
          </div>
        </div>

        {/* Kit wall */}
        <div
          className="reveal relative border-t border-border bg-bg/40 py-6"
          style={{ animationDelay: "380ms" }}
        >
          <KitMarquee />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Built for collectors
          </h2>
          <p className="mt-3 text-muted">
            Everything you need to catalogue — and show off — a serious shirt
            collection.
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

      <Pricing plans={plans} />

      {/* CTA strip */}
      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Start your vault today
          </h2>
          <p className="max-w-xl text-muted">
            Free to start. Add your first shirt in under a minute.
          </p>
          <Link href="/signup">
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
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
          >
            <GithubIcon className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
