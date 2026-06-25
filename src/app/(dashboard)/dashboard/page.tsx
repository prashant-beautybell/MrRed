import { PageHeader } from "@/components/templates/PageHeader";
import { StatCard } from "@/components/molecules/StatCard";
import { DealCard } from "@/components/molecules/DealCard";
import { TrafficLight } from "@/components/organisms/TrafficLight";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { db } from "@/db";
import { deals } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";
import {
  Briefcase,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

async function getDashboardData() {
  if (useLocalStore()) {
    const allDeals = devStore.listDeals().slice(0, 6);
    const stats = devStore.getStats();
    return { allDeals, stats };
  }

  try {
    const allDeals = await db
      .select()
      .from(deals)
      .orderBy(desc(deals.createdAt))
      .limit(6);

    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        green: sql<number>`count(*) filter (where ${deals.overallSignal} = 'green')::int`,
        amber: sql<number>`count(*) filter (where ${deals.overallSignal} = 'amber')::int`,
        red: sql<number>`count(*) filter (where ${deals.overallSignal} = 'red')::int`,
        totalValue: sql<number>`coalesce(sum(${deals.dealValue}), 0)`,
      })
      .from(deals);

    return { allDeals, stats };
  } catch {
    const allDeals = devStore.listDeals().slice(0, 6);
    const stats = devStore.getStats();
    return { allDeals, stats };
  }
}

export default async function DashboardPage() {
  const { allDeals, stats } = await getDashboardData();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Deal signal intelligence at a glance"
        actions={
          <Button asChild>
            <Link href="/deals/new">New Deal Analysis</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Deals"
          value={stats.total}
          icon={Briefcase}
        />
        <StatCard
          title="Green Signals"
          value={stats.green}
          description="Go — proceed"
          icon={TrendingUp}
        />
        <StatCard
          title="Amber Signals"
          value={stats.amber}
          description="Check — review"
          icon={AlertTriangle}
        />
        <StatCard
          title="Red Signals"
          value={stats.red}
          description="Stop — pass"
          icon={ShieldCheck}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold mb-4">Signal Legend</h2>
          <TrafficLight autoCycle />
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Deals</h2>
            <Link
              href="/deals"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {allDeals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No deals yet. Create your first analysis.</p>
              <Button asChild className="mt-4">
                <Link href="/deals/new">Analyze a Deal</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {allDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  id={deal.id}
                  name={deal.name}
                  companyName={deal.companyName}
                  dealValue={deal.dealValue ?? undefined}
                  currency={deal.currency ?? "USD"}
                  status={deal.status}
                  signal={deal.overallSignal ?? undefined}
                  scorePercentage={deal.scorePercentage ?? undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
