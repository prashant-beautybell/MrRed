import { Container } from "@/components/templates/Container";
import { PageHeader } from "@/components/templates/PageHeader";

export default function TermsPage() {
  return (
    <Container className="py-12 sm:py-16">
      <PageHeader
        title="Terms & Conditions"
        description="Terms of use for Mr. Red."
      />
      <div className="text-sm text-muted-foreground space-y-4 leading-relaxed max-w-3xl">
        <p>
          Mr. Red provides research and signal outputs for informational
          purposes. It is not investment, legal, or financial advice.
        </p>
        <p>
          Mr Red pulls data from different sources and algorithms and can make
          mistakes. You are responsible for verifying responses and making
          your own decisions.
        </p>
        <p>
          By using Mr. Red you agree to use the service lawfully and to keep
          your account credentials secure.
        </p>
      </div>
    </Container>
  );
}
