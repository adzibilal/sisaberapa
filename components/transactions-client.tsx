"use client";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardBody
} from "@heroui/react";
import { TransactionForm } from "@/components/transaction-form";

interface TransactionsClientProps {
    data: any[];
    sources: any[];
    cats: any[];
}

export function TransactionsClient({ data, sources, cats }: TransactionsClientProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Riwayat Transaksi</h1>
                    <p className="text-default-500">Pantau semua pemasukan dan pengeluaran kamu.</p>
                </div>
                <TransactionForm fundSources={sources} categories={cats} />
            </div>

            <Card>
                <CardBody className="p-0">
                    <Table aria-label="Tabel Transaksi" removeWrapper>
                        <TableHeader>
                            <TableColumn>TANGGAL</TableColumn>
                            <TableColumn>KETERANGAN</TableColumn>
                            <TableColumn>KATEGORI</TableColumn>
                            <TableColumn>SUMBER DANA</TableColumn>
                            <TableColumn>NOMINAL</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Belum ada transaksi."}>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{new Date(item.date).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>{item.description || "-"}</TableCell>
                                    <TableCell>{item.category?.name || "Tanpa Kategori"}</TableCell>
                                    <TableCell>{item.fundSource.name}</TableCell>
                                    <TableCell>
                                        <span className={item.type === "INCOME" ? "text-success font-bold" : "text-danger font-bold"}>
                                            {item.type === "INCOME" ? "+" : "-"} Rp {item.amount.toLocaleString('id-ID')}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}
