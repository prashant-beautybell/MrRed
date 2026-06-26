"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Signal } from "@/types";
import {
  SIGNAL_SEQUENCE,
  SIGNAL_STEP_MS,
} from "@/lib/signal-loader-timing";

const colors: Record<Signal, { bg: string; glow: string }> = {
  red: { bg: "var(--signal-red)", glow: "rgba(220, 38, 38, 0.85)" },
  amber: { bg: "var(--signal-amber)", glow: "rgba(245, 158, 11, 0.85)" },
  green: { bg: "var(--signal-green)", glow: "rgba(22, 163, 74, 0.85)" },
};

const sizeMap = {
  sm: { bar: "h-1.5 w-7", gap: "gap-2" },
  md: { bar: "h-2 w-11", gap: "gap-2.5" },
  lg: { bar: "h-3 w-14", gap: "gap-3" },
};

interface SignalLoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  /** Ms each signal stays active — red → amber → green */
  stepMs?: number;
  className?: string;
}

export function SignalLoader({
  size = "md",
  label,
  stepMs = SIGNAL_STEP_MS,
  className,
}: SignalLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const sizes = sizeMap[size];

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % SIGNAL_SEQUENCE.length);
    }, stepMs);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, stepMs]);

  return (
    <div
      className={cn("flex flex-col items-center gap-3", className)}
      role="status"
      aria-label={label ?? "Loading"}
    >
      <div className={cn("flex items-center", sizes.gap)}>
        {SIGNAL_SEQUENCE.map((signal, i) => {
          const isActive = activeIndex === i;
          const style = colors[signal];

          return (
            <motion.div
              key={signal}
              className={cn("rounded-full", sizes.bar)}
              style={{ backgroundColor: style.bg }}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.18,
                scale: isActive ? 1.2 : 0.88,
                boxShadow: isActive
                  ? `0 0 20px 5px ${style.glow}, 0 0 36px 10px ${style.glow.replace("0.85", "0.4")}`
                  : "0 0 0px transparent",
              }}
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
            />
          );
        })}
      </div>
      {label && (
        <p className="text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
}

interface SignalLoaderScreenProps {
  label?: string;
  stepMs?: number;
}

export function SignalLoaderScreen({
  label = "Loading signals",
  stepMs,
}: SignalLoaderScreenProps) {
  return (
    <div className="flex min-h-[50vh] lg:min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <SignalLoader size="lg" stepMs={stepMs} />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
