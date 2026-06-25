import { NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs, user } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (useLocalStore()) {
    return NextResponse.json(devStore.listAuditLogs());
  }

  try {
    const logs = await db
      .select({
        id: auditLogs.id,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        dealId: auditLogs.dealId,
        metadata: auditLogs.metadata,
        createdAt: auditLogs.createdAt,
        userName: user.name,
      })
      .from(auditLogs)
      .leftJoin(user, eq(auditLogs.userId, user.id))
      .orderBy(desc(auditLogs.createdAt))
      .limit(100);

    return NextResponse.json(logs);
  } catch {
    return NextResponse.json(devStore.listAuditLogs());
  }
}
