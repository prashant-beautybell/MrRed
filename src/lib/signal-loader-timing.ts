import type { Signal } from "@/types";

export const SIGNAL_SEQUENCE: Signal[] = ["red", "amber", "green"];

/** Fast step for initial load & analysis (ms per signal) */
export const SIGNAL_STEP_MS_FAST = 220;

/** Default step for inline/button loaders */
export const SIGNAL_STEP_MS = 320;

export function signalLoaderDurationMs(
  cycles: number,
  stepMs = SIGNAL_STEP_MS_FAST
): number {
  return cycles * SIGNAL_SEQUENCE.length * stepMs + 200;
}
