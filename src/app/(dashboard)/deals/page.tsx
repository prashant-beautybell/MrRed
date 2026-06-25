"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/templates/PageHeader";
import { DealCard } from "@/components/molecules/DealCard";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import Link from "next/link";
import type { Signal, DealStatus } from "@/types";

interface Deal {
  id: string;
  name: string;
  companyName: string;
  dealValue?: number;
  currency?: string;
  status: DealStatus;
  overallSignal?: Signal;
  scorePercentage?: number;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deals")
      .then((r) => r.json())
      .then(setDeals)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Deals"
        description="All deal analyses and their signals"
        actions={
          <Button asChild>
            <Link href="/deals/new">New Deal</Link>
          </Button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground mb-4">No deals analyzed yet</p>
          <Button asChild>
            <Link href="/deals/new">Create First Deal</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              id={deal.id}
              name={deal.name}
              companyName={deal.companyName}
              dealValue={deal.dealValue}
              currency={deal.currency}
              status={deal.status}
              signal={deal.overallSignal}
              scorePercentage={deal.scorePercentage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
