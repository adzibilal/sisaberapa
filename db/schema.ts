import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  doublePrecision,
  pgEnum,
} from "drizzle-orm/pg-core";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "INCOME",
  "EXPENSE",
]);
export const installmentStatusEnum = pgEnum("installment_status", [
  "ACTIVE",
  "COMPLETED",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fundSources = pgTable("fund_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  balance: doublePrecision("balance").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: transactionTypeEnum("type").notNull(),
});

export const installments = pgTable("installments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  monthlyAmount: doublePrecision("monthly_amount"),
  totalMonths: integer("total_months"),
  paidMonths: integer("paid_months").default(0).notNull(),
  currentPaid: doublePrecision("current_paid").default(0).notNull(),
  startDate: timestamp("start_date").notNull(),
  status: installmentStatusEnum("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: doublePrecision("amount").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  type: transactionTypeEnum("type").notNull(),
  description: text("description"),
  fundSourceId: integer("fund_source_id")
    .references(() => fundSources.id)
    .notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  installmentId: integer("installment_id").references(() => installments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
