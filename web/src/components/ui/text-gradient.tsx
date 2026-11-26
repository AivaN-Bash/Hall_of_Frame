import * as React from "react";
import { motion, type Transition } from "motion/react";
import type { JSX } from "react";
import { cn } from "@/lib/utils";

export type TextGradientProps = {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  colors?: string[];
  duration?: number;
  angle?: number;
  transition?: Transition;
};

export function TextGradient({
  children,
  as: Component = "span",
  className,
  colors = ["#e6e4dd", "#e0a82e", "#f5c518", "#8c6d23", "#e6e4dd"],
  duration = 6,
  angle = 135,
  transition,
}: TextGradientProps) {
  const MotionComponent = React.useMemo(
    () => motion.create(Component as keyof JSX.IntrinsicElements),
    [Component],
  );
  const gradientSize = colors.length * 100;

  return (
    <MotionComponent
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${[...colors, ...colors].join(", ")})`,
        backgroundSize: `${gradientSize}% 100%`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      transition={{
        duration,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
        ...transition,
      }}
    >
      {children}
    </MotionComponent>
  );
}

export default TextGradient;
