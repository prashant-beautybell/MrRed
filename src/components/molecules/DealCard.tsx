import Link from "next/link";
import { SignalBadge } from "@/components/molecules/SignalBadge";
import { Badge } from "@/components/atoms/Badge";
import { formatCurrency } from "@/lib/utils";
import type { Signal, DealStatus } from "@/types";
import { cn } from "@/lib/utils";
import { Building2, ChevronRight } from "lucide-react";

interface DealCardProps {
  id: string;
  name: string;
  companyName: string;
  dealValue?: number;
  currency?: string;
  status: DealStatus;
  signal?: Signal;
  scorePercentage?: number;
  className?: string;
}

const statusLabels: Record<DealStatus, string> = {
  draft: "Draft",
  analyzing: "Analyzing",
  review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  closed: "Closed",
};

export function DealCard({
  id,
  name,
  companyName,
  dealValue,
  currency = "USD",
  status,
  signal,
  scorePercentage,
  className,
}: DealCardProps) {
  return (
    <Link
      href={`/deals/${id}`}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-lg bg-muted p-2 shrink-0">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {companyName}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{statusLabels[status]}</Badge>
        {signal && <SignalBadge signal={signal} showIcon={false} />}
        {scorePercentage !== undefined && (
          <span className="text-xs text-muted-foreground">
            {scorePercentage.toFixed(0)}% score
          </span>
        )}
      </div>

      {dealValue !== undefined && (
        <p className="text-lg font-bold">
          {formatCurrency(dealValue, currency)}
        </p>
      )}
    </Link>
  );
}
