"use client";

import { cn } from "@/lib/utils";

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
  variant?: "card" | "pill" | "stacked";
  className?: string;
}

function shortLabel(text: string) {
  const trimmed = text.trim();
  if (trimmed.length <= 56) return trimmed;
  return `${trimmed.slice(0, 53)}...`;
}

export function SuggestionChip({
  text,
  onClick,
  variant = "card",
  className,
}: SuggestionChipProps) {
  if (variant === "stacked") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={text}
        className={cn(
          "inline-flex w-fit max-w-full items-start gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-left text-foreground shadow-sm",
          "hover:border-primary/35 hover:bg-primary/5 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
        <span className="leading-snug">{text}</span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={text}
        className={cn(
          "inline-flex w-fit max-w-[min(100%,20rem)] items-center gap-2 rounded-full border border-border/70 bg-white/90 px-4 py-2.5 text-sm text-foreground",
          "shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]",
          "hover:border-primary/30 hover:bg-white hover:shadow-[0_4px_16px_-4px_rgba(220,38,38,0.15)] transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
        <span className="truncate text-left">{shortLabel(text)}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group text-left rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm",
        "hover:border-primary/40 hover:bg-primary/5 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <span className="flex gap-2">
        <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" />
        <span className="line-clamp-3 leading-snug">{text}</span>
      </span>
    </button>
  );
}
