"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/templates/PageHeader";
import { AuditEntry } from "@/components/molecules/AuditEntry";
import { Spinner } from "@/components/atoms/Spinner";

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  userName?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Audit Trail"
        description="Complete history of all actions, signal changes, and system events"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border text-muted-foreground">
          <p>No audit events yet. Actions will be logged here automatically.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          {logs.map((log) => (
            <AuditEntry
              key={log.id}
              action={log.action}
              entityType={log.entityType}
              userName={log.userName}
              createdAt={log.createdAt}
              metadata={log.metadata ?? undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
