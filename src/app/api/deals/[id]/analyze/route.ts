import { NextResponse } from "next/server";
import { db } from "@/db";
import { deals, dealFactors } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { createAuditLog } from "@/lib/audit";
import {
  analyzeDeal,
  DEFAULT_FACTOR_DEFINITIONS,
} from "@/lib/engine/analyzer";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (useLocalStore()) {
    const deal = devStore.getDeal(id);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }
    return NextResponse.json({ ...deal, factors: [] });
  }

  try {
    const [deal] = await db.select().from(deals).where(eq(deals.id, id));
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const factors = await db
      .select()
      .from(dealFactors)
      .where(eq(dealFactors.dealId, id));

    return NextResponse.json({ ...deal, factors });
  } catch (error) {
    const deal = devStore.getDeal(id);
    if (deal) return NextResponse.json({ ...deal, factors: [] });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch deal" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const rawFactors = body.factors as Record<
    string,
    string | number | boolean
  >;

  const result = analyzeDeal(id, rawFactors, DEFAULT_FACTOR_DEFINITIONS);

  if (useLocalStore()) {
    const updated = devStore.updateDeal(id, {
      status: "review",
      overallSignal: result.overallSignal,
      totalScore: result.totalScore,
      maxScore: result.maxScore,
      scorePercentage: result.scorePercentage,
      recommendation: result.recommendation,
      analysisData: result,
      analyzedAt: result.analyzedAt,
    });

    if (!updated) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    devStore.addAuditLog({
      action: "deal_analyzed",
      entityType: "deal",
      entityId: id,
      userId: session.user.id,
      dealId: id,
      userName: session.user.name,
      metadata: { signal: result.overallSignal, score: result.scorePercentage },
    });

    return NextResponse.json({ deal: updated, analysis: result });
  }

  try {
    const [updated] = await db
      .update(deals)
      .set({
        status: "review",
        overallSignal: result.overallSignal,
        totalScore: result.totalScore,
        maxScore: result.maxScore,
        scorePercentage: result.scorePercentage,
        recommendation: result.recommendation,
        analysisData: result,
        analyzedAt: result.analyzedAt,
        updatedAt: new Date(),
      })
      .where(eq(deals.id, id))
      .returning();

    await createAuditLog({
      action: "deal_analyzed",
      entityType: "deal",
      entityId: id,
      userId: session.user.id,
      dealId: id,
      newValue: { signal: result.overallSignal, score: result.scorePercentage },
    });

    return NextResponse.json({ deal: updated, analysis: result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
