"use client";

import {
    Card,
    CardBody,
    CardHeader
} from "@heroui/react";
import { FundSourceForm } from "@/components/fund-source-form";
import { CreditCardIcon, CpuIcon, WifiIcon } from "lucide-react";
import clsx from "clsx";

interface FundSourcesClientProps {
    data: any[];
}

export function FundSourcesClient({ data }: FundSourcesClientProps) {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Budget Sources</h1>
                    <p className="text-zinc-500 text-sm">Kelola rekening dan dompet digital kamu dengan gaya.</p>
                </div>
                <FundSourceForm />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                        <p className="text-zinc-400 font-medium italic">Belum ada sumber dana yang terdaftar.</p>
                    </div>
                ) : (
                    data.map((item, index) => (
                        <Card
                            key={item.id}
                            className={clsx(
                                "relative h-56 rounded-[2rem] border-none shadow-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.02] hover:-rotate-1",
                                index % 2 === 0
                                    ? "bg-zinc-900 text-white"
                                    : "bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                            )}
                        >
                            <CardBody className="p-8 flex flex-col justify-between relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className={clsx(
                                            "text-[10px] font-black uppercase tracking-[0.2em] opacity-60",
                                            index % 2 === 0 ? "text-zinc-400" : "text-zinc-500"
                                        )}>
                                            Account Name
                                        </p>
                                        <h3 className="text-xl font-bold tracking-tight">{item.name}</h3>
                                    </div>
                                    <WifiIcon className="rotate-90 opacity-40" size={24} />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-9 rounded-md bg-zinc-400/20 dark:bg-zinc-500/20 flex items-center justify-center border border-white/10">
                                        <CpuIcon size={20} className="opacity-60" />
                                    </div>
                                    <div className="flex-grow border-t border-dashed border-current opacity-10"></div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className={clsx(
                                            "text-[10px] font-black uppercase tracking-[0.2em] opacity-60",
                                            index % 2 === 0 ? "text-zinc-400" : "text-zinc-500"
                                        )}>
                                            Current Balance
                                        </p>
                                        <p className="text-2xl font-mono font-bold tracking-tighter">
                                            Rp {item.balance.toLocaleString('id-ID')}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <FundSourceForm mode="edit" isDark={index % 2 === 0} initialData={item} />
                                    </div>
                                </div>
                            </CardBody>

                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-zinc-500/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
