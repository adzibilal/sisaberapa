import { db } from "@/db";
import { categories, fundSources } from "@/db/schema";
import { QuickInputClient } from "@/components/quick-input-client";

export default async function QuickInputPage() {
    const cats = await db.select().from(categories);
    const sources = await db.select().from(fundSources);

    return (
        <div className="py-4">
            <QuickInputClient
                categories={cats}
                fundSources={sources}
            />
        </div>
    );
}
