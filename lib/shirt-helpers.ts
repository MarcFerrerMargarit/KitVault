import type { Shirt, ShirtVersion } from "./types";

/** Tailwind classes for the version badge — a distinct color per version. */
export const VERSION_BADGE: Record<ShirtVersion, string> = {
  Home: "bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/40",
  Away: "bg-[#60a5fa]/15 text-[#60a5fa] border-[#60a5fa]/40",
  Third: "bg-[#c084fc]/15 text-[#c084fc] border-[#c084fc]/40",
  GK: "bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/40",
};

/**
 * Build the placeholder gradient for a shirt that has no real photo yet,
 * derived from the team colors so each card still feels distinct.
 */
export function placeholderGradient(shirt: Shirt): string {
  const from = shirt.teamColor;
  const to = shirt.secondaryColor ?? "#0d0d0f";
  return `linear-gradient(145deg, ${from} 0%, ${from} 45%, ${to} 100%)`;
}

/** Confidence buckets drive the color of the AI confidence indicator. */
export function confidenceTone(confidence: number): {
  label: string;
  className: string;
} {
  if (confidence >= 85) return { label: "High", className: "text-accent" };
  if (confidence >= 70) return { label: "Medium", className: "text-[#fbbf24]" };
  return { label: "Low", className: "text-[#f97316]" };
}
