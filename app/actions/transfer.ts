"use server";

import { db } from "@/db";
import { transactions, fundSources } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function transferBalance(data: {
  fromSourceId: number;
  toSourceId: number;
  amount: number;
  adminFee: number;
}) {
  const { fromSourceId, toSourceId, amount, adminFee } = data;

  if (fromSourceId === toSourceId) {
    throw new Error("Sumber asal dan tujuan tidak boleh sama");
  }

  if (amount <= 0) {
    throw new Error("Jumlah transfer harus lebih dari 0");
  }

  await db.transaction(async (tx) => {
    // 1. Get Source Names for descriptions
    const [fromSource] = await tx
      .select({ name: fundSources.name })
      .from(fundSources)
      .where(eq(fundSources.id, fromSourceId));

    const [toSource] = await tx
      .select({ name: fundSources.name })
      .from(fundSources)
      .where(eq(fundSources.id, toSourceId));

    if (!fromSource || !toSource) {
      throw new Error("Sumber dana tidak ditemukan");
    }

    // 2. Add Transaction Logs

    // a. Outgoing Transfer from Source A
    await tx.insert(transactions).values({
      amount: amount,
      type: "TRANSFER",
      description: `Transfer ke ${toSource.name}`,
      fundSourceId: fromSourceId,
      date: new Date(),
    });

    // b. Incoming Transfer to Source B
    await tx.insert(transactions).values({
      amount: amount,
      type: "TRANSFER",
      description: `Transfer dari ${fromSource.name}`,
      fundSourceId: toSourceId,
      date: new Date(),
    });

    // c. Admin Fee from Source A (if any)
    if (adminFee > 0) {
      await tx.insert(transactions).values({
        amount: adminFee,
        type: "EXPENSE",
        description: `Biaya Admin Transfer ke ${toSource.name}`,
        fundSourceId: fromSourceId,
        date: new Date(),
      });
    }

    // 3. Update Balances

    // Deduct amount (and admin fee) from Source A
    const totalDeductionFromSourceA = amount + adminFee;
    await tx
      .update(fundSources)
      .set({
        balance: sql`${fundSources.balance} - ${totalDeductionFromSourceA}`,
      })
      .where(eq(fundSources.id, fromSourceId));

    // Add amount to Source B
    await tx
      .update(fundSources)
      .set({ balance: sql`${fundSources.balance} + ${amount}` })
      .where(eq(fundSources.id, toSourceId));
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/fund-sources");
}
