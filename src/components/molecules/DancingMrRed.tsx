"use client";

import { MrRedMascot } from "@/components/atoms/MrRedMascot";
import { cn } from "@/lib/utils";

interface DancingMrRedProps {
  className?: string;
}

export function DancingMrRed({ className }: DancingMrRedProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed z-30 bottom-2 right-2 sm:bottom-5 sm:right-6",
        className
      )}
      aria-hidden
    >
      <div className="mrred-dance">
        <MrRedMascot size="lg" className="sm:hidden" />
        <MrRedMascot size="xl" className="hidden sm:block" />
      </div>
    </div>
  );
}
