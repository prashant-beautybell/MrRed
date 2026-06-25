import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { nanoid } from "@/lib/id";

export async function createAuditLog(params: {
  action: string;
  entityType: string;
  entityId: string;
  userId?: string;
  dealId?: string;
  previousValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(auditLogs).values({
    id: nanoid(),
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    userId: params.userId,
    dealId: params.dealId,
    previousValue: params.previousValue ?? null,
    newValue: params.newValue ?? null,
    metadata: params.metadata ?? null,
  });
}
