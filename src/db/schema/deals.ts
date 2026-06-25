import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const signalEnum = pgEnum("signal", ["red", "amber", "green"]);
export const dealStatusEnum = pgEnum("deal_status", [
  "draft",
  "analyzing",
  "review",
  "approved",
  "rejected",
  "closed",
]);
export const factorCategoryEnum = pgEnum("factor_category", [
  "company",
  "financial",
  "license",
  "legal",
  "market",
  "operational",
  "reputation",
]);

export const deals = pgTable("deals", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  companyName: text("company_name").notNull(),
  industry: text("industry"),
  description: text("description"),
  dealValue: real("deal_value"),
  currency: text("currency").default("USD"),
  status: dealStatusEnum("status").notNull().default("draft"),
  overallSignal: signalEnum("overall_signal"),
  totalScore: real("total_score"),
  maxScore: real("max_score"),
  scorePercentage: real("score_percentage"),
  recommendation: text("recommendation"),
  analysisData: jsonb("analysis_data"),
  analyzedAt: timestamp("analyzed_at"),
  createdById: text("created_by_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const dealFactors = pgTable("deal_factors", {
  id: text("id").primaryKey(),
  dealId: text("deal_id").notNull(),
  name: text("name").notNull(),
  category: factorCategoryEnum("category").notNull(),
  value: text("value"),
  score: real("score"),
  maxScore: real("max_score").notNull().default(10),
  weight: real("weight").notNull().default(1),
  signal: signalEnum("signal"),
  source: text("source"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
