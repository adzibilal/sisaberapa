import { db } from "@/db";
import { transactions, fundSources, categories } from "@/db/schema";
import { desc } from "drizzle-orm";
import { TransactionsClient } from "@/components/transactions-client";

export default async function TransactionsPage() {
    const data = await db.query.transactions.findMany({
        with: {
            fundSource: true,
            category: true
        },
        orderBy: [desc(transactions.date)]
    });

    const sources = await db.select().from(fundSources);
    const cats = await db.select().from(categories);

    return <TransactionsClient data={data} sources={sources} cats={cats} />;
}
