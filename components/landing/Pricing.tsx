import Link from "next/link";
import { Check, Clock, Sparkles } from "lucide-react";
import { PAYMENTS_ENABLED, planPerks, type Plan } from "@/lib/plans";
import { fill } from "@/lib/i18n/format";
import { getTranslations } from "@/lib/i18n/server";
import { Button } from "@/components/ui/button";

/** Format a monthly price the way a collector expects to read it. */
function price(plan: Plan, freeLabel: string) {
  if (plan.priceMonthlyEur === 0) return freeLabel;
  return `€${plan.priceMonthlyEur.toFixed(2).replace(/\.00$/, "")}`;
}

interface PricingProps {
  plans: Plan[];
  /**
   * "landing" shows a call to action per plan. "compare" drops them — on
   * `/upgrade` the single waiting-list button below is the only action, and a
   * second one on the card would just compete with it.
   */
  variant?: "landing" | "compare";
}

/**
 * Pricing table. The numbers come from `plan_limits`, the same rows the
 * database enforces, so the marketing copy cannot promise what the app
 * refuses.
 *
 * A paid plan is dimmed while {@link PAYMENTS_ENABLED} is false: it is real,
 * it is coming, but nobody can buy it yet, and a bright "Get Pro" button that
 * leads nowhere is worse than saying so.
 */
export async function Pricing({ plans, variant = "landing" }: PricingProps) {
  const { t } = await getTranslations();
  const locked = (plan: Plan) => !PAYMENTS_ENABLED && plan.priceMonthlyEur > 0;

  // The most expensive plan is the highlighted one — but only once plans can
  // be bought. With payments closed there is nothing to recommend: promoting
  // the locked plan fights with greying it out, and promoting Free as "most
  // complete" would be a lie, since it is precisely the smaller one.
  const featuredId = PAYMENTS_ENABLED
    ? plans.reduce(
        (best, plan) =>
          plan.priceMonthlyEur > best.priceMonthlyEur ? plan : best,
        plans[0],
      )?.id
    : undefined;

  return (
    <section
      id="pricing"
      className="scroll-mt-16 border-t border-border bg-surface/40"
    >
      <div className="mx-auto w-full max-w-4xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mt-3 text-muted">{t.pricing.subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => {
            const isLocked = locked(plan);
            const featured = plan.id === featuredId;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-[var(--radius)] border p-6 ${
                  featured
                    ? "border-accent/50 bg-surface shadow-[0_0_0_1px_rgba(74,222,128,0.15)]"
                    : isLocked
                      ? "border-border bg-surface/50"
                      : "border-border bg-surface"
                }`}
              >
                {featured && (
                  <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-[3px] bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-bg">
                    <Sparkles className="h-3 w-3" />
                    {t.pricing.mostComplete}
                  </span>
                )}
                {isLocked && (
                  <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-[3px] border border-border-strong bg-surface-2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted">
                    <Clock className="h-3 w-3" />
                    {t.pricing.comingSoon}
                  </span>
                )}

                <h3
                  className={`font-display text-2xl font-bold uppercase tracking-wide ${
                    isLocked ? "text-muted" : "text-white"
                  }`}
                >
                  {plan.label}
                </h3>
                {plan.tagline && (
                  <p className="mt-1 text-sm text-muted">{plan.tagline}</p>
                )}

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span
                    className={`font-display text-4xl font-bold ${
                      isLocked ? "text-muted" : "text-white"
                    }`}
                  >
                    {price(plan, t.pricing.free)}
                  </span>
                  {plan.priceMonthlyEur > 0 && (
                    <span className="text-sm text-muted-2">
                      {t.pricing.perMonth}
                    </span>
                  )}
                </div>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {planPerks(plan, t).map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          featured ? "text-accent" : "text-muted-2"
                        }`}
                      />
                      <span className={isLocked ? "text-muted" : "text-ink"}>
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>

                {variant === "landing" && (
                  <Link
                    href={isLocked ? "/upgrade" : "/signup"}
                    className="mt-6"
                  >
                    <Button
                      variant={featured ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {isLocked
                        ? t.pricing.ctaNotify
                        : plan.priceMonthlyEur === 0
                          ? t.pricing.ctaStartFree
                          : fill(t.pricing.ctaGet, { plan: plan.label })}
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs text-muted-2">
          {PAYMENTS_ENABLED ? t.pricing.footnoteOpen : t.pricing.footnoteClosed}
        </p>
      </div>
    </section>
  );
}
