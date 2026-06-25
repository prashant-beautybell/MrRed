import { SignalIcon } from "@/components/atoms/SignalIcon";
import { Badge } from "@/components/atoms/Badge";
import type { Signal } from "@/types";
import { cn } from "@/lib/utils";

interface SignalBadgeProps {
  signal: Signal;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const labels: Record<Signal, string> = {
  red: "Red — Stop",
  amber: "Amber — Check",
  green: "Green — Go",
};

export function SignalBadge({
  signal,
  size = "sm",
  showIcon = true,
  className,
}: SignalBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showIcon && <SignalIcon signal={signal} size={size} />}
      <Badge variant={signal}>{labels[signal]}</Badge>
    </div>
  );
}
