"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNavItems } from "@/lib/nav-items";
import { cn } from "@/lib/utils";

interface AppNavLinksProps {
  className?: string;
  onNavigate?: () => void;
  orientation?: "horizontal" | "vertical";
}

export function AppNavLinks({
  className,
  onNavigate,
  orientation = "horizontal",
}: AppNavLinksProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        orientation === "vertical"
          ? "flex flex-col items-stretch gap-0.5"
          : "flex flex-wrap items-center justify-end gap-0.5",
        className
      )}
    >
      {appNavItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
