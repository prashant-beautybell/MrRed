import { NextResponse } from "next/server";
import { db } from "@/db";
import { rules, hardGates, scoringMatrix } from "@/db/schema";
import {
  DEFAULT_RULES,
  DEFAULT_HARD_GATES,
} from "@/lib/engine/analyzer";
import { nanoid } from "@/lib/id";

export async function POST() {
  try {
    const existingRules = await db.select().from(rules);
    if (existingRules.length > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    for (const rule of DEFAULT_RULES) {
      const ruleId = nanoid();
      await db.insert(rules).values({
        id: ruleId,
        name: rule.name,
        category: rule.category,
        ruleType: rule.ruleType,
        condition: rule.condition,
        weight: rule.weight,
        maxPoints: rule.maxPoints,
        amberThreshold: rule.amberThreshold,
        greenThreshold: rule.greenThreshold,
      });
    }

    for (const gate of DEFAULT_HARD_GATES) {
      await db.insert(hardGates).values({
        id: nanoid(),
        name: gate.name,
        category: gate.category,
        condition: gate.condition,
        failureMessage: gate.failureMessage,
        severity: gate.severity,
      });
    }

    const scoringEntries = [
      { factorName: "Annual Revenue", minValue: 10000000, maxValue: null, points: 10, signal: "green", description: "$10M+" },
      { factorName: "Annual Revenue", minValue: 1000000, maxValue: 10000000, points: 7, signal: "amber", description: "$1M–$10M" },
      { factorName: "Annual Revenue", minValue: 0, maxValue: 1000000, points: 3, signal: "red", description: "Under $1M" },
      { factorName: "Credit Score", minValue: 750, maxValue: null, points: 10, signal: "green", description: "Excellent" },
      { factorName: "Credit Score", minValue: 650, maxValue: 750, points: 6, signal: "amber", description: "Good" },
      { factorName: "Credit Score", minValue: 0, maxValue: 650, points: 2, signal: "red", description: "Poor" },
    ];

    const [firstRule] = await db.select().from(rules).limit(1);
    if (firstRule) {
      for (const entry of scoringEntries) {
        await db.insert(scoringMatrix).values({
          id: nanoid(),
          ruleId: firstRule.id,
          ...entry,
        });
      }
    }

    return NextResponse.json({ message: "Seeded successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
