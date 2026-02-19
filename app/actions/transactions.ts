"use server";

import { db } from "@/db";
import { transactions, fundSources } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addTransaction(data: {
  amount: number;
  type: "INCOME" | "EXPENSE";
  description: string;
  fundSourceId: number;
  categoryId?: number;
  installmentId?: number;
  date?: Date;
}) {
  await db.transaction(async (tx) => {
    // 1. Insert transaction
    await tx.insert(transactions).values({
      amount: data.amount,
      type: data.type,
      description: data.description,
      fundSourceId: data.fundSourceId,
      categoryId: data.categoryId,
      installmentId: data.installmentId,
      date: data.date || new Date(),
    });

    // 2. Update fund source balance
    const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;
    await tx
      .update(fundSources)
      .set({ balance: sql`${fundSources.balance} + ${balanceChange}` })
      .where(eq(fundSources.id, data.fundSourceId));
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/fund-sources");
}

export async function deleteTransaction(id: number) {
  await db.transaction(async (tx) => {
    // 1. Get transaction details
    const [transaction] = await tx
      .select()
      .from(transactions)
      .where(eq(transactions.id, id));

    if (!transaction) return;

    // 2. Revert balance
    // If it was an INCOME, we subtract. If it was an EXPENSE, we add back.
    const balanceReversion =
      transaction.type === "INCOME"
        ? -Number(transaction.amount)
        : Number(transaction.amount);

    await tx
      .update(fundSources)
      .set({ balance: sql`${fundSources.balance} + ${balanceReversion}` })
      .where(eq(fundSources.id, transaction.fundSourceId));

    // 3. Delete transaction
    await tx.delete(transactions).where(eq(transactions.id, id));
  });

  revalidatePath("/transactions");
  revalidatePath("/");
  revalidatePath("/fund-sources");
}
