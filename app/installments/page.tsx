import { db } from "@/db";
import { installments, fundSources } from "@/db/schema";
import { InstallmentsClient } from "@/components/installments-client";

export default async function InstallmentsPage() {
    const data = await db.select().from(installments);
    const sources = await db.select().from(fundSources);

    return <InstallmentsClient data={data} sources={sources} />;
}
