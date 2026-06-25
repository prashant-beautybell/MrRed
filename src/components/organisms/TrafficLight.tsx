"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SignalIcon } from "@/components/atoms/SignalIcon";
import type { Signal } from "@/types";
import { cn } from "@/lib/utils";

interface TrafficLightProps {
  activeSignal?: Signal;
  /** Cycle red → amber → green when no active signal (login/hero) */
  autoCycle?: boolean;
  className?: string;
}

const lights: Signal[] = ["red", "amber", "green"];

const signalStyles: Record<
  Signal,
  { bg: string; glow: string; glowRgb: string }
> = {
  red: {
    bg: "var(--signal-red)",
    glow: "rgba(220, 38, 38, 0.65)",
    glowRgb: "220, 38, 38",
  },
  amber: {
    bg: "var(--signal-amber)",
    glow: "rgba(245, 158, 11, 0.65)",
    glowRgb: "245, 158, 11",
  },
  green: {
    bg: "var(--signal-green)",
    glow: "rgba(22, 163, 74, 0.65)",
    glowRgb: "22, 163, 74",
  },
};

const ease = [0.4, 0, 0.2, 1] as const;

export function TrafficLight({
  activeSignal,
  autoCycle = !activeSignal,
  className,
}: TrafficLightProps) {
  const prefersReducedMotion = useReducedMotion();
  const [cycleIndex, setCycleIndex] = useState(0);

  const shouldCycle = autoCycle && !prefersReducedMotion;

  const highlighted: Signal = autoCycle
    ? lights[cycleIndex % lights.length]
    : (activeSignal ?? lights[0]);

  useEffect(() => {
    if (!shouldCycle) return;

    const interval = setInterval(() => {
      setCycleIndex((i) => (i + 1) % lights.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [shouldCycle]);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-6 sm:flex-row sm:gap-10",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {lights.map((signal) => {
          const isActive = highlighted === signal;
          return (
            <motion.div
              key={signal}
              className="flex items-center gap-3"
              animate={{
                opacity: isActive ? 1 : 0.45,
                scale: isActive ? 1 : 0.96,
                x: isActive ? 4 : 0,
              }}
              transition={{ duration: 0.55, ease }}
            >
              <SignalIcon signal={signal} size="md" showLabel />
            </motion.div>
          );
        })}
      </div>

      <div className="flex w-14 h-40 sm:w-16 sm:h-48 bg-foreground rounded-2xl p-2 flex-col gap-2 shadow-lg">
        {lights.map((signal) => {
          const isActive = highlighted === signal;
          const style = signalStyles[signal];

          return (
            <motion.div
              key={signal}
              className="flex-1 rounded-full"
              style={{ backgroundColor: style.bg }}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0.3,
                scale: isActive ? 1.04 : 0.94,
                boxShadow: isActive
                  ? `0 0 22px 6px ${style.glow}, 0 0 40px 12px rgba(${style.glowRgb}, 0.25), inset 0 2px 8px rgba(255,255,255,0.35)`
                  : `0 0 0px transparent, inset 0 1px 4px rgba(0,0,0,0.2)`,
              }}
              transition={{
                duration: 0.65,
                ease,
                opacity: { duration: 0.5 },
                boxShadow: { duration: 0.7 },
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
