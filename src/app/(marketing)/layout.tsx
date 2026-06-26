import Link from "next/link";
import { Container } from "@/components/templates/Container";
import { SiteFooter } from "@/components/templates/SiteFooter";
import { MrRedMascot } from "@/components/atoms/MrRedMascot";
import { MrRedWordmark } from "@/components/atoms/MrRedWordmark";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <header className="w-full border-b border-border bg-card/80">
        <Container className="flex h-14 items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <MrRedMascot size="xs" />
            <MrRedWordmark size="sm" showSwoosh={false} className="items-start" />
          </Link>
          <Link
            href="/"
            className="ml-auto text-sm text-muted-foreground hover:text-foreground"
          >
            Back to home
          </Link>
        </Container>
      </header>
      <main className="flex-1 w-full">{children}</main>
      <SiteFooter />
    </div>
  );
}
