"use client";

import { MrRedMascot } from "@/components/atoms/MrRedMascot";
import { MrRedWordmark } from "@/components/atoms/MrRedWordmark";
import { TrafficLight } from "@/components/organisms/TrafficLight";

export function AuthHeroPanel() {
  return (
    <aside className="relative flex w-full md:w-1/2 md:min-h-screen shrink-0 items-center justify-center bg-zinc-50 border-b md:border-b-0 md:border-r border-border">
      <div className="flex w-full flex-col items-center justify-center gap-10 px-6 py-10 sm:px-10 sm:py-14 md:min-h-screen md:py-16">
        <div className="flex items-end justify-center gap-6 sm:gap-10 lg:gap-12">
          <MrRedMascot size="hero" priority className="shrink-0" />
          <TrafficLight
            showLegend={false}
            autoCycle
            size="lg"
            className="shrink-0 pb-2 sm:pb-3"
          />
        </div>
        <MrRedWordmark size="hero" />
      </div>
    </aside>
  );
}
