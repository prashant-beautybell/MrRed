"use client";

import { Button } from "@/components/atoms/Button";
import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

const DEV_LOGGED_OUT_COOKIE = "mrred_dev_logged_out";

function setDevLoggedOut() {
  document.cookie = `${DEV_LOGGED_OUT_COOKIE}=1; path=/; max-age=86400; SameSite=Lax`;
}

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const isDevMode = process.env.NEXT_PUBLIC_SKIP_AUTH === "true";
  const userName =
    session?.user?.name ?? (isDevMode ? "Dev User" : undefined);
  const showActions = Boolean(userName) || isDevMode;

  const handleSignOut = async () => {
    if (isDevMode) {
      setDevLoggedOut();
      router.push("/login");
      router.refresh();
      return;
    }
    await signOut();
    router.push("/login");
    router.refresh();
  };

  if (!showActions) {
    return (
      <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8" />
    );
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b border-border bg-card/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 text-sm">
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{userName ?? "Dev User"}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
