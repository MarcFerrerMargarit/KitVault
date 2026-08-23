import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Styled native <select>. Native is intentional for the prototype: it is
 * accessible, keyboard-friendly and reliable across devices, while the custom
 * chrome keeps the dark KitVault look. Pass <option> children.
 */
const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  // `className` lands on the wrapper, not the <select>: the wrapper is the
  // component's root and the box a parent lays out, so callers can size it.
  <div className={cn("relative", className)}>
    <select
      ref={ref}
      className={cn(
        "h-10 w-full appearance-none rounded-[var(--radius)] border border-border bg-surface-2 pl-3 pr-9 text-sm text-ink",
        "transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
  </div>
));
Select.displayName = "Select";

export { Select };
