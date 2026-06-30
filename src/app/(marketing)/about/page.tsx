import { Container } from "@/components/templates/Container";
import { PageHeader } from "@/components/templates/PageHeader";
import Link from "next/link";

export default function AboutPage() {
  return (
    <Container className="py-12 sm:py-16">
      <PageHeader
        title="About Mr. Red"
        description="Deal signal intelligence for teams who need clarity before they commit."
      />
      <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground space-y-4">
        <p>
          Mr. Red is your everyday decision companion. Vet people and
          businesses, plan travel, find value, and get a single red, amber, or
          green call with clear reasoning.
        </p>
        <p>
          <Link href="/dashboard" className="text-primary hover:underline">
            Open the app
          </Link>{" "}
          to start a chat or run a structured deal analysis.
        </p>
      </div>
    </Container>
  );
}
