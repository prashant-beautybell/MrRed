import Link from "next/link";
import { Container } from "@/components/templates/Container";
import { MrRedMascot } from "@/components/atoms/MrRedMascot";
import { MrRedWordmark } from "@/components/atoms/MrRedWordmark";

const footerLinks = {
  product: [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#signals", label: "Signals" },
    { href: "/dashboard", label: "Open app" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
  account: [
    { href: "/login", label: "Sign in" },
    { href: "/signup", label: "Create account" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <MrRedMascot size="sm" />
              <MrRedWordmark size="sm" showSwoosh={false} className="items-start" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Deal signal intelligence with hard gates, weighted scoring, and
              clear red, amber, or green outcomes.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Account</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Mr. Red. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground max-w-xl">
            Mr Red analyzes background, financials, licenses & gates. Not
            investment advice. Please double-check responses.
          </p>
        </div>
      </Container>
    </footer>
  );
}
