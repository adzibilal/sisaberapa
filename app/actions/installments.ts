"use server";

import { db } from "@/db";
import { installments, transactions, fundSources } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addInstallment(data: {
  name: string;
  totalAmount: number;
  monthlyAmount?: number;
  totalMonths?: number;
  paidMonths?: number;
  currentPaid?: number;
  startDate: Date;
}) {
  const paidMonths = data.paidMonths || 0;
  const currentPaid = data.currentPaid || 0;
  const isCompleted = currentPaid >= data.totalAmount;

  await db.insert(installments).values({
    ...data,
    paidMonths: paidMonths,
    currentPaid: currentPaid,
    status: isCompleted ? "COMPLETED" : "ACTIVE",
  });
  revalidatePath("/installments");
  revalidatePath("/");
}

export async function payInstallment(
  id: number,
  fundSourceId: number,
  amount: number,
) {
  await db.transaction(async (tx) => {
    // 1. Get installment details
    const [installment] = await tx
      .select()
      .from(installments)
      .where(eq(installments.id, id));

    if (!installment || installment.status === "COMPLETED") return;

    // 2. Create expense transaction
    await tx.insert(transactions).values({
      amount: amount,
      type: "EXPENSE",
      description: `Cicilan: ${installment.name}`,
      fundSourceId,
      installmentId: id,
      date: new Date(),
    });

    // 3. Update fund source balance
    await tx
      .update(fundSources)
      .set({
        balance: sql`${fundSources.balance} - ${amount}`,
      })
      .where(eq(fundSources.id, fundSourceId));

    // 4. Update installment progress
    const nextCurrentPaid = installment.currentPaid + amount;
    const isCompleted = nextCurrentPaid >= installment.totalAmount;

    // Optional: Calculate pseudo paidMonths based on average or just use amount
    const nextPaidMonths = Math.floor(
      (nextCurrentPaid / installment.totalAmount) *
        (installment.totalMonths ?? 0),
    );

    await tx
      .update(installments)
      .set({
        currentPaid: nextCurrentPaid,
        paidMonths: nextPaidMonths,
        status: isCompleted ? "COMPLETED" : "ACTIVE",
      })
      .where(eq(installments.id, id));
  });

  revalidatePath("/installments");
  revalidatePath("/transactions");
  revalidatePath("/fund-sources");
  revalidatePath("/");
}
