"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/templates/PageHeader";
import { Badge } from "@/components/atoms/Badge";
import { Spinner } from "@/components/atoms/Spinner";
import { Trophy, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  userId: string;
  userName?: string;
  totalDeals: number;
  correctPredictions: number;
  accuracy: number;
  greenDeals: number;
  amberDeals: number;
  redDeals: number;
  totalValue: number;
  rank?: number;
}

const rankIcons = [Trophy, Medal, Award];

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Leaderboard"
        description="Analyst rankings by deal volume, signal accuracy, and portfolio value"
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-dashed border-border text-muted-foreground">
          <p>Analyze deals to appear on the leaderboard.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium w-16">Rank</th>
                  <th className="text-left p-4 font-medium">Analyst</th>
                  <th className="text-left p-4 font-medium">Deals</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Accuracy</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Signals</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Portfolio</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => {
                  const RankIcon = rankIcons[i] ?? null;
                  return (
                    <tr
                      key={entry.userId}
                      className={cn(
                        "border-b border-border last:border-0",
                        i < 3 && "bg-muted/20"
                      )}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {RankIcon && (
                            <RankIcon
                              className={cn(
                                "h-4 w-4",
                                i === 0 && "text-signal-amber",
                                i === 1 && "text-muted-foreground",
                                i === 2 && "text-signal-amber/60"
                              )}
                            />
                          )}
                          <span className="font-bold">{i + 1}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium">
                        {entry.userName ?? "Unknown"}
                      </td>
                      <td className="p-4">{entry.totalDeals}</td>
                      <td className="p-4 hidden sm:table-cell">
                        {entry.accuracy > 0
                          ? `${entry.accuracy.toFixed(0)}%`
                          : "—"}
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex gap-1">
                          <Badge variant="green">{entry.greenDeals}</Badge>
                          <Badge variant="amber">{entry.amberDeals}</Badge>
                          <Badge variant="red">{entry.redDeals}</Badge>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        ${entry.totalValue.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
