import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-[var(--hof-border)] bg-[var(--hof-accent-deep)] px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[var(--hof-text)]",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
