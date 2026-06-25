"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/templates/PageHeader";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import type { Signal } from "@/types";

interface MatrixEntry {
  id: string;
  factorName: string;
  minValue?: number;
  maxValue?: number;
  points: number;
  signal: string;
  description?: string;
}

export default function ScoringPage() {
  const [matrix, setMatrix] = useState<MatrixEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rules")
      .then((r) => r.json())
      .then((data) => setMatrix(data.matrix ?? []))
      .finally(() => setLoading(false));
  }, []);

  const signalVariant = (s: string): Signal | "outline" =>
    ["red", "amber", "green"].includes(s) ? (s as Signal) : "outline";

  return (
    <div>
      <PageHeader
        title="Scoring Matrix"
        description="Point allocation rules that map factor values to red, amber, and green signals"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : matrix.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border text-muted-foreground">
          <p>Load default rules from the Rule Register to populate the scoring matrix.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matrix.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-border bg-card p-4 sm:p-5"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold">{entry.factorName}</h3>
                <Badge
                  variant={
                    signalVariant(entry.signal) === "outline"
                      ? "outline"
                      : signalVariant(entry.signal)
                  }
                >
                  {entry.points} pts
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {entry.description ??
                  `Range: ${entry.minValue ?? 0}${entry.maxValue ? ` – ${entry.maxValue}` : "+"}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
