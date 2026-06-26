"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/templates/PageHeader";
import { AnalysisPanel } from "@/components/organisms/AnalysisPanel";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/atoms/Label";
import { Spinner } from "@/components/atoms/Spinner";
import { AnalyzingOverlay } from "@/components/organisms/LoadOverlay";
import { Badge } from "@/components/atoms/Badge";
import { SignalBadge } from "@/components/molecules/SignalBadge";
import type { AnalysisResult, Signal } from "@/types";
import Link from "next/link";

interface Deal {
  id: string;
  name: string;
  companyName: string;
  industry?: string;
  dealValue?: number;
  status: string;
  overallSignal?: Signal;
  analysisData?: AnalysisResult;
}

const RESEARCH_FIELDS = [
  { id: "annualRevenue", label: "Annual Revenue ($)", type: "number", default: "2500000" },
  { id: "yearsInBusiness", label: "Years in Business", type: "number", default: "8" },
  { id: "profitMargin", label: "Profit Margin (%)", type: "number", default: "12" },
  { id: "marketShare", label: "Market Share (%)", type: "number", default: "7" },
  { id: "creditScore", label: "Credit Score", type: "number", default: "720" },
  { id: "employeeCount", label: "Employee Count", type: "number", default: "150" },
  { id: "customerRetention", label: "Customer Retention (%)", type: "number", default: "85" },
  { id: "regulatoryCompliance", label: "Compliance Score (0-10)", type: "number", default: "8" },
  { id: "licenseValid", label: "Valid License (true/false)", type: "text", default: "true" },
  { id: "activeLitigation", label: "Active Litigation (true/false)", type: "text", default: "false" },
  { id: "sanctionsFlag", label: "Sanctions Flag (true/false)", type: "text", default: "false" },
  { id: "debtToEquity", label: "Debt-to-Equity Ratio", type: "number", default: "1.5" },
];

export default function DealDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [deal, setDeal] = useState<Deal | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [factors, setFactors] = useState<Record<string, string>>({});

  useEffect(() => {
    const defaults: Record<string, string> = {};
    RESEARCH_FIELDS.forEach((f) => {
      defaults[f.id] = f.default;
    });
    setFactors(defaults);

    fetch(`/api/deals/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          setDeal(data);
          if (data.analysisData) setAnalysis(data.analysisData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const parsedFactors: Record<string, string | number | boolean> = {};
    for (const [key, val] of Object.entries(factors)) {
      if (val === "true") parsedFactors[key] = true;
      else if (val === "false") parsedFactors[key] = false;
      else if (!isNaN(Number(val))) parsedFactors[key] = Number(val);
      else parsedFactors[key] = val;
    }

    const res = await fetch(`/api/deals/${id}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ factors: parsedFactors }),
    });

    const data = await res.json();
    if (data.analysis) {
      setAnalysis(data.analysis);
      setDeal(data.deal);
    }
    setAnalyzing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Deal not found</p>
        <Button asChild>
          <Link href="/deals">Back to Deals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <AnalyzingOverlay active={analyzing} />
      <PageHeader
        title={deal.name}
        description={deal.companyName}
        actions={
          <div className="flex items-center gap-2">
            {deal.overallSignal && (
              <SignalBadge signal={deal.overallSignal} />
            )}
            <Badge variant="outline">{deal.status}</Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <h2 className="font-semibold mb-1">Background Research</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Company, financial, license, and operational factors
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {RESEARCH_FIELDS.map((field) => (
              <div key={field.id} className="space-y-1">
                <Label htmlFor={field.id} className="text-xs">
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  type={field.type}
                  value={factors[field.id] ?? ""}
                  onChange={(e) =>
                    setFactors({ ...factors, [field.id]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="mt-6 w-full sm:w-auto"
          >
            {analyzing ? "Analyzing" : "Run Analysis"}
          </Button>
        </div>

        {analysis ? (
          <AnalysisPanel result={analysis} />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 flex items-center justify-center text-muted-foreground text-sm">
            Run analysis to see signals, hard gates, and scoring matrix
          </div>
        )}
      </div>
    </div>
  );
}
