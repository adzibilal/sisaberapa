"use client";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardBody,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@heroui/react";
import { TransactionForm } from "@/components/transaction-form";
import { Trash2Icon } from "lucide-react";
import { deleteTransaction } from "@/app/actions/transactions";
import { useState, useTransition } from "react";
import clsx from "clsx";

interface TransactionsClientProps {
    data: any[];
    sources: any[];
    cats: any[];
}

export function TransactionsClient({ data, sources, cats }: TransactionsClientProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleDelete = (id: number) => {
        setSelectedId(id);
        onOpen();
    };

    const confirmDelete = () => {
        if (selectedId) {
            startTransition(async () => {
                await deleteTransaction(selectedId);
                onOpenChange();
                setSelectedId(null);
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Riwayat Transaksi</h1>
                    <p className="text-zinc-500 text-sm">Pantau semua pemasukan dan pengeluaran kamu.</p>
                </div>
                <TransactionForm fundSources={sources} categories={cats} />
            </div>

            <Card className="border border-divider shadow-sm bg-white dark:bg-zinc-900">
                <CardBody className="p-0">
                    <Table aria-label="Tabel Transaksi" removeWrapper>
                        <TableHeader>
                            <TableColumn className="font-bold">TANGGAL</TableColumn>
                            <TableColumn className="font-bold">KETERANGAN</TableColumn>
                            <TableColumn className="font-bold">KATEGORI</TableColumn>
                            <TableColumn className="font-bold">SUMBER DANA</TableColumn>
                            <TableColumn className="font-bold">NOMINAL</TableColumn>
                            <TableColumn className="font-bold text-center">AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Belum ada transaksi."}>
                            {data.map((item) => (
                                <TableRow key={item.id} className="border-b border-divider last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                    <TableCell className="text-zinc-600 dark:text-zinc-400 font-mono text-xs">{new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">{item.description || "-"}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 border border-divider">
                                            {item.category?.name || "Lainnya"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-zinc-500 text-sm italic">{item.fundSource.name}</TableCell>
                                    <TableCell>
                                        <span className={clsx(
                                            "font-bold text-sm",
                                            item.type === "INCOME" ? "text-green-600" : "text-red-600"
                                        )}>
                                            {item.type === "INCOME" ? "+" : "-"} Rp {item.amount.toLocaleString('id-ID')}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="danger"
                                            onPress={() => handleDelete(item.id)}
                                            className="hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2Icon size={18} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" className="rounded-2xl">
                <ModalContent>
                    {(onClose: () => void) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-zinc-900 dark:text-white">Konfirmasi Hapus</ModalHeader>
                            <ModalBody>
                                <p className="text-zinc-500">
                                    Apakah Anda yakin ingin menghapus transaksi ini?
                                    <br />
                                    <span className="text-xs text-zinc-400 font-italic mt-2 block italic">*Saldo pada sumber dana terkait akan disesuaikan kembali secara otomatis.</span>
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose} className="font-bold">
                                    Batal
                                </Button>
                                <Button
                                    color="danger"
                                    onPress={confirmDelete}
                                    isLoading={isPending}
                                    className="font-bold px-6 shadow-lg shadow-red-200 dark:shadow-none"
                                >
                                    Ya, Hapus
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
