import type { AnalysisResult, Signal, DealStatus } from "@/types";
import {
  analyzeDeal,
  DEFAULT_FACTOR_DEFINITIONS,
  DEFAULT_HARD_GATES,
  DEFAULT_RULES,
} from "@/lib/engine/analyzer";
import type { DevAuditLog, DevDeal } from "@/lib/dev-store";

export interface DemoRule {
  id: string;
  name: string;
  description?: string;
  category: string;
  ruleType: string;
  condition: string;
  weight: number;
  maxPoints: number;
  amberThreshold: number;
  greenThreshold: number;
  isActive: boolean;
  version: number;
}

export interface DemoGate {
  id: string;
  name: string;
  description?: string;
  category: string;
  condition: string;
  failureMessage: string;
  severity: string;
  isActive: boolean;
}

export interface DemoMatrixEntry {
  id: string;
  ruleId: string;
  factorName: string;
  minValue?: number;
  maxValue?: number | null;
  points: number;
  signal: string;
  description?: string;
}

export interface DemoOutcome {
  id: string;
  dealId: string;
  predictedSignal: Signal;
  actualOutcome: string;
  wasCorrect: boolean;
  finalValue?: number;
  roi?: number;
  notes?: string;
  recordedAt: string;
  dealName: string;
  companyName: string;
  recordedByName: string;
}

export interface DemoLeaderboardEntry {
  userId: string;
  userName: string;
  totalDeals: number;
  correctPredictions: number;
  accuracy: number;
  greenDeals: number;
  amberDeals: number;
  redDeals: number;
  totalValue: number;
  rank: number;
}

const DEMO_DEAL_SPECS = [
  {
    id: "demo-deal-1",
    name: "TechVault SaaS Acquisition",
    companyName: "TechVault Inc.",
    industry: "Technology",
    description: "B2B workflow automation platform with 2,400 enterprise clients",
    dealValue: 12_000_000,
    status: "approved" as DealStatus,
    factors: {
      annualRevenue: 8_500_000,
      yearsInBusiness: 9,
      profitMargin: 22,
      marketShare: 12,
      creditScore: 780,
      employeeCount: 210,
      customerRetention: 92,
      regulatoryCompliance: 9,
      licenseValid: true,
      activeLitigation: false,
      sanctionsFlag: false,
      debtToEquity: 0.8,
    },
  },
  {
    id: "demo-deal-2",
    name: "Meridian Logistics Merger",
    companyName: "Meridian Freight Co.",
    industry: "Logistics",
    description: "Regional freight operator expanding into cold-chain logistics",
    dealValue: 8_500_000,
    status: "review" as DealStatus,
    factors: {
      annualRevenue: 4_200_000,
      yearsInBusiness: 6,
      profitMargin: 11,
      marketShare: 6,
      creditScore: 680,
      employeeCount: 85,
      customerRetention: 78,
      regulatoryCompliance: 7,
      licenseValid: true,
      activeLitigation: false,
      sanctionsFlag: false,
      debtToEquity: 2.1,
    },
  },
  {
    id: "demo-deal-3",
    name: "NovaPharma Series C",
    companyName: "NovaPharma Labs",
    industry: "Healthcare",
    description: "Clinical-stage biotech with pending FDA pipeline assets",
    dealValue: 25_000_000,
    status: "rejected" as DealStatus,
    factors: {
      annualRevenue: 1_200_000,
      yearsInBusiness: 4,
      profitMargin: -8,
      marketShare: 2,
      creditScore: 590,
      employeeCount: 45,
      customerRetention: 65,
      regulatoryCompliance: 5,
      licenseValid: false,
      activeLitigation: true,
      sanctionsFlag: false,
      debtToEquity: 4.2,
    },
  },
  {
    id: "demo-deal-4",
    name: "GreenLeaf Foods Expansion",
    companyName: "GreenLeaf Organics",
    industry: "Food & Beverage",
    description: "Organic snack brand with national retail distribution",
    dealValue: 4_200_000,
    status: "closed" as DealStatus,
    factors: {
      annualRevenue: 3_800_000,
      yearsInBusiness: 7,
      profitMargin: 18,
      marketShare: 8,
      creditScore: 740,
      employeeCount: 62,
      customerRetention: 88,
      regulatoryCompliance: 9,
      licenseValid: true,
      activeLitigation: false,
      sanctionsFlag: false,
      debtToEquity: 1.1,
    },
  },
  {
    id: "demo-deal-5",
    name: "Atlas Manufacturing JV",
    companyName: "Atlas Industrial Group",
    industry: "Manufacturing",
    description: "Precision components supplier for automotive OEMs",
    dealValue: 15_000_000,
    status: "review" as DealStatus,
    factors: {
      annualRevenue: 11_000_000,
      yearsInBusiness: 14,
      profitMargin: 9,
      marketShare: 11,
      creditScore: 710,
      employeeCount: 320,
      customerRetention: 81,
      regulatoryCompliance: 8,
      licenseValid: true,
      activeLitigation: false,
      sanctionsFlag: false,
      debtToEquity: 2.8,
    },
  },
  {
    id: "demo-deal-6",
    name: "Cipher Security Buyout",
    companyName: "Cipher Security Ltd.",
    industry: "Cybersecurity",
    description: "Managed detection & response provider for mid-market",
    dealValue: 32_000_000,
    status: "approved" as DealStatus,
    factors: {
      annualRevenue: 18_000_000,
      yearsInBusiness: 11,
      profitMargin: 24,
      marketShare: 15,
      creditScore: 800,
      employeeCount: 175,
      customerRetention: 94,
      regulatoryCompliance: 10,
      licenseValid: true,
      activeLitigation: false,
      sanctionsFlag: false,
      debtToEquity: 0.5,
    },
  },
  {
    id: "demo-deal-7",
    name: "Harbor Retail Chain",
    companyName: "Harbor Retail Group",
    industry: "Retail",
    description: "42-location discount retail chain in the Southeast",
    dealValue: 6_000_000,
    status: "rejected" as DealStatus,
    factors: {
      annualRevenue: 2_100_000,
      yearsInBusiness: 3,
      profitMargin: 4,
      marketShare: 3,
      creditScore: 620,
      employeeCount: 480,
      customerRetention: 58,
      regulatoryCompliance: 6,
      licenseValid: true,
      activeLitigation: false,
      sanctionsFlag: true,
      debtToEquity: 3.5,
    },
  },
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export function buildDemoDataset(createdById: string) {
  const deals: DevDeal[] = DEMO_DEAL_SPECS.map((spec, i) => {
    const analysis = analyzeDeal(
      spec.id,
      spec.factors,
      DEFAULT_FACTOR_DEFINITIONS
    );

    return {
      id: spec.id,
      name: spec.name,
      companyName: spec.companyName,
      industry: spec.industry,
      description: spec.description,
      dealValue: spec.dealValue,
      currency: "USD",
      status: spec.status,
      overallSignal: analysis.overallSignal,
      totalScore: analysis.totalScore,
      maxScore: analysis.maxScore,
      scorePercentage: analysis.scorePercentage,
      recommendation: analysis.recommendation,
      analysisData: analysis as AnalysisResult,
      analyzedAt: daysAgo(i * 3 + 1),
      createdById,
      createdAt: daysAgo(i * 3 + 5),
      updatedAt: daysAgo(i * 3 + 1),
    };
  });

  const rules: DemoRule[] = DEFAULT_RULES.map((rule, i) => ({
    id: `demo-rule-${i + 1}`,
    name: rule.name,
    description: `Evaluates ${rule.category} criteria for deal qualification`,
    category: rule.category,
    ruleType: rule.ruleType,
    condition: rule.condition,
    weight: rule.weight,
    maxPoints: rule.maxPoints,
    amberThreshold: rule.amberThreshold,
    greenThreshold: rule.greenThreshold,
    isActive: true,
    version: 1,
  }));

  const gates: DemoGate[] = DEFAULT_HARD_GATES.map((gate, i) => ({
    id: `demo-gate-${i + 1}`,
    name: gate.name,
    description: `Hard gate: ${gate.category} compliance check`,
    category: gate.category,
    condition: gate.condition,
    failureMessage: gate.failureMessage,
    severity: gate.severity,
    isActive: true,
  }));

  const matrix: DemoMatrixEntry[] = [
    { id: "demo-mx-1", ruleId: "demo-rule-1", factorName: "Annual Revenue", minValue: 10_000_000, maxValue: null, points: 10, signal: "green", description: "$10M+" },
    { id: "demo-mx-2", ruleId: "demo-rule-1", factorName: "Annual Revenue", minValue: 1_000_000, maxValue: 10_000_000, points: 7, signal: "amber", description: "$1M–$10M" },
    { id: "demo-mx-3", ruleId: "demo-rule-1", factorName: "Annual Revenue", minValue: 0, maxValue: 1_000_000, points: 3, signal: "red", description: "Under $1M" },
    { id: "demo-mx-4", ruleId: "demo-rule-5", factorName: "Credit Score", minValue: 750, maxValue: null, points: 10, signal: "green", description: "Excellent (750+)" },
    { id: "demo-mx-5", ruleId: "demo-rule-5", factorName: "Credit Score", minValue: 650, maxValue: 750, points: 6, signal: "amber", description: "Good (650–750)" },
    { id: "demo-mx-6", ruleId: "demo-rule-5", factorName: "Credit Score", minValue: 0, maxValue: 650, points: 2, signal: "red", description: "Poor (under 650)" },
    { id: "demo-mx-7", ruleId: "demo-rule-4", factorName: "Market Share", minValue: 15, maxValue: null, points: 10, signal: "green", description: "15%+ market share" },
    { id: "demo-mx-8", ruleId: "demo-rule-4", factorName: "Market Share", minValue: 5, maxValue: 15, points: 6, signal: "amber", description: "5–15% market share" },
    { id: "demo-mx-9", ruleId: "demo-rule-4", factorName: "Market Share", minValue: 0, maxValue: 5, points: 3, signal: "red", description: "Under 5%" },
  ];

  const auditLogs: DevAuditLog[] = [
    { id: "demo-audit-1", action: "deal_analyzed", entityType: "deal", entityId: "demo-deal-1", userId: createdById, dealId: "demo-deal-1", userName: "Alex Morgan", metadata: { signal: "green", score: 87 }, createdAt: daysAgo(1) },
    { id: "demo-audit-2", action: "deal_created", entityType: "deal", entityId: "demo-deal-3", userId: createdById, dealId: "demo-deal-3", userName: "Alex Morgan", metadata: { name: "NovaPharma Series C" }, createdAt: daysAgo(2) },
    { id: "demo-audit-3", action: "gate_triggered", entityType: "deal", entityId: "demo-deal-3", userId: createdById, dealId: "demo-deal-3", userName: "Alex Morgan", metadata: { gate: "Valid Business License", passed: false }, createdAt: daysAgo(2) },
    { id: "demo-audit-4", action: "deal_analyzed", entityType: "deal", entityId: "demo-deal-6", userId: createdById, dealId: "demo-deal-6", userName: "Jordan Lee", metadata: { signal: "green", score: 91 }, createdAt: daysAgo(3) },
    { id: "demo-audit-5", action: "outcome_recorded", entityType: "outcome", entityId: "demo-outcome-1", userId: createdById, dealId: "demo-deal-4", userName: "Alex Morgan", metadata: { actual: "success", roi: 34.2 }, createdAt: daysAgo(5) },
    { id: "demo-audit-6", action: "signal_changed", entityType: "deal", entityId: "demo-deal-2", userId: createdById, dealId: "demo-deal-2", userName: "Sam Patel", metadata: { from: "green", to: "amber" }, createdAt: daysAgo(6) },
    { id: "demo-audit-7", action: "deal_analyzed", entityType: "deal", entityId: "demo-deal-7", userId: createdById, dealId: "demo-deal-7", userName: "Jordan Lee", metadata: { signal: "red", score: 38 }, createdAt: daysAgo(7) },
    { id: "demo-audit-8", action: "rule_updated", entityType: "rule", entityId: "demo-rule-2", userId: createdById, userName: "Alex Morgan", metadata: { version: 2 }, createdAt: daysAgo(10) },
  ];

  const outcomes: DemoOutcome[] = [
    { id: "demo-outcome-1", dealId: "demo-deal-4", predictedSignal: "green", actualOutcome: "success", wasCorrect: true, finalValue: 5_640_000, roi: 34.2, notes: "Exceeded revenue projections by 18%", recordedAt: daysAgo(5).toISOString(), dealName: "GreenLeaf Foods Expansion", companyName: "GreenLeaf Organics", recordedByName: "Alex Morgan" },
    { id: "demo-outcome-2", dealId: "demo-deal-3", predictedSignal: "red", actualOutcome: "failure", wasCorrect: true, finalValue: 0, roi: -100, notes: "License revoked; deal terminated", recordedAt: daysAgo(12).toISOString(), dealName: "NovaPharma Series C", companyName: "NovaPharma Labs", recordedByName: "Jordan Lee" },
    { id: "demo-outcome-3", dealId: "demo-deal-1", predictedSignal: "green", actualOutcome: "success", wasCorrect: true, finalValue: 14_200_000, roi: 18.3, notes: "Strong post-acquisition integration", recordedAt: daysAgo(20).toISOString(), dealName: "TechVault SaaS Acquisition", companyName: "TechVault Inc.", recordedByName: "Alex Morgan" },
    { id: "demo-outcome-4", dealId: "demo-deal-5", predictedSignal: "amber", actualOutcome: "partial", wasCorrect: false, finalValue: 12_000_000, roi: 8.1, notes: "Debt ratio higher than projected", recordedAt: daysAgo(25).toISOString(), dealName: "Atlas Manufacturing JV", companyName: "Atlas Industrial Group", recordedByName: "Sam Patel" },
  ];

  const leaderboard: DemoLeaderboardEntry[] = [
    { userId: "demo-user-1", userName: "Alex Morgan", totalDeals: 12, correctPredictions: 10, accuracy: 83.3, greenDeals: 5, amberDeals: 4, redDeals: 3, totalValue: 58_200_000, rank: 1 },
    { userId: "demo-user-2", userName: "Jordan Lee", totalDeals: 9, correctPredictions: 7, accuracy: 77.8, greenDeals: 4, amberDeals: 2, redDeals: 3, totalValue: 44_500_000, rank: 2 },
    { userId: "demo-user-3", userName: "Sam Patel", totalDeals: 7, correctPredictions: 5, accuracy: 71.4, greenDeals: 2, amberDeals: 3, redDeals: 2, totalValue: 31_000_000, rank: 3 },
    { userId: createdById, userName: "Dev User", totalDeals: deals.length, correctPredictions: 5, accuracy: 71.4, greenDeals: 2, amberDeals: 2, redDeals: 3, totalValue: deals.reduce((s, d) => s + (d.dealValue ?? 0), 0), rank: 4 },
  ];

  return { deals, rules, gates, matrix, auditLogs, outcomes, leaderboard };
}
