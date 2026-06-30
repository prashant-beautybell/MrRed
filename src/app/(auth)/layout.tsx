import { AuthHomeLink } from "@/components/molecules/AuthHomeLink";
import { AuthHeroPanel } from "@/components/templates/AuthHeroPanel";
import { Container } from "@/components/templates/Container";
import { InitialLoadOverlay } from "@/components/organisms/LoadOverlay";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <InitialLoadOverlay
        label="Loading Mr. Red"
        sessionKey="mrred-auth-initial"
      />
      <AuthHeroPanel />
      <main className="flex flex-1 items-center justify-center bg-background md:w-1/2 md:min-h-screen py-6 sm:py-10">
        <Container className="flex justify-center">
          <div className="w-full max-w-sm">
            <AuthHomeLink />
            {children}
          </div>
        </Container>
      </main>
    </div>
  );
}
