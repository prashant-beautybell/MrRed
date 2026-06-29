import { tryGenerateResearchReply } from "@/lib/research/generate-research";
import { isBarberQuery } from "@/lib/research/strimmer-catalog";

export const SUGGESTION_POOL = [
  "Find me a cordless strimmer for a medium garden — pull real products with links and your verdict.",
  "Is this $50k angel check into a pre-revenue SaaS worth it? Give me one clear signal and why.",
  "Find the best hotel for the buck in Barcelona for 4 nights in May — budget $900 total.",
  "Book me flights NYC → Lisbon, leaving March 14, back March 21, under $650 round trip.",
  "Who's the best barber or trimmer near downtown Austin with consistent reviews under $45?",
  "Surprise me — plan a Saturday in Chicago: one great lunch spot, one experience, and one hidden gem.",
  "Is it a good idea to buy these stocks trending around $160? Company history, hype vs fundamentals, one verdict.",
  "A business is selling at a 30% discount to peers. What's wrong, and is the discount justified?",
  "I'm interviewing a CFO candidate. Run a trust check — tenure patterns, regulatory history, reputation.",
  "Compare three hotels in Tokyo for cherry blossom season — value, location, and cleanliness signal.",
  "Should I put money into this food-truck franchise? Margins, lease risk, and license status — one color only.",
  "Surprise me with a weekend trip idea from Boston under $800 all-in for two people.",
  "Best trimmers for a fade in Brooklyn — who’s actually worth it vs overhyped?",
  "This contractor wants 40% upfront. Trustworthy or walk away?",
  "Flights to Mexico City for a wedding April 3–7 — cheapest reliable options in my budget.",
  "Break down Acme Corp: revenue, debt, licenses — give me amber, green, or red and why.",
  "Is this Airbnb host legit? Review patterns, response history, and anything that feels off.",
  "Help me pick a hotel in Lisbon vs Porto for a work trip — best bang for buck with fast Wi‑Fi.",
  "NovaPharma Series C — FDA risk, cash runway, one signal call.",
  "Surprise me: date night in Seattle under $120 including dinner and one activity.",
  "Should I trust this vendor with our customer data? Security posture and litigation check.",
  "Investing in a friend's restaurant — emotional bias aside, is the business actually green?",
  "Find me a reliable electrician in Denver — licensed, fair pricing, no complaint patterns.",
  "Why is Meridian Freight trending up? Ownership, margins, litigation — one verdict.",
  "Weekend in Napa on $600 — where to stay and eat without getting ripped off.",
  "Is insider selling at a discount always bad? One color for my specific situation.",
  "Best flight + hotel bundle to Miami for spring break, family of four, cap $2,400.",
  "Vet this nanny before we give house keys — background signals I shouldn't skip.",
  "Harbor Retail down 40% YTD — value play or red? Reasoning only, no lecture.",
  "Surprise me with something fun to do tonight in Austin I probably haven't tried.",
];

export function pickSuggestions(
  count: number,
  current: string[] = []
): string[] {
  const available = SUGGESTION_POOL.filter((s) => !current.includes(s));
  const pool = available.length >= count ? available : [...SUGGESTION_POOL];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

type Signal = "green" | "amber" | "red";

const SIGNAL_HEADLINE: Record<Signal, string> = {
  green: "🟢 **Green**",
  amber: "🟡 **Amber**",
  red: "🔴 **Red**",
};

function verdict(signal: Signal, reasons: string[]): string {
  return `${SIGNAL_HEADLINE[signal]}\n\n${reasons.map((r) => `• ${r}`).join("\n")}`;
}

function pickSignal(seed: string): Signal {
  const n = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const signals: Signal[] = ["green", "amber", "red", "amber", "amber"];
  return signals[n % signals.length];
}

export function generateMockReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  const research = tryGenerateResearchReply(userMessage);
  if (research) return research;

  if (lower.includes("[attached:")) {
    const names =
      userMessage.match(/\[Attached: ([^\]]+)\]/i)?.[1] ?? "your file(s)";
    return verdict("amber", [
      `Reviewing **${names}** — numbers and claims need cross-checking against filings and third-party sources before a green call.`,
      "No critical hard-stop flags jumped out on first pass, but earn-out language and customer concentration need a closer read.",
      "Reply with the target name or your main question and I'll tighten this to a single final color.",
    ]);
  }

  if (
    lower.includes("surprise me") ||
    lower.includes("surprise") ||
    lower.includes("hidden gem")
  ) {
    return verdict("green", [
      "**Saturday pick:** Start at a highly rated coffee roastery in the arts district, then a walking food tour ($45pp) — strong value and 4.8★ consistency.",
      "Afternoon: small contemporary gallery with free entry; evening: reservations at a chef-led bistro with a $35 prix fixe (book 48h ahead).",
      "Total rough spend ~$120–150/person. Want me to tailor this to your city, budget, or vibe?",
    ]);
  }

  if (
    lower.includes("employee") ||
    lower.includes("hire") ||
    lower.includes("candidate") ||
    lower.includes("trustworthy") ||
    lower.includes("nanny") ||
    lower.includes("contractor") ||
    lower.includes("vendor") ||
    lower.includes("reference check") ||
    lower.includes("background")
  ) {
    if (lower.includes("company") || lower.includes("corp") || lower.includes("revenue")) {
      // fall through to company background handler below
    } else {
      return verdict(
        lower.includes("40%") || lower.includes("upfront") ? "red" : "amber",
        lower.includes("40%") || lower.includes("upfront")
          ? [
              "Large upfront payment requests without bonded milestones are a common trust failure pattern — pause before sending money.",
              "License verification and complaint history should be clean; if you can't verify both independently, don't proceed.",
              "Get a written scope, staged payments, and at least two recent references you call yourself.",
            ]
          : [
              "Employment timeline and role claims mostly align, but reference depth is thin — verify two managers directly, not just HR.",
              "No sanctions or major litigation surfaced in public records, yet social/review signals are mixed — worth one more diligence pass.",
              "Proceed only after a structured reference call and a short paid trial or probation checkpoint.",
            ]
      );
    }
  }

  if (
    lower.includes("hotel") ||
    lower.includes("flight") ||
    lower.includes("travel") ||
    lower.includes("trip") ||
    lower.includes("book me") ||
    lower.includes("airbnb") ||
    lower.includes("weekend in") ||
    lower.includes("stay in")
  ) {
    return verdict("green", [
      "Best value pick balances location, recent review velocity, and total cost — not just the lowest nightly rate.",
      "For flights: mid-week departures and one-stop options often beat nonstop on price without awful layovers; set price alerts 6–8 weeks out.",
      "For hotels: prioritize last-90-day reviews mentioning cleanliness and noise; free cancellation beats a $15/night saving if plans might shift.",
    ]);
  }

  if (
    (lower.includes("barber") ||
      lower.includes("haircut") ||
      lower.includes("fade") ||
      lower.includes("salon")) &&
    isBarberQuery(userMessage)
  ) {
    return verdict("green", [
      "Top pick in your area: consistent 4.7★+ over 200+ reviews, same barber retention (low staff churn), and transparent pricing on the menu.",
      "Book off-peak (Tue–Thu morning) for better attention and occasional walk-in slots.",
      "Skip places with surge pricing or heavy upsell on products — skill and hygiene matter more than the chair aesthetic.",
    ]);
  }

  if (
    lower.includes("160") ||
    lower.includes("stock") ||
    lower.includes("trending") ||
    lower.includes("invest") ||
    lower.includes("acquisition") ||
    lower.includes("ebitda") ||
    lower.includes("franchise") ||
    lower.includes("angel")
  ) {
    const signal = lower.includes("negative") || lower.includes("pre-revenue")
      ? "red"
      : lower.includes("discount") || lower.includes("churn")
        ? "amber"
        : pickSignal(userMessage);

    return verdict(signal, [
      signal === "green"
        ? "Fundamentals and momentum align — gates on licenses, litigation, and leverage are not flashing critical."
        : signal === "amber"
          ? "Story is interesting but key risks (margins, churn, or hype vs revenue) need resolution before sizing up."
          : "Critical risk stack — weak unit economics, compliance gaps, or hype far ahead of proof; don't commit capital yet.",
      "Cross-check the last two earnings releases and insider activity — momentum alone isn't a green light.",
      "Share the ticker or company name if you want a tighter read tied to real numbers.",
    ]);
  }

  if (
    lower.includes("discount") ||
    lower.includes("selling cheap") ||
    lower.includes("what's wrong")
  ) {
    return verdict("amber", [
      "The discount usually maps to balance-sheet stress, customer concentration, or a compliance overhang — not always a bargain.",
      "Price is only green if licenses are valid, litigation is contained, and margins aren't in structural decline.",
      "Name the target and I'll narrow this to one final color with specific drivers.",
    ]);
  }

  if (
    lower.includes("history") ||
    (lower.includes("background") &&
      (lower.includes("company") || lower.includes("corp")))
  ) {
    return verdict("amber", [
      "Cap table and revenue trajectory look directionally fine, but compliance score and litigation docket need manual verification.",
      "Management tenure is a plus; market-share claims should be triangulated against third-party data before a green call.",
      "Drop the company name for a single-color verdict with the top two factors that would flip it red or green.",
    ]);
  }

  if (
    lower.includes("green") ||
    lower.includes("amber") ||
    lower.includes("red") ||
    lower.includes("signal")
  ) {
    const signal = pickSignal(userMessage);
    return verdict(signal, [
      signal === "green"
        ? "Profile clears the bar — no critical gate failures and risk factors are manageable with normal diligence."
        : signal === "amber"
          ? "Mixed picture: some strengths, but flagged areas need a deeper look before you commit time or money."
          : "Stop line — critical issues or failed gates; resolve or pass unless you consciously accept the risk.",
      "This is one color for your question — not a generic scale. Ask about a specific person, business, or trip for a tighter call.",
    ]);
  }

  return verdict("amber", [
    "I can research people, businesses, travel, services, and everyday decisions — then give **one** color and the reasoning behind it.",
    "No verdict tables — just red, amber, or green plus why, so you can act fast.",
    "Add a name, budget, dates, or upload a doc and I'll sharpen this to a single final signal.",
  ]);
}
