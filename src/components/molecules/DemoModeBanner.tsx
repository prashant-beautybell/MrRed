"use client";

import { Presentation } from "lucide-react";

export function DemoModeBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_DATA !== "true") {
    return null;
  }

  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-signal-amber/40 bg-signal-amber-bg px-4 py-3 text-sm">
      <Presentation className="h-4 w-4 text-signal-amber shrink-0" />
      <p className="text-foreground">
        <span className="font-medium">Presentation mode</span>
        <span className="text-muted-foreground">
          . Showing sample deals and data. Set{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            DEMO_DATA=false
          </code>{" "}
          in .env.local to turn off.
        </span>
      </p>
    </div>
  );
}
