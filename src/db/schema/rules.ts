import {
  pgTable,
  text,
  timestamp,
  boolean,
  real,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const ruleTypeEnum = pgEnum("rule_type", [
  "scoring",
  "hard_gate",
  "informational",
]);

export const rules = pgTable("rules", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  ruleType: ruleTypeEnum("rule_type").notNull().default("scoring"),
  condition: text("condition").notNull(),
  weight: real("weight").notNull().default(1),
  maxPoints: real("max_points").notNull().default(10),
  amberThreshold: real("amber_threshold").notNull().default(5),
  greenThreshold: real("green_threshold").notNull().default(8),
  isActive: boolean("is_active").notNull().default(true),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const scoringMatrix = pgTable("scoring_matrix", {
  id: text("id").primaryKey(),
  ruleId: text("rule_id")
    .notNull()
    .references(() => rules.id, { onDelete: "cascade" }),
  factorName: text("factor_name").notNull(),
  minValue: real("min_value"),
  maxValue: real("max_value"),
  points: real("points").notNull(),
  signal: text("signal").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const hardGates = pgTable("hard_gates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  condition: text("condition").notNull(),
  failureMessage: text("failure_message").notNull(),
  severity: text("severity").notNull().default("critical"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
