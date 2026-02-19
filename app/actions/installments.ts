"use server";

import { db } from "@/db";
import { installments, transactions, fundSources } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addInstallment(data: {
  name: string;
  totalAmount: number;
  monthlyAmount: number;
  totalMonths: number;
  startDate: Date;
}) {
  await db.insert(installments).values({
    ...data,
    paidMonths: 0,
    status: "ACTIVE",
  });
  revalidatePath("/installments");
  revalidatePath("/");
}

export async function payInstallment(id: number, fundSourceId: number) {
  await db.transaction(async (tx) => {
    // 1. Get installment details
    const [installment] = await tx
      .select()
      .from(installments)
      .where(eq(installments.id, id));

    if (!installment || installment.status === "COMPLETED") return;

    // 2. Create expense transaction
    await tx.insert(transactions).values({
      amount: installment.monthlyAmount,
      type: "EXPENSE",
      description: `Cicilan: ${installment.name} (Bulan ke-${installment.paidMonths + 1})`,
      fundSourceId,
      installmentId: id,
      date: new Date(),
    });

    // 3. Update fund source balance
    await tx
      .update(fundSources)
      .set({
        balance: sql`${fundSources.balance} - ${installment.monthlyAmount}`,
      })
      .where(eq(fundSources.id, fundSourceId));

    // 4. Update installment progress
    const nextPaidMonths = installment.paidMonths + 1;
    const isCompleted = nextPaidMonths >= installment.totalMonths;

    await tx
      .update(installments)
      .set({
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
