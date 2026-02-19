"use client";

import { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Spinner,
} from "@heroui/react";
import { Eye, Trash2 } from "lucide-react";
import { getBillTransactions } from "@/app/actions/bills";
import { deleteTransaction } from "@/app/actions/transactions";

export function BillHistoryModal({ bill }: { bill: any }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchHistory = async () => {
        if (!isOpen) return;
        setLoading(true);
        try {
            const data = await getBillTransactions(bill.id);
            setTransactions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchHistory();
        }
    }, [isOpen]);

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus riwayat pembayaran ini? Saldo akan dikembalikan.")) return;
        setDeletingId(id);
        try {
            await deleteTransaction(id);
            await fetchHistory(); // Refresh list
        } catch (error) {
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-default-400 hover:text-primary"
                onPress={onOpen}
            >
                <Eye size={16} />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <span className="text-xl font-bold uppercase">Riwayat Pembayaran</span>
                                <span className="text-sm font-normal text-default-500">Tagihan: {bill.name}</span>
                            </ModalHeader>
                            <ModalBody>
                                {loading && transactions.length === 0 ? (
                                    <div className="flex justify-center py-10">
                                        <Spinner />
                                    </div>
                                ) : (
                                    <Table aria-label="Riwayat Pembayaran" removeWrapper>
                                        <TableHeader>
                                            <TableColumn>TANGGAL</TableColumn>
                                            <TableColumn>SUMBER DANA</TableColumn>
                                            <TableColumn>NOMINAL</TableColumn>
                                            <TableColumn>AKSI</TableColumn>
                                        </TableHeader>
                                        <TableBody emptyContent="Belum ada riwayat pembayaran.">
                                            {transactions.map((tx) => (
                                                <TableRow key={tx.id}>
                                                    <TableCell>
                                                        {new Date(tx.date).toLocaleDateString("id-ID", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </TableCell>
                                                    <TableCell>{tx.fundSourceName}</TableCell>
                                                    <TableCell className="font-bold text-success">
                                                        Rp {tx.amount.toLocaleString("id-ID")}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            color="danger"
                                                            onPress={() => handleDelete(tx.id)}
                                                            isLoading={deletingId === tx.id}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Tutup
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
