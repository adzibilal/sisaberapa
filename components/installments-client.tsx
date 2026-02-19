"use client";

import { useState, useTransition } from "react";
import {
    Progress,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Chip,
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { InstallmentForm } from "@/components/installment-form";
import { PayInstallmentModal } from "@/components/pay-installment-modal";
import { InstallmentHistoryModal } from "@/components/installment-history-modal";
import { deleteInstallment } from "@/app/actions/installments";
import { TrashIcon } from "lucide-react";

interface InstallmentsClientProps {
    data: any[];
    sources: any[];
}

export function InstallmentsClient({ data, sources }: InstallmentsClientProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        onOpen();
    };

    const confirmDelete = () => {
        if (selectedId) {
            startTransition(async () => {
                await deleteInstallment(selectedId);
                onOpenChange();
                setSelectedId(null);
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Cicilan Berjalan</h1>
                    <p className="text-default-500">Pantau progres cicilan kamu dan istri.</p>
                </div>
                <InstallmentForm />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.length === 0 && (
                    <p className="col-span-full text-center text-default-400 py-10">Belum ada cicilan yang didaftarkan.</p>
                )}
                {data.map((item) => (
                    <Card key={item.id} className="p-2">
                        <CardHeader className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold">{item.name}</h3>
                                <p className="text-small text-default-500 uppercase font-semibold">
                                    {item.monthlyAmount > 0
                                        ? `Rp ${item.monthlyAmount.toLocaleString('id-ID')} / bulan`
                                        : "Pembayaran Flexible"}
                                </p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Chip color={item.status === "ACTIVE" ? "primary" : "success"} variant="flat">
                                    {item.status === "ACTIVE" ? "Aktif" : "Lunas"}
                                </Chip>
                                <InstallmentHistoryModal installment={item} />
                                <InstallmentForm installment={item} />
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    color="danger"
                                    onPress={() => handleDeleteClick(item.id)}
                                >
                                    <TrashIcon size={16} />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="flex justify-between text-small">
                                <span>Progres</span>
                                <span className="font-bold">
                                    Rp {item.currentPaid.toLocaleString('id-ID')} / Rp {item.totalAmount.toLocaleString('id-ID')}
                                </span>
                            </div>
                            <Progress
                                value={(item.currentPaid / item.totalAmount) * 100}
                                color={item.status === "ACTIVE" ? "primary" : "success"}
                                className="max-w-md"
                            />
                            <div className="flex justify-between text-small">
                                <span>Sisa Tagihan</span>
                                <span className="font-semibold text-danger">
                                    Rp {(item.totalAmount - item.currentPaid).toLocaleString('id-ID')}
                                </span>
                            </div>
                            {item.totalMonths > 0 && (
                                <div className="flex justify-between text-small">
                                    <span className="text-default-400">Cicilan ke-</span>
                                    <span className="font-bold text-primary">
                                        {item.paidMonths} / {item.totalMonths}
                                    </span>
                                </div>
                            )}
                        </CardBody>
                        <CardFooter>
                            {item.status === "ACTIVE" && (
                                <PayInstallmentModal installment={item} fundSources={sources} />
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" className="rounded-2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-zinc-900 dark:text-white">Konfirmasi Hapus</ModalHeader>
                            <ModalBody>
                                <p className="text-zinc-500">
                                    Apakah Anda yakin ingin menghapus cicilan ini?
                                    <br />
                                    <span className="text-xs text-zinc-400 font-italic mt-2 block italic">*Riwayat transaksi pembayaran cicilan ini tidak akan ikut terhapus.</span>
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
