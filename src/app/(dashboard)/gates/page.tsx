"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/templates/PageHeader";
import { GateResultItem } from "@/components/molecules/GateResultItem";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";

interface HardGate {
  id: string;
  name: string;
  description?: string;
  category: string;
  condition: string;
  failureMessage: string;
  severity: "critical" | "warning";
  isActive: boolean;
}

export default function GatesPage() {
  const [gates, setGates] = useState<HardGate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rules")
      .then((r) => r.json())
      .then((data) => setGates(data.gates ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Hard Gate Engine"
        description="Non-negotiable pass/fail checks that can override scoring signals"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : gates.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border text-muted-foreground">
          <p>Load default rules to configure hard gates.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {gates.map((gate) => (
            <div
              key={gate.id}
              className="rounded-xl border border-border bg-card p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <h3 className="font-semibold">{gate.name}</h3>
                <Badge variant="outline" className="capitalize">
                  {gate.category}
                </Badge>
                <Badge
                  variant={gate.severity === "critical" ? "red" : "amber"}
                >
                  {gate.severity}
                </Badge>
                <Badge variant={gate.isActive ? "green" : "secondary"}>
                  {gate.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              {gate.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {gate.description}
                </p>
              )}
              <p className="font-mono text-xs text-muted-foreground mb-3">
                {gate.condition}
              </p>
              <GateResultItem
                name={gate.name}
                passed={false}
                message={gate.failureMessage}
                severity={gate.severity}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
