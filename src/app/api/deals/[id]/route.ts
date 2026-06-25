import { NextResponse } from "next/server";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
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
    return NextResponse.json(deal);
  } catch (error) {
    const deal = devStore.getDeal(id);
    if (deal) return NextResponse.json(deal);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch deal" },
      { status: 500 }
    );
  }
}
