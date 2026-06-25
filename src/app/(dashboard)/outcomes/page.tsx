"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/templates/PageHeader";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { format } from "date-fns";
import type { Signal } from "@/types";

interface Outcome {
  id: string;
  dealName?: string;
  companyName?: string;
  predictedSignal: Signal;
  actualOutcome: string;
  wasCorrect?: boolean;
  finalValue?: number;
  roi?: number;
  notes?: string;
  recordedAt: string;
  recordedByName?: string;
}

export default function OutcomesPage() {
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/outcomes")
      .then((r) => r.json())
      .then(setOutcomes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Outcome Ledger"
        description="Track predicted signals against actual deal outcomes to improve accuracy"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : outcomes.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border text-muted-foreground">
          <p>
            No outcomes recorded yet. Close deals and log results to build your
            outcome ledger.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium">Deal</th>
                  <th className="text-left p-4 font-medium">Predicted</th>
                  <th className="text-left p-4 font-medium">Actual</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Correct</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">ROI</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {outcomes.map((outcome) => (
                  <tr
                    key={outcome.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="p-4">
                      <p className="font-medium">{outcome.dealName}</p>
                      <p className="text-xs text-muted-foreground">
                        {outcome.companyName}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant={outcome.predictedSignal}>
                        {outcome.predictedSignal}
                      </Badge>
                    </td>
                    <td className="p-4 capitalize">{outcome.actualOutcome}</td>
                    <td className="p-4 hidden sm:table-cell">
                      {outcome.wasCorrect !== null &&
                      outcome.wasCorrect !== undefined ? (
                        <Badge
                          variant={outcome.wasCorrect ? "green" : "red"}
                        >
                          {outcome.wasCorrect ? "Yes" : "No"}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {outcome.roi !== null && outcome.roi !== undefined
                        ? `${outcome.roi.toFixed(1)}%`
                        : "—"}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground">
                      {format(new Date(outcome.recordedAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
