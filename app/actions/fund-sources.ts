"use server";

import { db } from "@/db";
import { fundSources } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addFundSource(name: string, balance: number) {
  await db.insert(fundSources).values({ name, balance });
  revalidatePath("/fund-sources");
  revalidatePath("/");
}

export async function deleteFundSource(id: number) {
  await db.delete(fundSources).where(eq(fundSources.id, id));
  revalidatePath("/fund-sources");
  revalidatePath("/");
}

export async function updateFundSource(
  id: number,
  name: string,
  balance: number,
) {
  await db
    .update(fundSources)
    .set({ name, balance })
    .where(eq(fundSources.id, id));
  revalidatePath("/fund-sources");
  revalidatePath("/");
}
