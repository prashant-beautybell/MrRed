import type { Metadata } from "next";
import { LandingPage } from "@/components/templates/LandingPage";

export const metadata: Metadata = {
  title: "Mr. Red | Deal Signal Intelligence",
  description:
    "Stress-test companies and deals with hard gates, weighted scoring, and clear red, amber, or green signals.",
};

export default function HomePage() {
  return <LandingPage />;
}
