import { NextResponse } from "next/server";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { nanoid } from "@/lib/id";
import { createAuditLog } from "@/lib/audit";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (useLocalStore()) {
    return NextResponse.json(devStore.listDeals());
  }

  try {
    const allDeals = await db
      .select()
      .from(deals)
      .orderBy(desc(deals.createdAt));
    return NextResponse.json(allDeals);
  } catch {
    return NextResponse.json(devStore.listDeals());
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (useLocalStore()) {
    const deal = devStore.createDeal({
      name: body.name,
      companyName: body.companyName,
      industry: body.industry,
      description: body.description,
      dealValue: body.dealValue,
      currency: body.currency,
      createdById: session.user.id,
    });

    devStore.addAuditLog({
      action: "deal_created",
      entityType: "deal",
      entityId: deal.id,
      userId: session.user.id,
      dealId: deal.id,
      userName: session.user.name,
      metadata: { name: deal.name },
    });

    return NextResponse.json(deal, { status: 201 });
  }

  try {
    const id = nanoid();
    const [deal] = await db
      .insert(deals)
      .values({
        id,
        name: body.name,
        companyName: body.companyName,
        industry: body.industry,
        description: body.description,
        dealValue: body.dealValue,
        currency: body.currency ?? "USD",
        status: "draft",
        createdById: session.user.id,
      })
      .returning();

    await createAuditLog({
      action: "deal_created",
      entityType: "deal",
      entityId: id,
      userId: session.user.id,
      dealId: id,
      newValue: deal,
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create deal",
        hint: "Set a valid DATABASE_URL in .env.local and run npm run db:push",
      },
      { status: 500 }
    );
  }
}
