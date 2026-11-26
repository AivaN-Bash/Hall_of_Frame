"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * RandomLetterSwap: a text label whose letters swap out on hover.
 *
 * Each letter sits in its own clipped slot. On hover the current letter
 * slides up and out while a random letter slides in from below, one letter
 * after another (`staggerDuration` seconds apart). On leave the original
 * letters roll back in.
 *
 * Usage (matches the nav reference):
 *   <RandomLetterSwap
 *     label="Home"
 *     className="cursor-pointer font-medium text-sm"
 *     staggerDuration={0.025}
 *     transition={{ duration: 0.6, type: "spring" }}
 *   />
 *
 * Needs: `motion` (npm i motion) and the shadcn `cn` helper at "@/lib/utils".
 * Wrap it in a <Link> or <a> for navigation; the visible letters are hidden
 * from screen readers and the full label is exposed once via aria-label.
 */

export interface RandomLetterSwapProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "children"> {
  /** The text to show. */
  label: string;
  /** Seconds between one letter starting and the next. */
  staggerDuration?: number;
  /** Motion transition for each letter. */
  transition?: Transition;
  /** Characters the replacement letters are drawn from. */
  alphabet?: string;
}

const DEFAULT_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function pickLetters(label: string, alphabet: string): string[] {
  return Array.from(label).map((ch) => {
    if (ch === " ") return " ";
    let next = ch;
    // never swap a letter for itself
    for (let tries = 0; tries < 5 && next === ch; tries++) {
      next = alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return next;
  });
}

export function RandomLetterSwap({
  label,
  staggerDuration = 0.025,
  transition = { duration: 0.6, type: "spring" },
  alphabet = DEFAULT_ALPHABET,
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: RandomLetterSwapProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState(false);
  const [swaps, setSwaps] = React.useState<string[]>(() => Array.from(label));

  const chars = React.useMemo(() => Array.from(label), [label]);

  const start = () => {
    if (reduced) return;
    // fresh random letters on every hover
    setSwaps(pickLetters(label, alphabet));
    setActive(true);
  };
  const stop = () => setActive(false);

  return (
    <span
      {...rest}
      aria-label={label}
      className={cn("inline-flex whitespace-pre", className)}
      onBlur={(e) => {
        stop();
        onBlur?.(e);
      }}
      onFocus={(e) => {
        start();
        onFocus?.(e);
      }}
      onMouseEnter={(e) => {
        start();
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        stop();
        onMouseLeave?.(e);
      }}
    >
      {chars.map((ch, i) => {
        const t: Transition = {
          ...transition,
          delay: i * staggerDuration,
        };
        return (
          <span
            aria-hidden="true"
            className="relative inline-block overflow-hidden"
            // a little vertical room so descenders aren't clipped
            style={{ paddingBottom: "0.12em", marginBottom: "-0.12em" }}
            key={i}
          >
            <motion.span
              animate={{ y: active ? "-110%" : "0%" }}
              className="inline-block"
              initial={false}
              transition={t}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
            <motion.span
              animate={{ y: active ? "0%" : "110%" }}
              className="absolute inset-x-0 top-0 inline-block"
              initial={false}
              transition={t}
            >
              {(swaps[i] ?? ch) === " " ? "\u00A0" : (swaps[i] ?? ch)}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

export default RandomLetterSwap;
