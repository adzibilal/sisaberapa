"use server";

import { db } from "@/db";
import { categories, users } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function seedCategories() {
  const existing = await db.select().from(categories);
  if (existing.length > 0) return;

  const defaultCats = [
    { name: "Gaji", type: "INCOME" as const },
    { name: "Bonus", type: "INCOME" as const },
    { name: "Investasi", type: "INCOME" as const },
    { name: "Makan & Minum", type: "EXPENSE" as const },
    { name: "Transportasi", type: "EXPENSE" as const },
    { name: "Belanja", type: "EXPENSE" as const },
    { name: "Tagihan", type: "EXPENSE" as const },
    { name: "Hiburan", type: "EXPENSE" as const },
    { name: "Kesehatan", type: "EXPENSE" as const },
    { name: "Lain-lain", type: "EXPENSE" as const },
  ];

  await db.insert(categories).values(defaultCats);
  revalidatePath("/transactions");
}

export async function seedUsers() {
  const existing = await db.select().from(users);
  if (existing.length > 0) return;

  await db.insert(users).values({
    username: "adzi",
    password: "password123", // In a real app, this MUST be hashed
  });
}
