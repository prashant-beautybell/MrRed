"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/templates/PageHeader";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";

interface Rule {
  id: string;
  name: string;
  description?: string;
  category: string;
  ruleType: string;
  condition: string;
  weight: number;
  maxPoints: number;
  isActive: boolean;
  version: number;
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rules")
      .then((r) => r.json())
      .then((data) => setRules(data.rules ?? []))
      .finally(() => setLoading(false));
  }, []);

  const seedRules = async () => {
    await fetch("/api/seed", { method: "POST" });
    const res = await fetch("/api/rules");
    const data = await res.json();
    setRules(data.rules ?? []);
  };

  return (
    <div>
      <PageHeader
        title="Rule Register"
        description="Configurable rules that drive deal scoring and gate evaluation"
        actions={
          rules.length === 0 ? (
            <Button onClick={seedRules}>Load Default Rules</Button>
          ) : undefined
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground mb-4">
            No rules configured. Load the default rule set to get started.
          </p>
          <Button onClick={seedRules}>Load Default Rules</Button>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium">Rule</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Type</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Condition</th>
                  <th className="text-left p-4 font-medium">Weight</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <p className="font-medium">{rule.name}</p>
                      {rule.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {rule.description}
                        </p>
                      )}
                    </td>
                    <td className="p-4 hidden sm:table-cell capitalize">
                      {rule.category}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge variant="outline">
                        {rule.ruleType.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell font-mono text-xs text-muted-foreground">
                      {rule.condition}
                    </td>
                    <td className="p-4">{rule.weight}x</td>
                    <td className="p-4">
                      <Badge variant={rule.isActive ? "green" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
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
