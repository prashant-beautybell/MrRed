"use client";

import Link from "next/link";
import { Logo } from "@/components/atoms/Logo";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useChatSession } from "@/contexts/ChatSessionContext";
import { MrRedMascot } from "@/components/atoms/MrRedMascot";
import { ChatHistoryList } from "@/components/molecules/ChatHistoryList";
import { AppNavLinks } from "@/components/molecules/AppNavLinks";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function Sidebar({ mobileOpen, onMobileOpenChange }: SidebarProps) {
  const { newChat, hasMessages } = useChatSession();

  const closeMobile = () => onMobileOpenChange(false);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r border-border/60 bg-card/95 backdrop-blur-xl flex flex-col transition-transform lg:translate-x-0 lg:static lg:z-auto shadow-[4px_0_24px_-12px_rgba(0,0,0,0.08)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <Logo size="sm" />
          <button
            onClick={closeMobile}
            className="lg:hidden p-1 rounded-md hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0 p-3 gap-2">
          <button
            type="button"
            onClick={() => {
              newChat();
              closeMobile();
            }}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors shrink-0",
              "border border-dashed border-border text-muted-foreground",
              "hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
              hasMessages && "border-primary/30 bg-primary/5 text-primary"
            )}
          >
            <MrRedMascot size="xs" />
            New chat
          </button>

          <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1">
            <ChatHistoryList />
          </div>
        </div>

        <div className="lg:hidden border-t border-border p-3">
          <p className="mb-2 px-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Navigate
          </p>
          <AppNavLinks
            orientation="vertical"
            onNavigate={closeMobile}
          />
        </div>

        <div className="shrink-0 p-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-signal-green animate-pulse" />
            Signal Engine Active
          </div>
        </div>
      </aside>
    </>
  );
}
