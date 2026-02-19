"use server";

import { db } from "@/db";
import { bills, transactions, fundSources } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addBill(data: { name: string; amount: number }) {
  await db.insert(bills).values({
    ...data,
  });
  revalidatePath("/bills");
  revalidatePath("/");
}

export async function payBill(id: number, fundSourceId: number) {
  await db.transaction(async (tx) => {
    // 1. Get bill details
    const [bill] = await tx.select().from(bills).where(eq(bills.id, id));

    if (!bill) return;

    // 2. Create expense transaction
    await tx.insert(transactions).values({
      amount: bill.amount,
      type: "EXPENSE",
      description: `Tagihan: ${bill.name}`,
      fundSourceId,
      billId: id,
      date: new Date(),
    });

    // 3. Update fund source balance
    await tx
      .update(fundSources)
      .set({
        balance: sql`${fundSources.balance} - ${bill.amount}`,
      })
      .where(eq(fundSources.id, fundSourceId));

    // 4. Update bill lastPaidAt
    await tx
      .update(bills)
      .set({
        lastPaidAt: new Date(),
      })
      .where(eq(bills.id, id));
  });

  revalidatePath("/bills");
  revalidatePath("/transactions");
  revalidatePath("/fund-sources");
  revalidatePath("/");
}

export async function updateBill(
  id: number,
  data: {
    name: string;
    amount: number;
  },
) {
  await db.update(bills).set(data).where(eq(bills.id, id));
  revalidatePath("/bills");
  revalidatePath("/");
}

export async function getBillTransactions(billId: number) {
  // 1. Get bill details to match by name (fallback for legacy transactions without billId)
  const [bill] = await db
    .select({ name: bills.name })
    .from(bills)
    .where(eq(bills.id, billId));

  if (!bill) return [];

  // Match: (billId IS NOT NULL AND billId = id) OR (billId IS NULL AND description = "Tagihan: Name")
  return db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      date: transactions.date,
      description: transactions.description,
      fundSourceName: fundSources.name,
    })
    .from(transactions)
    .leftJoin(fundSources, eq(transactions.fundSourceId, fundSources.id))
    .where(
      sql`(${transactions.billId} = ${billId}) OR (${transactions.billId} IS NULL AND ${transactions.description} = ${`Tagihan: ${bill.name}`})`,
    )
    .orderBy(sql`${transactions.date} DESC`);
}

export async function deleteBill(id: number) {
  await db.delete(bills).where(eq(bills.id, id));
  revalidatePath("/bills");
  revalidatePath("/");
}
