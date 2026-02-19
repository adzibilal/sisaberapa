import { db } from "@/db";
import { bills, fundSources } from "@/db/schema";
import { BillsClient } from "@/components/bills-client";

export default async function BillsPage() {
    const data = await db.select().from(bills);
    const sources = await db.select().from(fundSources);

    return <BillsClient data={data} sources={sources} />;
}
