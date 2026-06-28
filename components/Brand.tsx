import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
  href?: string;
}

/** KitVault wordmark with an angular vault-tile mark. */
export function Brand({ className, href = "/" }: BrandProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-[var(--radius)] bg-accent">
        <span className="font-display text-lg font-bold leading-none text-bg">
          K
        </span>
        <span className="absolute inset-x-1 bottom-1 h-[2px] rounded-full bg-bg/40" />
      </span>
      <span className="font-display text-xl font-bold uppercase tracking-wide leading-none">
        <span className="text-white">Kit</span>
        <span className="text-accent">Vault</span>
      </span>
    </Link>
  );
}
