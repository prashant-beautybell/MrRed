import { NextResponse } from "next/server";
import { db } from "@/db";
import { outcomes, deals, user } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { nanoid } from "@/lib/id";
import { createAuditLog } from "@/lib/audit";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (useLocalStore()) {
    return NextResponse.json(devStore.listOutcomes());
  }

  try {
    const allOutcomes = await db
      .select({
        id: outcomes.id,
        dealId: outcomes.dealId,
        predictedSignal: outcomes.predictedSignal,
        actualOutcome: outcomes.actualOutcome,
        wasCorrect: outcomes.wasCorrect,
        finalValue: outcomes.finalValue,
        roi: outcomes.roi,
        notes: outcomes.notes,
        recordedAt: outcomes.recordedAt,
        dealName: deals.name,
        companyName: deals.companyName,
        recordedByName: user.name,
      })
      .from(outcomes)
      .leftJoin(deals, eq(outcomes.dealId, deals.id))
      .leftJoin(user, eq(outcomes.recordedById, user.id))
      .orderBy(desc(outcomes.recordedAt));

    return NextResponse.json(allOutcomes);
  } catch {
    return NextResponse.json(devStore.listOutcomes());
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (useLocalStore()) {
    return NextResponse.json(
      { message: "Outcome recorded (demo mode)" },
      { status: 201 }
    );
  }

  try {
    const id = nanoid();

    const [outcome] = await db
      .insert(outcomes)
      .values({
        id,
        dealId: body.dealId,
        predictedSignal: body.predictedSignal,
        actualOutcome: body.actualOutcome,
        wasCorrect: body.wasCorrect,
        finalValue: body.finalValue,
        roi: body.roi,
        notes: body.notes,
        recordedById: session.user.id,
      })
      .returning();

    await createAuditLog({
      action: "outcome_recorded",
      entityType: "outcome",
      entityId: id,
      userId: session.user.id,
      dealId: body.dealId,
      newValue: outcome,
    });

    return NextResponse.json(outcome, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to record outcome" },
      { status: 500 }
    );
  }
}
