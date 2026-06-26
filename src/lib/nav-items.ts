import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Briefcase,
  BookOpen,
  Grid3x3,
  Shield,
  Trophy,
  ScrollText,
  ClipboardList,
} from "lucide-react";

export interface AppNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const appNavItems: AppNavItem[] = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/deals", label: "Deals", icon: Briefcase },
  { href: "/rules", label: "Rule Register", icon: BookOpen },
  { href: "/scoring", label: "Scoring Matrix", icon: Grid3x3 },
  { href: "/gates", label: "Hard Gates", icon: Shield },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/audit", label: "Audit Trail", icon: ScrollText },
  { href: "/outcomes", label: "Outcome Ledger", icon: ClipboardList },
];
