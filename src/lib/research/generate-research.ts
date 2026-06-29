import {
  buildStrimmerResearch,
  isBarberQuery,
  isProductResearchQuery,
} from "./strimmer-catalog";
import { serializeResearchBrief } from "./types";

export function tryGenerateResearchReply(userMessage: string): string | null {
  if (isBarberQuery(userMessage)) return null;

  if (isProductResearchQuery(userMessage)) {
    const brief = buildStrimmerResearch(userMessage);
    return serializeResearchBrief(brief);
  }

  return null;
}
