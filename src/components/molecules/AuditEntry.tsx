import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface AuditEntryProps {
  action: string;
  entityType: string;
  userName?: string;
  createdAt: Date | string;
  metadata?: Record<string, unknown>;
}

export function AuditEntry({
  action,
  entityType,
  userName,
  createdAt,
  metadata,
}: AuditEntryProps) {
  const date =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium capitalize">
            {action.replace(/_/g, " ")}
          </span>{" "}
          <span className="text-muted-foreground">on {entityType}</span>
          {userName && (
            <span className="text-muted-foreground"> by {userName}</span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {format(date, "MMM d, yyyy 'at' h:mm a")}
        </p>
        {metadata && Object.keys(metadata).length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 font-mono truncate">
            {JSON.stringify(metadata)}
          </p>
        )}
      </div>
    </div>
  );
}
