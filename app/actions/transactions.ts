"use server";

import { db } from "@/db";
import { transactions, fundSources, bills, installments } from "@/db/schema";
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
  let transactionId: number | undefined;

  await db.transaction(async (tx) => {
    // 1. Insert transaction
    const [inserted] = await tx
      .insert(transactions)
      .values({
        amount: data.amount,
        type: data.type,
        description: data.description,
        fundSourceId: data.fundSourceId,
        categoryId: data.categoryId,
        installmentId: data.installmentId,
        date: data.date || new Date(),
      })
      .returning({ id: transactions.id });

    transactionId = inserted?.id;

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

  return transactionId;
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

    // 4. Update bill lastPaidAt if applicable
    let billId = transaction.billId;

    // Handle legacy case: if no billId, try to find bill by name
    if (!billId && transaction.description?.startsWith("Tagihan: ")) {
      const billName = transaction.description.replace("Tagihan: ", "");
      const [bill] = await tx
        .select({ id: bills.id })
        .from(bills)
        .where(eq(bills.name, billName));
      if (bill) {
        billId = bill.id;
      }
    }

    if (billId) {
      // Find the latest transaction for this bill (using the same logic as getBillTransactions)
      const [bill] = await tx
        .select({ name: bills.name })
        .from(bills)
        .where(eq(bills.id, billId));

      if (bill) {
        const [latestTx] = await tx
          .select({ date: transactions.date })
          .from(transactions)
          .where(
            sql`(${transactions.billId} = ${billId}) OR (${transactions.billId} IS NULL AND ${transactions.description} = ${`Tagihan: ${bill.name}`})`,
          )
          .orderBy(sql`${transactions.date} DESC`)
          .limit(1);

        await tx
          .update(bills)
          .set({ lastPaidAt: latestTx ? latestTx.date : null })
          .where(eq(bills.id, billId));
      }
    }

    // 5. Update installment currentPaid/paidMonths/status if applicable
    if (transaction.installmentId) {
      const installmentId = transaction.installmentId;

      const [installment] = await tx
        .select()
        .from(installments)
        .where(eq(installments.id, installmentId));

      if (installment) {
        const newCurrentPaid = Math.max(
          0,
          installment.currentPaid - Number(transaction.amount),
        );
        const newPaidMonths = installment.totalMonths
          ? Math.floor(
              (newCurrentPaid / installment.totalAmount) *
                installment.totalMonths,
            )
          : Math.max(0, installment.paidMonths - 1);
        const isCompleted = newCurrentPaid >= installment.totalAmount;

        await tx
          .update(installments)
          .set({
            currentPaid: newCurrentPaid,
            paidMonths: newPaidMonths,
            status: isCompleted ? "COMPLETED" : "ACTIVE",
          })
          .where(eq(installments.id, installmentId));
      }
    }
  });

  revalidatePath("/transactions");
  revalidatePath("/");
  revalidatePath("/fund-sources");
  revalidatePath("/bills");
}
