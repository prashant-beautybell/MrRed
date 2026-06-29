export type Signal = "green" | "amber" | "red";

export interface ResearchProduct {
  id: string;
  badge: string;
  name: string;
  rating: number;
  category: string;
  price: string;
  weight: string;
  battery: string;
  cutWidth: string;
  url: string;
  retailer: string;
  signal: Signal;
  note: string;
}

export interface ResearchBrief {
  topic: string;
  researchedAt: string;
  sourcesChecked: number;
  verdict: Signal;
  verdictReasons: string[];
  topPickId: string;
  products: ResearchProduct[];
  methodology: string;
}

export const RESEARCH_PREFIX = "__MRRED_RESEARCH__";

export function serializeResearchBrief(brief: ResearchBrief): string {
  return `${RESEARCH_PREFIX}${JSON.stringify(brief)}`;
}

export function parseResearchBrief(
  content: string
): ResearchBrief | null {
  if (!content.startsWith(RESEARCH_PREFIX)) return null;
  try {
    return JSON.parse(content.slice(RESEARCH_PREFIX.length)) as ResearchBrief;
  } catch {
    return null;
  }
}

export function isResearchContent(content: string): boolean {
  return content.startsWith(RESEARCH_PREFIX);
}
