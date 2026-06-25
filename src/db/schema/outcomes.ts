import {
  pgTable,
  text,
  timestamp,
  real,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { deals, signalEnum } from "./deals";
import { user } from "./auth";

export const outcomes = pgTable("outcomes", {
  id: text("id").primaryKey(),
  dealId: text("deal_id")
    .notNull()
    .references(() => deals.id, { onDelete: "cascade" }),
  predictedSignal: signalEnum("predicted_signal").notNull(),
  actualOutcome: text("actual_outcome").notNull(),
  wasCorrect: boolean("was_correct"),
  finalValue: real("final_value"),
  roi: real("roi"),
  notes: text("notes"),
  recordedById: text("recorded_by_id").references(() => user.id),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const outcomesRelations = relations(outcomes, ({ one }) => ({
  deal: one(deals, { fields: [outcomes.dealId], references: [deals.id] }),
  recordedBy: one(user, {
    fields: [outcomes.recordedById],
    references: [user.id],
  }),
}));

export const leaderboard = pgTable("leaderboard", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  totalDeals: integer("total_deals").notNull().default(0),
  correctPredictions: integer("correct_predictions").notNull().default(0),
  accuracy: real("accuracy").notNull().default(0),
  greenDeals: integer("green_deals").notNull().default(0),
  amberDeals: integer("amber_deals").notNull().default(0),
  redDeals: integer("red_deals").notNull().default(0),
  totalValue: real("total_value").notNull().default(0),
  rank: integer("rank"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const leaderboardRelations = relations(leaderboard, ({ one }) => ({
  user: one(user, { fields: [leaderboard.userId], references: [user.id] }),
}));
