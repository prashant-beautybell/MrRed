import { SignalIcon } from "@/components/atoms/SignalIcon";
import type { Signal } from "@/types";
import { cn } from "@/lib/utils";

interface FactorScoreRowProps {
  name: string;
  category: string;
  score: number;
  maxScore: number;
  signal: Signal;
  weight?: number;
}

export function FactorScoreRow({
  name,
  category,
  score,
  maxScore,
  signal,
  weight,
}: FactorScoreRowProps) {
  const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <SignalIcon signal={signal} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium truncate">{name}</p>
          <span className="text-sm font-semibold shrink-0">
            {score}/{maxScore}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                signal === "green" && "bg-signal-green",
                signal === "amber" && "bg-signal-amber",
                signal === "red" && "bg-signal-red"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground capitalize shrink-0">
            {category}
            {weight && weight !== 1 ? ` · ${weight}x` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
