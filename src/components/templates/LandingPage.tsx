"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/templates/Container";
import { SiteFooter } from "@/components/templates/SiteFooter";
import { MrRedMascot } from "@/components/atoms/MrRedMascot";
import { MrRedWordmark } from "@/components/atoms/MrRedWordmark";
import { TrafficLight } from "@/components/organisms/TrafficLight";
import {
  ArrowRight,
  BookOpen,
  MessageSquare,
  Shield,
  Grid3x3,
  ScrollText,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const startHref =
  process.env.NEXT_PUBLIC_SKIP_AUTH === "true" ? "/dashboard" : "/signup";

const features = [
  {
    icon: MessageSquare,
    title: "Ask Mr. Red",
    description:
      "Chat through companies, stocks, and deals. Get structured research before you commit capital.",
    accent: "text-primary bg-signal-red-bg",
  },
  {
    icon: Shield,
    title: "Hard gate engine",
    description:
      "Non-negotiable checks on licenses, litigation, and sanctions. Critical fails override any score.",
    accent: "text-signal-red bg-signal-red-bg",
  },
  {
    icon: Grid3x3,
    title: "Scoring matrix",
    description:
      "Weighted factors across financials, compliance, and market position. Every deal gets a percentage.",
    accent: "text-signal-amber bg-signal-amber-bg",
  },
  {
    icon: BookOpen,
    title: "Rule register",
    description:
      "Your team's deal criteria in one place. Consistent logic from first look to final sign-off.",
    accent: "text-foreground bg-muted",
  },
  {
    icon: ScrollText,
    title: "Audit trail",
    description:
      "Full history of signals, overrides, and analysis runs. Nothing slips through undocumented.",
    accent: "text-foreground bg-muted",
  },
  {
    icon: BarChart3,
    title: "Outcome ledger",
    description:
      "Track predicted signals against real results. Improve accuracy deal by deal.",
    accent: "text-signal-green bg-signal-green-bg",
  },
];

const steps = [
  {
    step: "01",
    title: "Ask or upload",
    body: "Start a chat about a target or open a structured deal analysis with your known numbers.",
  },
  {
    step: "02",
    title: "Run the engine",
    body: "Mr. Red applies hard gates, scores factors, and returns red, amber, or green with reasoning.",
  },
  {
    step: "03",
    title: "Decide with confidence",
    body: "Walk away, dig deeper, or proceed. Every call is logged for your team and future deals.",
  },
];

function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <MrRedMascot size="sm" />
          <MrRedWordmark size="sm" showSwoosh={false} className="items-start" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#signals" className="hover:text-foreground transition-colors">
            Signals
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={startHref}>Get started</Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}

function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute top-1/2 -right-24 h-72 w-72 rounded-full bg-signal-amber/10 blur-3xl" />
        <div className="absolute bottom-0 -left-24 h-64 w-64 rounded-full bg-signal-green/10 blur-3xl" />
      </div>

      <Container className="relative pb-20 pt-12 sm:pb-28 sm:pt-16 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse" />
              Deal signal intelligence
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Know when to{" "}
              <span className="text-primary">stop</span>,{" "}
              <span className="text-signal-amber">check</span>, or{" "}
              <span className="text-signal-green">go</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground leading-relaxed">
              Mr. Red stress-tests companies and deals with hard gates, weighted
              scoring, and clear red-amber-green signals before you commit.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href={startHref}>
                  Start analyzing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "Background & financials",
                "License & compliance gates",
                "Audit-ready decisions",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-signal-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center gap-8">
            <div className="flex items-end justify-center gap-6 sm:gap-10">
              <MrRedMascot size="2xl" priority className="drop-shadow-sm" />
              <TrafficLight
                showLegend={false}
                autoCycle
                size="lg"
                className="pb-2"
              />
            </div>
            <MrRedWordmark size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function StatsStrip() {
  const stats = [
    { value: "3", label: "Signal states" },
    { value: "6+", label: "Analysis modules" },
    { value: "100%", label: "Gate traceability" },
  ];

  return (
    <section className="border-y border-border bg-card">
      <Container className="grid grid-cols-3 divide-x divide-border">
        {stats.map((stat) => (
          <div key={stat.label} className="py-8 text-center sm:py-10">
            <p className="text-3xl font-bold text-foreground sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </Container>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to vet a deal
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From first chat to signed outcome, Mr. Red keeps research structured
            and decisions defensible.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={cn(
                  "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl",
                  feature.accent
                )}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t border-border bg-zinc-50 py-20 sm:py-28"
    >
      <Container>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three steps from question to signal.
          </p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              <span className="text-5xl font-bold text-primary/15">
                {item.step}
              </span>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function SignalsSection() {
  const signals = [
    {
      signal: "red" as const,
      label: "Red",
      action: "Stop",
      body: "Critical gates failed or score too weak. Do not proceed until issues are resolved or you consciously pass.",
    },
    {
      signal: "amber" as const,
      label: "Amber",
      action: "Check",
      body: "Moderate risk. Review flagged factors, request more data, and stress-test assumptions before moving.",
    },
    {
      signal: "green" as const,
      label: "Green",
      action: "Go",
      body: "Strong profile with gates passed. Proceed with due diligence and document your thesis.",
    },
  ];

  return (
    <section id="signals" className="py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              One language for every deal
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              No more ambiguous takeaways. Every analysis resolves to a traffic
              light your whole team understands instantly.
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <TrafficLight autoCycle size="md" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {signals.map((item) => (
              <div
                key={item.signal}
                className={cn(
                  "rounded-2xl border p-5",
                  item.signal === "red" && "border-signal-red/25 bg-signal-red-bg",
                  item.signal === "amber" && "border-signal-amber/25 bg-signal-amber-bg",
                  item.signal === "green" && "border-signal-green/25 bg-signal-green-bg"
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "text-lg font-bold",
                      item.signal === "red" && "text-signal-red",
                      item.signal === "amber" && "text-signal-amber",
                      item.signal === "green" && "text-signal-green"
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    · {item.action}
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="border-t border-border bg-foreground py-20 text-background sm:py-24">
      <Container className="text-center">
        <MrRedMascot size="lg" className="mx-auto mb-6 opacity-95" />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to stress-test your next deal?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-background/70">
          Join teams using Mr. Red to research faster, gate harder, and decide
          with clarity.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            asChild
          >
            <Link href={startHref}>
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

function LandingFooter() {
  return <SiteFooter />;
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      <LandingNav />
      <main className="flex-1 w-full">
        <LandingHero />
        <StatsStrip />
        <FeaturesSection />
        <HowItWorksSection />
        <SignalsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
