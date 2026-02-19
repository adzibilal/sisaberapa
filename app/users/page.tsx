import { db } from "@/db";
import { users } from "@/db/schema";
import { UsersClient } from "@/components/users-client";

export default async function UsersPage() {
    const data = await db.select().from(users);

    return <UsersClient data={data} />;
}
