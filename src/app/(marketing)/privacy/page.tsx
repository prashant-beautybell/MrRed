import { Container } from "@/components/templates/Container";
import { PageHeader } from "@/components/templates/PageHeader";

export default function PrivacyPage() {
  return (
    <Container className="py-12 sm:py-16">
      <PageHeader
        title="Privacy Policy"
        description="How Mr. Red handles your data."
      />
      <div className="text-sm text-muted-foreground space-y-4 leading-relaxed max-w-3xl">
        <p>
          Mr. Red stores account information, chat history, and deal analyses
          you create to provide the service. We do not sell your personal data.
        </p>
        <p>
          Chat content may be processed to generate responses. In production,
          data is stored in your organization&apos;s database with access
          limited to authenticated users.
        </p>
        <p>
          For questions about privacy, contact your administrator or the team
          that deployed your Mr. Red instance.
        </p>
      </div>
    </Container>
  );
}
