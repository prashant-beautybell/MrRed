"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/templates/Container";
import { SiteFooter } from "@/components/templates/SiteFooter";
import { MrRedMascot } from "@/components/atoms/MrRedMascot";
import { MrRedWordmark } from "@/components/atoms/MrRedWordmark";
import { LandingPlatformSection } from "@/components/organisms/LandingPlatformSection";
import { LandingTestimonials } from "@/components/organisms/LandingTestimonials";
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
    title: "Ask anything",
    description:
      "Deals, hires, hotels, flights, local services, or a surprise night out — chat naturally and get one clear verdict.",
    accent: "text-primary bg-signal-red-bg",
  },
  {
    icon: Shield,
    title: "People & trust checks",
    description:
      "Vet employees, contractors, vendors, and partners — background patterns, references, and trust signals in plain language.",
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
    title: "Ask anything",
    body: "A deal, a hire, a hotel, flights on a budget, or “surprise me” — chat like you would with a sharp friend.",
  },
  {
    step: "02",
    title: "Get one color",
    body: "Mr. Red returns a single red, amber, or green verdict with clear reasoning — no tables, no noise.",
  },
  {
    step: "03",
    title: "Act with confidence",
    body: "Walk away, dig deeper, or go — whether it's capital, trust, or your Saturday plans.",
  },
];

function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 premium-surface">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <MrRedMascot size="sm" />
          <MrRedWordmark size="sm" showSwoosh={false} className="items-start" />
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#platform" className="hover:text-foreground transition-colors">
            Platform
          </a>
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#signals" className="hover:text-foreground transition-colors">
            Signals
          </a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">
            Stories
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
    <section className="relative overflow-hidden border-b border-border/40">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(220,38,38,0.12),transparent)]" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-signal-amber/8 blur-3xl" />
        <div className="absolute bottom-0 -left-32 h-80 w-80 rounded-full bg-signal-green/8 blur-3xl" />
      </div>

      <Container className="relative pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse" />
              Your everyday companion
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              One color.{" "}
              <span className="text-primary">Clear reasoning.</span>{" "}
              <span className="text-signal-amber">Any decision.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground leading-relaxed">
              Mr. Red vets businesses and people, finds the best hotel for the
              buck, plans trips on your budget, and stress-tests investments —
              then gives a single red, amber, or green call with why.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                className="h-12 px-7 shadow-[0_8px_24px_-8px_rgba(220,38,38,0.55)]"
                asChild
              >
                <Link href={startHref}>
                  Start analyzing
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-border/80 bg-white/60 backdrop-blur-sm"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "Hire & trust checks",
                "Deals & investments",
                "Travel & best value",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-signal-green shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-center gap-8">
            <div className="relative flex items-end justify-center gap-6 sm:gap-10">
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl scale-110" />
              <MrRedMascot size="2xl" priority className="drop-shadow-lg" />
              <TrafficLight
                showLegend={false}
                autoCycle
                size="lg"
                className="pb-2 drop-shadow-sm"
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
    <section className="border-y border-border/60 bg-gradient-to-b from-white to-muted/30">
      <Container className="grid grid-cols-3 divide-x divide-border/60">
        {stats.map((stat) => (
          <div key={stat.label} className="py-10 text-center sm:py-12">
            <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1.5 text-sm font-medium text-muted-foreground">
              {stat.label}
            </p>
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
            Built for decisions big and small
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From closing a deal to booking a flight or picking a barber — one
            language, one verdict, clear reasoning.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border/60 bg-card p-6 premium-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_16px_40px_-16px_rgba(220,38,38,0.2)]"
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
      className="border-t border-border/60 bg-muted/40 py-20 sm:py-28"
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
              One language for every call
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              No verdict tables — just red, amber, or green for your specific
              question, plus the reasoning behind it.
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
    <section className="relative overflow-hidden border-t border-border py-20 sm:py-24">
      <div
        className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-primary/40"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,rgba(220,38,38,0.5),transparent_50%)]"
        aria-hidden
      />
      <Container className="relative text-center text-white">
        <MrRedMascot size="lg" className="mx-auto mb-6 opacity-95 drop-shadow-lg" />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready for your next decision?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
          Deals, people, travel, surprises — ask Mr. Red and get one color with
          why.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button
            size="lg"
            className="h-12 bg-primary px-7 shadow-[0_8px_32px_-8px_rgba(220,38,38,0.7)] hover:bg-primary/90 text-primary-foreground"
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
            className="h-12 border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white"
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(254,242,242,0.5),transparent_55%)] flex flex-col w-full">
      <LandingNav />
      <main className="flex-1 w-full">
        <LandingHero />
        <StatsStrip />
        <LandingPlatformSection />
        <FeaturesSection />
        <HowItWorksSection />
        <LandingTestimonials />
        <SignalsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
