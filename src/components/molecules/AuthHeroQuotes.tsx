"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TESTIMONIALS } from "@/lib/testimonials";

/** Time each quote stays fully visible before transitioning. */
const DISPLAY_MS = 5000;
const SLIDE_TRANSITION = { duration: 0.7, ease: [0.33, 0, 0.2, 1] as const };

export function AuthHeroQuotes() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, DISPLAY_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="relative w-full max-w-md min-h-[8.5rem] sm:min-h-[9rem]"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence initial={false}>
        <motion.blockquote
          key={index}
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, x: 28 }
          }
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
          transition={SLIDE_TRANSITION}
          className="absolute inset-0 px-2"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 font-serif text-5xl sm:text-6xl leading-none text-primary select-none"
          >
            &ldquo;
          </span>
          <p className="px-8 pt-8 pb-8 text-center text-base sm:text-lg italic leading-relaxed text-zinc-700">
            {TESTIMONIALS[index]}
          </p>
          <span
            aria-hidden
            className="pointer-events-none absolute right-0 bottom-0 font-serif text-5xl sm:text-6xl leading-none text-primary select-none"
          >
            &rdquo;
          </span>
        </motion.blockquote>
      </AnimatePresence>
    </div>
  );
}
