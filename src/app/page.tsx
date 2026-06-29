import type { Metadata } from "next";
import { LandingPage } from "@/components/templates/LandingPage";

export const metadata: Metadata = {
  title: "Mr. Red | Your Everyday Decision Companion",
  description:
    "Vet people and businesses, plan travel, find the best value, and get one clear red, amber, or green call — with reasoning.",
};

export default function HomePage() {
  return <LandingPage />;
}
