import { Sidebar } from "@/components/organisms/Sidebar";
import { Header } from "@/components/organisms/Header";
import { Container } from "@/components/templates/Container";
import { DemoModeBanner } from "@/components/molecules/DemoModeBanner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 lg:ml-0">
        <Header />
        <main className="flex-1 py-6 sm:py-8">
          <Container>
            <DemoModeBanner />
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
}
