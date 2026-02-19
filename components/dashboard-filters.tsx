"use client";

import { Select, SelectItem, Input } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useState, useEffect } from "react";

export function DashboardFilters({ currentRange }: { currentRange: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [startDate, setStartDate] = useState(searchParams.get("from") || "");
    const [endDate, setEndDate] = useState(searchParams.get("to") || "");

    const handleRangeChange = (keys: any) => {
        const key = Array.from(keys)[0];
        const params = new URLSearchParams(searchParams.toString());
        params.set("range", String(key));

        if (key !== "custom") {
            params.delete("from");
            params.delete("to");
        }

        router.push(`/?${params.toString()}`);
    };

    const handleDateUpdate = () => {
        if (startDate && endDate) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("from", startDate);
            params.set("to", endDate);
            router.push(`/?${params.toString()}`);
        }
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
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
                {currentRange === "custom" && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                        <Input
                            type="date"
                            size="sm"
                            label="Dari"
                            value={startDate}
                            onValueChange={setStartDate}
                            onBlur={handleDateUpdate}
                            className="w-32"
                        />
                        <Input
                            type="date"
                            size="sm"
                            label="Sampai"
                            value={endDate}
                            onValueChange={setEndDate}
                            onBlur={handleDateUpdate}
                            className="w-32"
                        />
                    </div>
                )}
                <Select
                    label="Rentang Waktu"
                    size="sm"
                    className="w-48"
                    selectedKeys={[currentRange]}
                    onSelectionChange={handleRangeChange}
                    disallowEmptySelection
                    renderValue={(items: any) => {
                        return items.map((item: any) => (
                            <div key={item.key} className="flex items-center gap-2 font-bold">
                                <span>{item.props.textValue}</span>
                            </div>
                        ));
                    }}
                >
                    <SelectItem key="today" textValue="Hari Ini">Hari Ini</SelectItem>
                    <SelectItem key="week" textValue="Minggu Ini">Minggu Ini</SelectItem>
                    <SelectItem key="month" textValue="Bulan Ini">Bulan Ini</SelectItem>
                    <SelectItem key="year" textValue="Tahun Ini">Tahun Ini</SelectItem>
                    <SelectItem key="all" textValue="Semua">Semua</SelectItem>
                    <SelectItem key="custom" textValue="Custom">Custom Range</SelectItem>
                </Select>
            </div>
        </div>
    );
}
