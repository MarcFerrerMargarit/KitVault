import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initials shown when there is no photo, or while it loads. */
  fallback: string;
  /** Profile photo URL. Signed and short-lived, so never cached by Next. */
  src?: string | null;
}

/** Round avatar: the profile photo when there is one, initials otherwise. */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, fallback, src, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex h-9 w-9 shrink-0 select-none items-center justify-center overflow-hidden rounded-full",
        "bg-accent-soft text-accent text-xs font-bold uppercase",
        "border border-accent/30",
        className,
      )}
      {...props}
    >
      {fallback}
      {src && (
        // A plain <img>: the URL is a signed link that changes every load, so
        // the image optimiser would only cache copies nobody asks for again.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  ),
);
Avatar.displayName = "Avatar";

export { Avatar };
