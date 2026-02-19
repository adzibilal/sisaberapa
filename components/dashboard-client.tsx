"use client";

import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { signOut } from "next-auth/react";

interface DashboardClientProps {
    user: { name?: string | null };
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpense: number;
    recentTransactions: any[];
}

export function DashboardClient({
    user,
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    recentTransactions
}: DashboardClientProps) {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Halo, {user?.name || "User"}! 👋</h1>
                    <p className="text-default-500">Berikut adalah ringkasan keuangan kamu dan istri.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="flat"
                        color="danger"
                        onPress={() => signOut()}
                    >
                        Keluar
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-indigo-200">
                    <CardHeader>Total Saldo</CardHeader>
                    <CardBody className="text-3xl font-bold pb-6">
                        Rp {totalBalance.toLocaleString('id-ID')}
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-success-500 to-success-600 text-white shadow-success-200">
                    <CardHeader>Pemasukan Bulan Ini</CardHeader>
                    <CardBody className="text-3xl font-bold pb-6">
                        Rp {monthlyIncome.toLocaleString('id-ID')}
                    </CardBody>
                </Card>
                <Card className="bg-gradient-to-br from-danger-500 to-danger-600 text-white shadow-danger-200">
                    <CardHeader>Pengeluaran Bulan Ini</CardHeader>
                    <CardBody className="text-3xl font-bold pb-6">
                        Rp {monthlyExpense.toLocaleString('id-ID')}
                    </CardBody>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="font-bold">Transaksi Terakhir</CardHeader>
                    <CardBody>
                        {recentTransactions.length === 0 ? (
                            <p className="text-center text-default-400 py-10 italic">
                                Belum ada data transaksi.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {recentTransactions.map((tx) => (
                                    <div key={tx.id} className="flex justify-between items-center border-b border-default-100 pb-2">
                                        <div>
                                            <p className="font-medium">{tx.description || tx.category?.name || "Transaksi"}</p>
                                            <p className="text-tiny text-default-500">{tx.fundSource.name} • {new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                        <p className={tx.type === "INCOME" ? "text-success font-bold" : "text-danger font-bold"}>
                                            {tx.type === "INCOME" ? "+" : "-"} Rp {tx.amount.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardBody>
                </Card>

                <Card className="flex items-center justify-center p-10 bg-default-50 border-dashed border-2 border-default-200">
                    <p className="text-default-400 text-center">Statistik visual lainnya akan muncul di sini (Charts Coming Soon)</p>
                </Card>
            </div>
        </div>
    );
}
