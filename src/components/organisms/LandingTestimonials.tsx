"use client";

import { Container } from "@/components/templates/Container";
import { TESTIMONIALS } from "@/lib/testimonials";
import { cn } from "@/lib/utils";

/** Cards per loop half — wide enough to cover large viewports without gaps. */
const CARDS_PER_HALF = 14;

function buildMarqueeItems(items: readonly string[]) {
  const half: string[] = [];
  for (let i = 0; i < CARDS_PER_HALF; i++) {
    half.push(items[i % items.length]);
  }
  return [...half, ...half];
}

function TestimonialCard({ text }: { text: string }) {
  return (
    <article className="flex h-[11rem] w-[16.5rem] shrink-0 flex-col rounded-2xl border border-border/50 bg-card p-5 shadow-[0_10px_40px_-16px_rgba(220,38,38,0.12)] sm:h-[12rem] sm:w-[18rem] sm:p-6 md:w-[19.5rem]">
      <span
        aria-hidden
        className="font-serif text-3xl leading-none text-primary select-none sm:text-4xl"
      >
        &ldquo;
      </span>
      <p className="mt-2 flex-1 text-sm italic leading-relaxed text-zinc-700 line-clamp-4 sm:mt-3 sm:text-[15px]">
        {text}
      </p>
      <span
        aria-hidden
        className="mt-2 text-right font-serif text-3xl leading-none text-primary select-none sm:text-4xl"
      >
        &rdquo;
      </span>
    </article>
  );
}

function MarqueeRow({
  items,
  direction = "forward",
}: {
  items: readonly string[];
  direction?: "forward" | "backward";
}) {
  const loop = buildMarqueeItems(items);

  return (
    <div
      className={cn(
        "flex w-max gap-4 sm:gap-5",
        direction === "forward"
          ? "testimonial-marquee-forward motion-reduce:animate-none"
          : "testimonial-marquee-backward motion-reduce:animate-none"
      )}
    >
      {loop.map((text, index) => (
        <TestimonialCard
          key={`${direction}-${index}-${text.slice(0, 10)}`}
          text={text}
        />
      ))}
    </div>
  );
}

function MarqueeLane({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[11rem] sm:h-[12rem]">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent sm:w-24 md:w-32"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent sm:w-24 md:w-32"
        aria-hidden
      />
      <div className="h-full overflow-hidden">{children}</div>
    </div>
  );
}

const rowA = TESTIMONIALS.filter((_, i) => i % 2 === 0);
const rowB = TESTIMONIALS.filter((_, i) => i % 2 === 1);

export function LandingTestimonials() {
  return (
    <section
      id="testimonials"
      className="overflow-hidden border-t border-border/60 bg-gradient-to-b from-white via-signal-red-bg/30 to-background py-16 sm:py-24"
    >
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What people say about Mr. Red
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Real decisions. One color. Clear reasoning.
          </p>
        </div>
      </Container>

      <div className="mt-10 space-y-4 sm:mt-14 sm:space-y-5">
        <MarqueeLane>
          <MarqueeRow items={rowA} direction="forward" />
        </MarqueeLane>
        <MarqueeLane>
          <MarqueeRow items={rowB} direction="backward" />
        </MarqueeLane>
      </div>
    </section>
  );
}
