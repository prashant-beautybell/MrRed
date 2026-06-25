import { nanoid } from "@/lib/id";
import type { AnalysisResult, Signal, DealStatus } from "@/types";
import { buildDemoDataset } from "@/lib/demo-seed";
import { isDemoDataEnabled } from "@/lib/demo-data";
import type {
  DemoGate,
  DemoLeaderboardEntry,
  DemoMatrixEntry,
  DemoOutcome,
  DemoRule,
} from "@/lib/demo-seed";

export interface DevDeal {
  id: string;
  name: string;
  companyName: string;
  industry?: string | null;
  description?: string | null;
  dealValue?: number | null;
  currency: string;
  status: DealStatus;
  overallSignal?: Signal | null;
  totalScore?: number | null;
  maxScore?: number | null;
  scorePercentage?: number | null;
  recommendation?: string | null;
  analysisData?: AnalysisResult | null;
  analyzedAt?: Date | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DevAuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId?: string;
  dealId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  userName?: string;
}

const deals = new Map<string, DevDeal>();
const auditLogs: DevAuditLog[] = [];
let rules: DemoRule[] = [];
let gates: DemoGate[] = [];
let matrix: DemoMatrixEntry[] = [];
let outcomes: DemoOutcome[] = [];
let leaderboard: DemoLeaderboardEntry[] = [];
let demoSeeded = false;
let userCreatedDeals = false;

function markUserActivity() {
  if (demoSeeded) userCreatedDeals = true;
}

export function seedDemoPresentationData(createdById: string) {
  if (!isDemoDataEnabled() || demoSeeded) return;
  demoSeeded = true;

  const data = buildDemoDataset(createdById);

  deals.clear();
  auditLogs.length = 0;

  for (const deal of data.deals) {
    deals.set(deal.id, deal);
  }
  auditLogs.push(...data.auditLogs);
  rules = data.rules;
  gates = data.gates;
  matrix = data.matrix;
  outcomes = data.outcomes;
  leaderboard = data.leaderboard;
}

export function ensureDemoData(createdById = "dev-user") {
  if (isDemoDataEnabled()) {
    seedDemoPresentationData(createdById);
  }
}

export const devStore = {
  listDeals(): DevDeal[] {
    ensureDemoData();
    return Array.from(deals.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  getDeal(id: string): DevDeal | undefined {
    ensureDemoData();
    return deals.get(id);
  },

  createDeal(input: {
    name: string;
    companyName: string;
    industry?: string;
    description?: string;
    dealValue?: number;
    currency?: string;
    createdById: string;
  }): DevDeal {
    ensureDemoData();
    markUserActivity();

    const now = new Date();
    const deal: DevDeal = {
      id: nanoid(),
      name: input.name,
      companyName: input.companyName,
      industry: input.industry ?? null,
      description: input.description ?? null,
      dealValue: input.dealValue ?? null,
      currency: input.currency ?? "USD",
      status: "draft",
      createdById: input.createdById,
      createdAt: now,
      updatedAt: now,
    };
    deals.set(deal.id, deal);
    return deal;
  },

  updateDeal(id: string, patch: Partial<DevDeal>): DevDeal | undefined {
    ensureDemoData();
    const deal = deals.get(id);
    if (!deal) return undefined;
    markUserActivity();
    const updated = { ...deal, ...patch, updatedAt: new Date() };
    deals.set(id, updated);
    return updated;
  },

  addAuditLog(entry: Omit<DevAuditLog, "id" | "createdAt">) {
    ensureDemoData();
    markUserActivity();
    auditLogs.unshift({
      ...entry,
      id: nanoid(),
      createdAt: new Date(),
    });
  },

  listAuditLogs(): DevAuditLog[] {
    ensureDemoData();
    return [...auditLogs].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  },

  listRules(): DemoRule[] {
    ensureDemoData();
    return rules;
  },

  listGates(): DemoGate[] {
    ensureDemoData();
    return gates;
  },

  listMatrix(): DemoMatrixEntry[] {
    ensureDemoData();
    return matrix;
  },

  listOutcomes(): DemoOutcome[] {
    ensureDemoData();
    return outcomes;
  },

  listLeaderboard(): DemoLeaderboardEntry[] {
    ensureDemoData();
    return leaderboard;
  },

  isDemoMode(): boolean {
    return isDemoDataEnabled() && demoSeeded && !userCreatedDeals;
  },

  getStats() {
    ensureDemoData();
    const all = Array.from(deals.values());
    return {
      total: all.length,
      green: all.filter((d) => d.overallSignal === "green").length,
      amber: all.filter((d) => d.overallSignal === "amber").length,
      red: all.filter((d) => d.overallSignal === "red").length,
      totalValue: all.reduce((sum, d) => sum + (d.dealValue ?? 0), 0),
    };
  },
};
