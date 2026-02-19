"use client";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Chip,
} from "@heroui/react";
import { BillForm } from "@/components/bill-form";
import { PayBillModal } from "@/components/pay-bill-modal";
import { BillHistoryModal } from "@/components/bill-history-modal";
import { deleteBill } from "@/app/actions/bills";
import { TrashIcon, CalendarIcon } from "lucide-react";
import { formatDistanceToNow, isBefore, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";

interface BillsClientProps {
    data: any[];
    sources: any[];
}

export function BillsClient({ data, sources }: BillsClientProps) {
    const [loading, setLoading] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus tagihan ini?")) return;
        setLoading(id);
        try {
            await deleteBill(id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(null);
        }
    };

    const isOverdue = (lastPaidAt: Date | null) => {
        if (!lastPaidAt) return true;
        // If last paid was more than 30 days ago, it's considered overdue for this monthly bill tracking
        const thirtyDaysAgo = subDays(new Date(), 30);
        return isBefore(new Date(lastPaidAt), thirtyDaysAgo);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Tagihan Bulanan</h1>
                    <p className="text-default-500">Kelola pengeluaran rutin tiap bulan agar tidak terlewat.</p>
                </div>
                <BillForm />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.length === 0 && (
                    <p className="col-span-full text-center text-default-400 py-10">Belum ada tagihan yang didaftarkan.</p>
                )}
                {data.map((item) => {
                    const overdue = isOverdue(item.lastPaidAt);

                    return (
                        <Card
                            key={item.id}
                            className={`p-2 border-2 transition-all ${overdue ? "border-danger-200 bg-danger-50/10 shadow-danger-100" : "border-transparent"}`}
                            shadow="sm"
                        >
                            <CardHeader className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black uppercase tracking-tighter">{item.name}</h3>
                                    <div className="flex items-center gap-1 text-danger font-bold">
                                        <span className="text-xs">Rp</span>
                                        <span className="text-lg leading-none">{item.amount.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    <Chip
                                        color={overdue ? "danger" : "success"}
                                        variant="flat"
                                        className="font-bold uppercase text-[10px] h-6"
                                    >
                                        {overdue ? "Perlu Dibayar" : "Sudah Dibayar"}
                                    </Chip>
                                    <div className="flex gap-1">
                                        <BillHistoryModal bill={item} />
                                        <BillForm bill={item} />
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            onPress={() => handleDelete(item.id)}
                                            isLoading={loading === item.id}
                                        >
                                            <TrashIcon size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody className="py-4">
                                <div className="flex items-center gap-2 text-default-500 bg-default-100 rounded-xl p-3">
                                    <CalendarIcon size={16} className={overdue ? "text-danger" : "text-success"} />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-default-400 leading-none mb-1">Terakhir Dibayar</span>
                                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                                            {item.lastPaidAt
                                                ? formatDistanceToNow(new Date(item.lastPaidAt), { addSuffix: true, locale: id })
                                                : "Belum pernah"}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <PayBillModal bill={item} fundSources={sources} />
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
