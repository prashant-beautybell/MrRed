"use client";

import { useState } from "react";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Header } from "@/components/organisms/Header";
import { AppMain } from "@/components/templates/AppMain";
import { InitialLoadOverlay } from "@/components/organisms/LoadOverlay";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <InitialLoadOverlay
        label="Loading dashboard"
        sessionKey="mrred-dashboard-initial"
      />
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileOpenChange={setMobileMenuOpen}
      />
      <div className="flex min-w-0 flex-1 flex-col w-full">
        <Header onMenuOpen={() => setMobileMenuOpen(true)} />
        <AppMain>{children}</AppMain>
      </div>
    </div>
  );
}
