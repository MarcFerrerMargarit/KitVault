import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { planPerks, type Plan } from "@/lib/plans";
import { Button } from "@/components/ui/button";

/** Format a monthly price the way a collector expects to read it. */
function price(plan: Plan) {
  if (plan.priceMonthlyEur === 0) return "Free";
  return `€${plan.priceMonthlyEur.toFixed(2).replace(/\.00$/, "")}`;
}

/**
 * Pricing table. The numbers come from `plan_limits`, the same rows the
 * database enforces, so the marketing copy cannot promise what the app
 * refuses.
 */
export function Pricing({ plans }: { plans: Plan[] }) {
  // The most expensive plan is the highlighted one.
  const featuredId = plans.reduce(
    (best, plan) => (plan.priceMonthlyEur > best.priceMonthlyEur ? plan : best),
    plans[0],
  )?.id;

  return (
    <section
      id="pricing"
      className="border-t border-border bg-surface/40 scroll-mt-16"
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-3 text-muted">
            Start free. Upgrade when your collection outgrows it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => {
            const featured = plan.id === featuredId;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-[var(--radius)] border bg-surface p-6 ${
                  featured
                    ? "border-accent/50 shadow-[0_0_0_1px_rgba(74,222,128,0.15)]"
                    : "border-border"
                }`}
              >
                {featured && (
                  <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-[3px] bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-bg">
                    <Sparkles className="h-3 w-3" />
                    Most complete
                  </span>
                )}

                <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
                  {plan.label}
                </h3>
                {plan.tagline && (
                  <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
                )}

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold text-white">
                    {price(plan)}
                  </span>
                  {plan.priceMonthlyEur > 0 && (
                    <span className="text-sm text-muted">/ month</span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {planPerks(plan).map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          featured ? "text-accent" : "text-muted-2"
                        }`}
                      />
                      <span className="text-ink">{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="mt-6">
                  <Button
                    variant={featured ? "primary" : "secondary"}
                    className="w-full"
                  >
                    {plan.priceMonthlyEur === 0
                      ? "Start free"
                      : `Get ${plan.label}`}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted-2">
          Every plan starts on Free — upgrading is a one-click change once
          payments are live.
        </p>
      </div>
    </section>
  );
}
