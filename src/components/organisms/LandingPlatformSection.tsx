import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { Container } from "@/components/templates/Container";
import { PLATFORM_USE_CASES } from "@/lib/platform-use-cases";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const startHref =
  process.env.NEXT_PUBLIC_SKIP_AUTH === "true" ? "/dashboard" : "/signup";

const signalDot = {
  red: "bg-signal-red",
  amber: "bg-signal-amber",
  green: "bg-signal-green",
} as const;

function UseCaseCard({
  title,
  description,
  image,
  imageAlt,
  signal,
}: (typeof PLATFORM_USE_CASES)[number]) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card premium-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
          aria-hidden
        />
        <span
          className={cn(
            "absolute left-4 top-4 h-2.5 w-2.5 rounded-full ring-2 ring-white/80",
            signalDot[signal]
          )}
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {description}
        </p>
      </div>
    </article>
  );
}

export function LandingPlatformSection() {
  return (
    <section
      id="platform"
      className="border-t border-border/60 bg-gradient-to-b from-background via-white to-muted/30 py-20 sm:py-28"
    >
      <Container>
        <div className="grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              The platform
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              One companion for work, money, and life
            </h2>
          </div>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Mr. Red is not another search box. You ask in plain language, it
            researches the real world, and you get one red, amber, or green call
            with reasoning you can act on.
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap gap-4 text-sm text-muted-foreground sm:mt-12">
          {[
            "Restaurants and local picks",
            "Hotels and flights",
            "Investments and deals",
            "Vendors and contracts",
            "Hires and partners",
            "Products worth buying",
          ].map((item) => (
            <li
              key={item}
              className="rounded-full border border-border/70 bg-white/80 px-4 py-1.5"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:mt-14">
          {PLATFORM_USE_CASES.map((useCase) => (
            <UseCaseCard key={useCase.id} {...useCase} />
          ))}
        </div>

        <div className="mt-16 grid items-center gap-8 rounded-2xl border border-primary/15 bg-signal-red-bg/50 p-8 sm:mt-20 sm:grid-cols-[1fr_auto] sm:gap-10 sm:p-10">
          <div>
            <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ask once. Get one color. Move on.
            </h3>
            <p className="mt-3 max-w-xl text-muted-foreground sm:text-lg">
              The same loop for a dinner reservation or a seven figure deal:
              question, research, verdict.
            </p>
          </div>
          <Button size="lg" className="h-12 w-full shrink-0 px-7 sm:w-auto" asChild>
            <Link href={startHref}>
              Try Mr. Red free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
