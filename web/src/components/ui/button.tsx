import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold cursor-pointer select-none",
    "transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
    "hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] active:duration-75",
    "outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--hof-accent-light)]/75",
    "disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
    "motion-reduce:transform-none motion-reduce:transition-colors",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[var(--hof-accent-light)] text-[var(--hof-shadow)] shadow-[inset_0_1px_0_rgba(255,255,255,0.38),0_4px_14px_-4px_rgba(224,168,46,0.35)] hover:bg-[var(--hof-text)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_20px_-4px_rgba(230,228,221,0.28)]",
        secondary:
          "bg-[var(--hof-card)] text-[var(--hof-text)] border border-[var(--hof-border)] shadow-[inset_0_1px_0_rgba(230,228,221,0.08),0_2px_8px_-2px_rgba(0,0,0,0.45)] hover:bg-[var(--hof-accent-deep)] hover:border-[var(--hof-accent-light)]/45 hover:shadow-[inset_0_1px_0_rgba(230,228,221,0.16),0_6px_16px_-4px_rgba(0,0,0,0.55)]",
        outline:
          "border border-[var(--hof-border)] bg-transparent text-[var(--hof-text)] shadow-[0_1px_2px_rgba(0,0,0,0.25)] hover:bg-[var(--hof-card)] hover:border-[var(--hof-accent-light)]/50 hover:shadow-[inset_0_1px_0_rgba(230,228,221,0.1),0_4px_12px_-4px_rgba(0,0,0,0.45)]",
        ghost:
          "bg-transparent text-[var(--hof-muted)] hover:bg-[var(--hof-card)] hover:text-[var(--hof-text)]",
        danger:
          "bg-[var(--hof-danger-bg)] border border-[var(--danger)] text-[var(--hof-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_10px_-3px_rgba(0,0,0,0.5)] hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_6px_16px_-4px_rgba(0,0,0,0.6)]",
        link: "text-[var(--hof-accent-light)] underline-offset-4 hover:underline hover:translate-y-0 active:scale-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-lg px-6",
        icon: "h-9 w-9",
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement<{ className?: string }>(children)) {
      return React.cloneElement(children, {
        ...props,
        className: cn(classes, children.props.className),
      } as React.HTMLAttributes<HTMLElement>);
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
export default Button;
