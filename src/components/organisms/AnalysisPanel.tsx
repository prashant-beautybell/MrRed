import { SignalBadge } from "@/components/molecules/SignalBadge";
import { FactorScoreRow } from "@/components/molecules/FactorScoreRow";
import { GateResultItem } from "@/components/molecules/GateResultItem";
import type { AnalysisResult } from "@/types";
import { cn } from "@/lib/utils";

interface AnalysisPanelProps {
  result: AnalysisResult;
  className?: string;
}

export function AnalysisPanel({ result, className }: AnalysisPanelProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Overall Signal
            </p>
            <SignalBadge signal={result.overallSignal} size="lg" />
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">
              {result.scorePercentage.toFixed(0)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {result.totalScore.toFixed(1)} / {result.maxScore.toFixed(1)} pts
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed border-t border-border pt-4">
          {result.recommendation}
        </p>
      </div>

      {result.gateResults.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Hard Gate Engine</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {result.gateResults.map((gate) => (
              <GateResultItem key={gate.gateId} {...gate} />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
        <h3 className="font-semibold mb-2">Scoring Matrix</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Factor-by-factor breakdown
        </p>
        {result.factorScores.map((factor) => (
          <FactorScoreRow key={factor.factorId} {...factor} />
        ))}
      </div>
    </div>
  );
}
