import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--hof-accent-light)] text-[var(--hof-shadow)] hover:bg-[var(--hof-text)]",
        secondary:
          "bg-[var(--hof-card)] text-[var(--hof-text)] border border-[var(--hof-border)] hover:bg-[var(--hof-accent-deep)]",
        outline:
          "border border-[var(--hof-border)] bg-transparent text-[var(--hof-text)] hover:bg-[var(--hof-card)]",
        ghost:
          "bg-transparent text-[var(--hof-muted)] hover:bg-[var(--hof-card)] hover:text-[var(--hof-text)]",
        danger:
          "bg-[var(--hof-danger-bg)] border border-[var(--danger)] text-[var(--hof-text)] hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";
