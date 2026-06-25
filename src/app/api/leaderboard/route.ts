import { NextResponse } from "next/server";
import { db } from "@/db";
import { leaderboard, user, deals } from "@/db/schema";
import { getSession } from "@/lib/auth-server";
import { useLocalStore } from "@/lib/dev-auth";
import { devStore } from "@/lib/dev-store";
import { sql, desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (useLocalStore()) {
    return NextResponse.json(devStore.listLeaderboard());
  }

  try {
    const entries = await db
      .select({
        id: leaderboard.id,
        userId: leaderboard.userId,
        userName: user.name,
        userEmail: user.email,
        totalDeals: leaderboard.totalDeals,
        correctPredictions: leaderboard.correctPredictions,
        accuracy: leaderboard.accuracy,
        greenDeals: leaderboard.greenDeals,
        amberDeals: leaderboard.amberDeals,
        redDeals: leaderboard.redDeals,
        totalValue: leaderboard.totalValue,
        rank: leaderboard.rank,
      })
      .from(leaderboard)
      .leftJoin(user, sql`${leaderboard.userId} = ${user.id}`)
      .orderBy(desc(leaderboard.accuracy));

    if (entries.length === 0) {
      const dealStats = await db
        .select({
          userId: deals.createdById,
          userName: user.name,
          totalDeals: sql<number>`count(*)::int`,
          greenDeals: sql<number>`count(*) filter (where ${deals.overallSignal} = 'green')::int`,
          amberDeals: sql<number>`count(*) filter (where ${deals.overallSignal} = 'amber')::int`,
          redDeals: sql<number>`count(*) filter (where ${deals.overallSignal} = 'red')::int`,
          totalValue: sql<number>`coalesce(sum(${deals.dealValue}), 0)`,
        })
        .from(deals)
        .leftJoin(user, sql`${deals.createdById} = ${user.id}`)
        .groupBy(deals.createdById, user.name);

      return NextResponse.json(
        dealStats.map((s, i) => ({
          ...s,
          correctPredictions: 0,
          accuracy: 0,
          rank: i + 1,
        }))
      );
    }

    return NextResponse.json(entries);
  } catch {
    return NextResponse.json(devStore.listLeaderboard());
  }
}
