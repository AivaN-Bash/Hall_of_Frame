import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-10 w-full rounded-lg border border-[var(--hof-border)] bg-[var(--hof-card)] px-3 py-2 text-sm text-[var(--hof-text)] placeholder:text-[var(--hof-muted)] focus-visible:outline-2 focus-visible:outline-[var(--hof-accent-light)] disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
