import { Suspense } from "react";
import { AppLayout } from "@/components/templates/AppLayout";
import { ChatSessionProvider } from "@/contexts/ChatSessionContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <ChatSessionProvider>
        <AppLayout>{children}</AppLayout>
      </ChatSessionProvider>
    </Suspense>
  );
}
