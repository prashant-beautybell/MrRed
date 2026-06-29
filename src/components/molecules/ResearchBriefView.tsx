"use client";

import { ExternalLink, Star } from "lucide-react";
import type { ResearchBrief, ResearchProduct, Signal } from "@/lib/research/types";
import { cn } from "@/lib/utils";

const signalStyles: Record<
  Signal,
  { badge: string; ring: string; label: string }
> = {
  green: {
    badge: "bg-signal-green-bg text-signal-green border-signal-green/25",
    ring: "ring-signal-green/20",
    label: "🟢 Green pick",
  },
  amber: {
    badge: "bg-signal-amber-bg text-signal-amber border-signal-amber/25",
    ring: "ring-signal-amber/20",
    label: "🟡 Amber — situational",
  },
  red: {
    badge: "bg-signal-red-bg text-signal-red border-signal-red/25",
    ring: "ring-signal-red/20",
    label: "🔴 Red — skip",
  },
};

function VerdictBanner({ brief }: { brief: ResearchBrief }) {
  const signal = brief.verdict;
  const style = signalStyles[signal];

  return (
    <div
      className={cn(
        "rounded-xl border p-4 sm:p-5",
        style.badge,
        "border"
      )}
    >
      <p className="text-base font-bold tracking-tight">
        {signal === "green" ? "🟢 Green" : signal === "amber" ? "🟡 Amber" : "🔴 Red"}
      </p>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed opacity-95">
        {brief.verdictReasons.map((reason) => (
          <li key={reason} className="flex gap-2">
            <span className="shrink-0">•</span>
            <span
              dangerouslySetInnerHTML={{
                __html: reason.replace(
                  /\*\*([^*]+)\*\*/g,
                  "<strong class='font-semibold'>$1</strong>"
                ),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({
  product,
  isTopPick,
}: {
  product: ResearchProduct;
  isTopPick: boolean;
}) {
  const style = signalStyles[product.signal];

  return (
    <article
      className={cn(
        "rounded-xl border border-border/70 bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        isTopPick && "ring-2",
        isTopPick && style.ring
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
              style.badge
            )}
          >
            {product.badge}
          </span>
          {isTopPick && (
            <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              Mr. Red pick
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-foreground">
          <Star className="h-3.5 w-3.5 fill-signal-amber text-signal-amber" />
          {product.rating}
        </div>
      </div>

      <h4 className="font-semibold text-foreground leading-snug">{product.name}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{product.category}</p>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {[
          ["Price", product.price],
          ["Weight", product.weight],
          ["Battery", product.battery],
          ["Cut width", product.cutWidth],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg bg-muted/50 px-2.5 py-2"
          >
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="mt-0.5 font-semibold text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        {product.note}
      </p>

      <a
        href={product.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isTopPick
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border border-border bg-background hover:bg-muted text-foreground"
        )}
      >
        View on {product.retailer}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </article>
  );
}

export function ResearchBriefView({ brief }: { brief: ResearchBrief }) {
  const sorted = [...brief.products].sort((a, b) => {
    if (a.id === brief.topPickId) return -1;
    if (b.id === brief.topPickId) return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{brief.topic}</span>
        <span>
          {brief.sourcesChecked} sources checked · deep research
        </span>
      </div>

      <VerdictBanner brief={brief} />

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Researched options ({brief.products.length})
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {sorted.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isTopPick={product.id === brief.topPickId}
            />
          ))}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
        {brief.methodology} Prices and availability checked at research time —
        verify on retailer sites before buying.
      </p>
    </div>
  );
}
