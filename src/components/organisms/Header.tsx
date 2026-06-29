"use client";

import { Button } from "@/components/atoms/Button";
import { AppNavLinks } from "@/components/molecules/AppNavLinks";
import { Container } from "@/components/templates/Container";
import { signOut, useSession } from "@/lib/auth-client";
import { LogOut, Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";

const DEV_LOGGED_OUT_COOKIE = "mrred_dev_logged_out";

function setDevLoggedOut() {
  document.cookie = `${DEV_LOGGED_OUT_COOKIE}=1; path=/; max-age=86400; SameSite=Lax`;
}

interface HeaderProps {
  onMenuOpen?: () => void;
}

export function Header({ onMenuOpen }: HeaderProps) {
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

  return (
    <header className="sticky top-0 z-30 w-full shrink-0 border-b border-border/50 premium-surface">
      <Container fluid className="flex min-h-14 items-center gap-3 py-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 shrink-0 lg:hidden"
          onClick={onMenuOpen}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <nav className="hidden min-w-0 flex-1 items-center justify-end lg:flex">
          <AppNavLinks className="gap-2 xl:gap-3" />
        </nav>

        {showActions && (
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 lg:ml-0">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{userName ?? "Dev User"}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        )}
      </Container>
    </header>
  );
}
