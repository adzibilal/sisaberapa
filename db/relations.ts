import { relations } from "drizzle-orm";
import { fundSources, categories, transactions, installments } from "./schema";

export const fundSourcesRelations = relations(fundSources, ({ many }) => ({
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const installmentsRelations = relations(installments, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  fundSource: one(fundSources, {
    fields: [transactions.fundSourceId],
    references: [fundSources.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  installment: one(installments, {
    fields: [transactions.installmentId],
    references: [installments.id],
  }),
}));
