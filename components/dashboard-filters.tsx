"use client";

import { Tabs, Tab } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";

export function DashboardFilters({ currentRange }: { currentRange: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleRangeChange = (key: any) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("range", key);
        router.push(`/?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-content1 p-4 rounded-2xl border border-divider shadow-sm">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-900 dark:text-white">
                    <CalendarIcon size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold">Rentang Waktu</p>
                    <p className="text-tiny text-default-500">Filter statistik dashboard</p>
                </div>
            </div>
            <Tabs
                selectedKey={currentRange}
                onSelectionChange={handleRangeChange}
                variant="pills"
                color="primary"
                classNames={{
                    tabList: "bg-zinc-100 dark:bg-zinc-800",
                    cursor: "bg-zinc-900 dark:bg-zinc-100 shadow-sm",
                    tabContent: "font-bold group-data-[selected=true]:text-white dark:group-data-[selected=true]:text-zinc-900"
                }}
            >
                <Tab key="today" title="Hari Ini" />
                <Tab key="week" title="Minggu Ini" />
                <Tab key="month" title="Bulan Ini" />
                <Tab key="year" title="Tahun Ini" />
                <Tab key="all" title="Semua" />
            </Tabs>
        </div>
    );
}
