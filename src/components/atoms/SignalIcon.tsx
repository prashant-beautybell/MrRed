import { cn } from "@/lib/utils";
import type { Signal } from "@/types";
import { Octagon, Check, ArrowRight } from "lucide-react";

const signalConfig: Record<
  Signal,
  { bg: string; text: string; icon: typeof Octagon; label: string }
> = {
  red: {
    bg: "bg-signal-red-bg",
    text: "text-signal-red",
    icon: Octagon,
    label: "Stop",
  },
  amber: {
    bg: "bg-signal-amber-bg",
    text: "text-signal-amber",
    icon: Check,
    label: "Check",
  },
  green: {
    bg: "bg-signal-green-bg",
    text: "text-signal-green",
    icon: ArrowRight,
    label: "Go",
  },
};

interface SignalIconProps {
  signal: Signal;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: "h-8 w-8", icon: 14 },
  md: { container: "h-12 w-12", icon: 20 },
  lg: { container: "h-16 w-16", icon: 28 },
};

export function SignalIcon({
  signal,
  size = "md",
  showLabel = false,
  className,
}: SignalIconProps) {
  const config = signalConfig[signal];
  const Icon = config.icon;
  const sizes = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full",
          config.bg,
          sizes.container
        )}
      >
        <Icon
          className={config.text}
          size={sizes.icon}
          strokeWidth={2.5}
        />
      </div>
      {showLabel && (
        <span className={cn("font-semibold capitalize", config.text)}>
          {config.label}
        </span>
      )}
    </div>
  );
}
