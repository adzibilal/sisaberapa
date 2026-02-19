"use client";

import { Button, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { signOut } from "next-auth/react";
import { DashboardFilters } from "./dashboard-filters";
import { StatsCharts } from "./stats-charts";
import { WalletIcon, TrendingUpIcon, TrendingDownIcon, LogOutIcon } from "lucide-react";

interface DashboardClientProps {
    user: { name?: string | null };
    totalBalance: number;
    rangeIncome: number;
    rangeExpense: number;
    recentTransactions: any[];
    categoryData: any[];
    dailyTrend: any[];
    currentRange: string;
}

export function DashboardClient({
    user,
    totalBalance,
    rangeIncome,
    rangeExpense,
    recentTransactions,
    categoryData,
    dailyTrend,
    currentRange
}: DashboardClientProps) {
    return (
        <div className="space-y-8 pb-10">
            <header className="flex justify-between items-center bg-white dark:bg-content1 p-6 rounded-2xl border border-divider shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Halo, {user?.name || "User"}! 👋
                    </h1>
                    <p className="text-default-500 font-medium">Berikut adalah ringkasan keuangan kamu.</p>
                </div>
                <Button
                    variant="flat"
                    color="danger"
                    onPress={() => signOut()}
                    startContent={<LogOutIcon size={18} />}
                    className="font-bold border-danger-100 hover:bg-danger-50"
                >
                    Keluar
                </Button>
            </header>

            <DashboardFilters currentRange={currentRange} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                    <CardBody className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-medium opacity-80 uppercase tracking-wider text-tiny">Total Saldo</p>
                            <div className="p-2 bg-white/20 rounded-lg">
                                <WalletIcon size={20} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Rp {totalBalance.toLocaleString('id-ID')}
                        </h2>
                    </CardBody>
                </Card>

                <Card className="border-none bg-gradient-to-br from-success-600 to-success-700 text-white shadow-xl shadow-success-200 dark:shadow-none">
                    <CardBody className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-medium opacity-80 uppercase tracking-wider text-tiny">Pemasukan ({currentRange})</p>
                            <div className="p-2 bg-white/20 rounded-lg">
                                <TrendingUpIcon size={20} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Rp {rangeIncome.toLocaleString('id-ID')}
                        </h2>
                    </CardBody>
                </Card>

                <Card className="border-none bg-gradient-to-br from-danger-600 to-danger-700 text-white shadow-xl shadow-danger-200 dark:shadow-none">
                    <CardBody className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="font-medium opacity-80 uppercase tracking-wider text-tiny">Pengeluaran ({currentRange})</p>
                            <div className="p-2 bg-white/20 rounded-lg">
                                <TrendingDownIcon size={20} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Rp {rangeExpense.toLocaleString('id-ID')}
                        </h2>
                    </CardBody>
                </Card>
            </div>

            <StatsCharts categoryData={categoryData} dailyTrend={dailyTrend} />

            <Card className="shadow-sm border border-divider overflow-hidden">
                <CardHeader className="px-6 pt-6">
                    <h3 className="font-bold text-lg text-indigo-600">Transaksi Terakhir</h3>
                </CardHeader>
                <Divider className="my-2 mx-6" />
                <CardBody className="px-6 pb-6">
                    {recentTransactions.length === 0 ? (
                        <div className="text-center text-default-400 py-16 flex flex-col items-center gap-2">
                            <p className="italic">Belum ada data transaksi.</p>
                            <Button variant="flat" size="sm" color="primary">Catat Sekarang</Button>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {recentTransactions.map((tx) => (
                                <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-default-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${tx.type === "INCOME" ? "bg-success-50 text-success" : "bg-danger-50 text-danger"}`}>
                                            {tx.type === "INCOME" ? <TrendingUpIcon size={18} /> : <TrendingDownIcon size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{tx.description || tx.category?.name || "Transaksi"}</p>
                                            <p className="text-tiny text-default-500 font-medium">
                                                {tx.fundSource.name} • {new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-black ${tx.type === "INCOME" ? "text-success" : "text-danger"}`}>
                                        {tx.type === "INCOME" ? "+" : "-"} Rp {tx.amount.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
