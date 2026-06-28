"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  /** The clickable trigger element. */
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}

/**
 * Minimal click-to-open menu. Closes on outside click and Escape.
 * Used for the user / logout menu in the collection header.
 */
function DropdownMenu({
  trigger,
  children,
  align = "end",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "absolute top-full z-40 mt-2 min-w-44 overflow-hidden rounded-[var(--radius)] border border-border-strong bg-surface shadow-xl animate-fade-in",
            align === "end" ? "right-0" : "left-0",
            className,
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

function DropdownMenuItem({
  className,
  destructive,
  ...props
}: DropdownItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
        destructive
          ? "text-danger hover:bg-danger-soft"
          : "text-ink hover:bg-surface-2",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-b border-border px-3 py-2 text-xs text-muted",
        className,
      )}
      {...props}
    />
  );
}

export { DropdownMenu, DropdownMenuItem, DropdownMenuLabel };
