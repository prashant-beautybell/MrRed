"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/atoms/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Grid3x3,
  Shield,
  Trophy,
  ScrollText,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deals", label: "Deals", icon: Briefcase },
  { href: "/rules", label: "Rule Register", icon: BookOpen },
  { href: "/scoring", label: "Scoring Matrix", icon: Grid3x3 },
  { href: "/gates", label: "Hard Gates", icon: Shield },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/audit", label: "Audit Trail", icon: ScrollText },
  { href: "/outcomes", label: "Outcome Ledger", icon: ClipboardList },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-card border border-border p-2 lg:hidden shadow-sm"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col transition-transform lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Logo size="sm" showImage={false} />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavContent />
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-signal-green animate-pulse" />
            Signal Engine Active
          </div>
        </div>
      </aside>
    </>
  );
}
