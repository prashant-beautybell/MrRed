"use client";

import { usePathname } from "next/navigation";
import { Container } from "@/components/templates/Container";
import { DemoModeBanner } from "@/components/molecules/DemoModeBanner";
import { cn } from "@/lib/utils";

export function AppMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isChatHome = pathname === "/dashboard";

  return (
    <main className={cn("flex-1 w-full", isChatHome ? "py-0" : "py-6 sm:py-8")}>
      <Container fluid={isChatHome}>
        {!isChatHome && <DemoModeBanner />}
        {children}
      </Container>
    </main>
  );
}
