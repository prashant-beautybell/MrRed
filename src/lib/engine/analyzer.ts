import type { Signal, FactorScore, GateResult, AnalysisResult } from "@/types";

export function scoreToSignal(
  score: number,
  maxScore: number,
  amberThreshold = 0.5,
  greenThreshold = 0.75
): Signal {
  const pct = maxScore > 0 ? score / maxScore : 0;
  if (pct >= greenThreshold) return "green";
  if (pct >= amberThreshold) return "amber";
  return "red";
}

export function evaluateHardGates(
  factors: Record<string, string | number | boolean>
): GateResult[] {
  const gates: Array<{
    id: string;
    name: string;
    check: (f: Record<string, string | number | boolean>) => boolean;
    message: string;
    severity: "critical" | "warning";
  }> = [
    {
      id: "gate-license",
      name: "Valid Business License",
      check: (f) => f.licenseValid === true || f.licenseValid === "true",
      message: "Business license is invalid or expired",
      severity: "critical",
    },
    {
      id: "gate-litigation",
      name: "No Active Litigation",
      check: (f) => !f.activeLitigation || f.activeLitigation === "false",
      message: "Company has active litigation proceedings",
      severity: "critical",
    },
    {
      id: "gate-sanctions",
      name: "Sanctions Check",
      check: (f) => !f.sanctionsFlag || f.sanctionsFlag === "false",
      message: "Entity appears on sanctions watchlist",
      severity: "critical",
    },
    {
      id: "gate-revenue",
      name: "Minimum Revenue Threshold",
      check: (f) => Number(f.annualRevenue) >= 100000,
      message: "Annual revenue below minimum threshold ($100K)",
      severity: "warning",
    },
    {
      id: "gate-debt",
      name: "Debt-to-Equity Ratio",
      check: (f) => Number(f.debtToEquity) <= 3,
      message: "Debt-to-equity ratio exceeds acceptable limit (3.0)",
      severity: "warning",
    },
    {
      id: "gate-credit",
      name: "Credit Score Minimum",
      check: (f) => Number(f.creditScore) >= 600,
      message: "Credit score below minimum threshold (600)",
      severity: "critical",
    },
  ];

  return gates.map((gate) => ({
    gateId: gate.id,
    name: gate.name,
    passed: gate.check(factors),
    message: gate.message,
    severity: gate.severity,
  }));
}

export function scoreFactors(
  factors: Array<{
    id: string;
    name: string;
    category: FactorScore["category"];
    value: string | number;
    weight: number;
    maxScore: number;
  }>
): FactorScore[] {
  const scorers: Record<string, (value: string | number) => number> = {
    annualRevenue: (v) => {
      const rev = Number(v);
      if (rev >= 10000000) return 10;
      if (rev >= 5000000) return 8;
      if (rev >= 1000000) return 6;
      if (rev >= 500000) return 4;
      return 2;
    },
    yearsInBusiness: (v) => {
      const years = Number(v);
      if (years >= 10) return 10;
      if (years >= 5) return 8;
      if (years >= 3) return 6;
      if (years >= 1) return 4;
      return 2;
    },
    profitMargin: (v) => {
      const margin = Number(v);
      if (margin >= 20) return 10;
      if (margin >= 15) return 8;
      if (margin >= 10) return 6;
      if (margin >= 5) return 4;
      return 2;
    },
    marketShare: (v) => {
      const share = Number(v);
      if (share >= 25) return 10;
      if (share >= 15) return 8;
      if (share >= 5) return 6;
      if (share >= 1) return 4;
      return 2;
    },
    creditScore: (v) => {
      const score = Number(v);
      if (score >= 750) return 10;
      if (score >= 700) return 8;
      if (score >= 650) return 6;
      if (score >= 600) return 4;
      return 2;
    },
    employeeCount: (v) => {
      const count = Number(v);
      if (count >= 500) return 10;
      if (count >= 100) return 8;
      if (count >= 50) return 6;
      if (count >= 10) return 4;
      return 2;
    },
    customerRetention: (v) => {
      const rate = Number(v);
      if (rate >= 90) return 10;
      if (rate >= 80) return 8;
      if (rate >= 70) return 6;
      if (rate >= 60) return 4;
      return 2;
    },
    regulatoryCompliance: (v) => {
      const score = Number(v);
      return Math.min(10, Math.max(0, score));
    },
  };

  const defaultScorer = (v: string | number) => {
    const num = Number(v);
    if (isNaN(num)) return 5;
    return Math.min(10, Math.max(0, num));
  };

  return factors.map((factor) => {
    const scorer = scorers[factor.id] ?? defaultScorer;
    const score = scorer(factor.value);
    const signal = scoreToSignal(score, factor.maxScore);

    return {
      factorId: factor.id,
      name: factor.name,
      category: factor.category,
      weight: factor.weight,
      score,
      maxScore: factor.maxScore,
      signal,
    };
  });
}

export function analyzeDeal(
  dealId: string,
  rawFactors: Record<string, string | number | boolean>,
  factorDefinitions: Array<{
    id: string;
    name: string;
    category: FactorScore["category"];
    weight: number;
    maxScore: number;
  }>
): AnalysisResult {
  const gateResults = evaluateHardGates(rawFactors);
  const criticalFailures = gateResults.filter(
    (g) => !g.passed && g.severity === "critical"
  );

  const factorsForScoring = factorDefinitions.map((def) => ({
    ...def,
    value: (rawFactors[def.id] ?? 0) as string | number,
  }));

  const factorScores = scoreFactors(factorsForScoring);

  const totalWeightedScore = factorScores.reduce(
    (sum, f) => sum + f.score * f.weight,
    0
  );
  const totalMaxScore = factorScores.reduce(
    (sum, f) => sum + f.maxScore * f.weight,
    0
  );
  const scorePercentage =
    totalMaxScore > 0 ? (totalWeightedScore / totalMaxScore) * 100 : 0;

  let overallSignal: Signal = scoreToSignal(
    totalWeightedScore,
    totalMaxScore
  );

  if (criticalFailures.length > 0) {
    overallSignal = "red";
  }

  const recommendation = getRecommendation(
    overallSignal,
    criticalFailures,
    scorePercentage
  );

  return {
    dealId,
    overallSignal,
    totalScore: totalWeightedScore,
    maxScore: totalMaxScore,
    scorePercentage,
    factorScores,
    gateResults,
    failedGates: gateResults.filter((g) => !g.passed),
    recommendation,
    analyzedAt: new Date(),
  };
}

function getRecommendation(
  signal: Signal,
  criticalFailures: GateResult[],
  scorePercentage: number
): string {
  if (criticalFailures.length > 0) {
    return `STOP: ${criticalFailures.length} critical hard gate(s) failed. Do not proceed with this deal until issues are resolved.`;
  }

  switch (signal) {
    case "green":
      return `GO: Strong deal profile (${scorePercentage.toFixed(0)}% score). All checks passed. Proceed with due diligence.`;
    case "amber":
      return `CHECK: Moderate risk (${scorePercentage.toFixed(0)}% score). Review flagged factors before proceeding.`;
    case "red":
      return `STOP: High risk (${scorePercentage.toFixed(0)}% score). Significant concerns identified. Recommend passing on this deal.`;
  }
}

export const DEFAULT_FACTOR_DEFINITIONS = [
  {
    id: "annualRevenue",
    name: "Annual Revenue",
    category: "financial" as const,
    weight: 1.5,
    maxScore: 10,
  },
  {
    id: "yearsInBusiness",
    name: "Years in Business",
    category: "company" as const,
    weight: 1.2,
    maxScore: 10,
  },
  {
    id: "profitMargin",
    name: "Profit Margin %",
    category: "financial" as const,
    weight: 1.3,
    maxScore: 10,
  },
  {
    id: "marketShare",
    name: "Market Share %",
    category: "market" as const,
    weight: 1.0,
    maxScore: 10,
  },
  {
    id: "creditScore",
    name: "Credit Score",
    category: "financial" as const,
    weight: 1.4,
    maxScore: 10,
  },
  {
    id: "employeeCount",
    name: "Employee Count",
    category: "operational" as const,
    weight: 0.8,
    maxScore: 10,
  },
  {
    id: "customerRetention",
    name: "Customer Retention %",
    category: "market" as const,
    weight: 1.1,
    maxScore: 10,
  },
  {
    id: "regulatoryCompliance",
    name: "Regulatory Compliance Score",
    category: "license" as const,
    weight: 1.5,
    maxScore: 10,
  },
];

export const DEFAULT_RULES = [
  {
    name: "Revenue Growth Rule",
    category: "financial",
    ruleType: "scoring" as const,
    condition: "annualRevenue >= 1000000",
    weight: 1.5,
    maxPoints: 10,
    amberThreshold: 5,
    greenThreshold: 8,
  },
  {
    name: "License Validity Gate",
    category: "license",
    ruleType: "hard_gate" as const,
    condition: "licenseValid == true",
    weight: 1,
    maxPoints: 10,
    amberThreshold: 5,
    greenThreshold: 8,
  },
  {
    name: "Litigation Check Gate",
    category: "legal",
    ruleType: "hard_gate" as const,
    condition: "activeLitigation == false",
    weight: 1,
    maxPoints: 10,
    amberThreshold: 5,
    greenThreshold: 8,
  },
  {
    name: "Market Position Rule",
    category: "market",
    ruleType: "scoring" as const,
    condition: "marketShare >= 5",
    weight: 1.0,
    maxPoints: 10,
    amberThreshold: 5,
    greenThreshold: 8,
  },
  {
    name: "Creditworthiness Rule",
    category: "financial",
    ruleType: "scoring" as const,
    condition: "creditScore >= 650",
    weight: 1.4,
    maxPoints: 10,
    amberThreshold: 5,
    greenThreshold: 8,
  },
];

export const DEFAULT_HARD_GATES = [
  {
    name: "Valid Business License",
    category: "license",
    condition: "licenseValid == true",
    failureMessage: "Business license is invalid or expired",
    severity: "critical",
  },
  {
    name: "No Active Litigation",
    category: "legal",
    condition: "activeLitigation == false",
    failureMessage: "Company has active litigation proceedings",
    severity: "critical",
  },
  {
    name: "Sanctions Check",
    category: "legal",
    condition: "sanctionsFlag == false",
    failureMessage: "Entity appears on sanctions watchlist",
    severity: "critical",
  },
  {
    name: "Credit Score Minimum",
    category: "financial",
    condition: "creditScore >= 600",
    failureMessage: "Credit score below minimum threshold",
    severity: "critical",
  },
];
