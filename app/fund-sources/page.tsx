import { db } from "@/db";
import { fundSources } from "@/db/schema";
import { FundSourcesClient } from "@/components/fund-sources-client";

export default async function FundSourcesPage() {
    const data = await db.select().from(fundSources);

    return <FundSourcesClient data={data} />;
}
