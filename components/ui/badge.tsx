import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[3px] border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide leading-none",
  {
    variants: {
      variant: {
        neutral: "border-border-strong bg-surface-2 text-muted",
        accent: "border-accent/40 bg-accent-soft text-accent",
        outline: "border-border-strong bg-transparent text-muted",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
