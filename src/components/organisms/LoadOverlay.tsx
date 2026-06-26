"use client";

import { useEffect, useState } from "react";
import { SignalLoader } from "@/components/atoms/SignalLoader";
import {
  SIGNAL_STEP_MS_FAST,
  signalLoaderDurationMs,
} from "@/lib/signal-loader-timing";

interface InitialLoadOverlayProps {
  label?: string;
  sessionKey?: string;
}

export function InitialLoadOverlay({
  label = "Loading Mr. Red",
  sessionKey,
}: InitialLoadOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionKey && sessionStorage.getItem(sessionKey)) return;

    setVisible(true);
    const duration = signalLoaderDurationMs(1, SIGNAL_STEP_MS_FAST);

    const timeout = setTimeout(() => {
      if (sessionKey) sessionStorage.setItem(sessionKey, "1");
      setVisible(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [sessionKey]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-white/95 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <SignalLoader size="lg" stepMs={SIGNAL_STEP_MS_FAST} />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

interface AnalyzingOverlayProps {
  active: boolean;
  label?: string;
}

export function AnalyzingOverlay({
  active,
  label = "Mr. Red is analyzing signals",
}: AnalyzingOverlayProps) {
  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-white/92 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-label="Analyzing"
    >
      <SignalLoader size="lg" stepMs={SIGNAL_STEP_MS_FAST} />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
