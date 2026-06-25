import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface GateResultItemProps {
  name: string;
  passed: boolean;
  message: string;
  severity: "critical" | "warning";
}

export function GateResultItem({
  name,
  passed,
  message,
  severity,
}: GateResultItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-3 sm:p-4",
        passed
          ? "border-signal-green/30 bg-signal-green-bg"
          : severity === "critical"
            ? "border-signal-red/30 bg-signal-red-bg"
            : "border-signal-amber/30 bg-signal-amber-bg"
      )}
    >
      {passed ? (
        <CheckCircle2 className="h-5 w-5 text-signal-green shrink-0 mt-0.5" />
      ) : severity === "critical" ? (
        <XCircle className="h-5 w-5 text-signal-red shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-signal-amber shrink-0 mt-0.5" />
      )}
      <div className="min-w-0">
        <p className="font-medium text-sm">{name}</p>
        {!passed && (
          <p className="text-xs text-muted-foreground mt-0.5">{message}</p>
        )}
      </div>
    </div>
  );
}
