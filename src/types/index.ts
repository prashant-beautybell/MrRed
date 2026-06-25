export type Signal = "red" | "amber" | "green";

export type DealStatus =
  | "draft"
  | "analyzing"
  | "review"
  | "approved"
  | "rejected"
  | "closed";

export type FactorCategory =
  | "company"
  | "financial"
  | "license"
  | "legal"
  | "market"
  | "operational"
  | "reputation";

export type RuleType = "scoring" | "hard_gate" | "informational";

export type AuditAction =
  | "deal_created"
  | "deal_updated"
  | "deal_analyzed"
  | "rule_created"
  | "rule_updated"
  | "gate_triggered"
  | "outcome_recorded"
  | "signal_changed";

export interface FactorScore {
  factorId: string;
  name: string;
  category: FactorCategory;
  weight: number;
  score: number;
  maxScore: number;
  signal: Signal;
  notes?: string;
}

export interface GateResult {
  gateId: string;
  name: string;
  passed: boolean;
  message: string;
  severity: "critical" | "warning";
}

export interface AnalysisResult {
  dealId: string;
  overallSignal: Signal;
  totalScore: number;
  maxScore: number;
  scorePercentage: number;
  factorScores: FactorScore[];
  gateResults: GateResult[];
  failedGates: GateResult[];
  recommendation: string;
  analyzedAt: Date;
}
