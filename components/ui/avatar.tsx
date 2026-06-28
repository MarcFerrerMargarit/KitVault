import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initials or short label shown inside the avatar. */
  fallback: string;
}

/** Minimal initials avatar — no image source needed for the prototype. */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, fallback, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full",
        "bg-accent-soft text-accent text-xs font-bold uppercase",
        "border border-accent/30",
        className,
      )}
      {...props}
    >
      {fallback}
    </div>
  ),
);
Avatar.displayName = "Avatar";

export { Avatar };
