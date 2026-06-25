import { NextResponse } from "next/server";
import { db } from "@/db";
import { rules, hardGates, scoringMatrix } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (useLocalStore()) {
    return NextResponse.json({
      rules: devStore.listRules(),
      gates: devStore.listGates(),
      matrix: devStore.listMatrix(),
    });
  }

  try {
    const allRules = await db.select().from(rules);
    const gates = await db.select().from(hardGates);
    const matrix = await db.select().from(scoringMatrix);

    return NextResponse.json({ rules: allRules, gates, matrix });
  } catch {
    return NextResponse.json({
      rules: devStore.listRules(),
      gates: devStore.listGates(),
      matrix: devStore.listMatrix(),
    });
  }
}
