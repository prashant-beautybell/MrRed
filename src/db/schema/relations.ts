import { relations } from "drizzle-orm";
import { deals, dealFactors } from "./deals";
import { outcomes } from "./outcomes";
import { user } from "./auth";

export const dealsRelations = relations(deals, ({ one, many }) => ({
  createdBy: one(user, { fields: [deals.createdById], references: [user.id] }),
  factors: many(dealFactors),
  outcomes: many(outcomes),
}));

export const dealFactorsRelations = relations(dealFactors, ({ one }) => ({
  deal: one(deals, { fields: [dealFactors.dealId], references: [deals.id] }),
}));
