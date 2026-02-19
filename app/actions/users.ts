"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addUser(username: string, password: string) {
  await db.insert(users).values({
    username,
    password, // Note: In a real app, hash this!
  });
  revalidatePath("/users");
}

export async function deleteUser(id: number) {
  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/users");
}
