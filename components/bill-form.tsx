"use client";

import { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
} from "@heroui/react";
import { PlusIcon, PencilIcon } from "@/components/icons";
import { addBill, updateBill } from "@/app/actions/bills";

type Bill = {
    id: number;
    name: string;
    amount: number;
};

export function BillForm({ bill }: { bill?: Bill }) {
    const isEditing = !!bill;
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [name, setName] = useState(bill?.name || "");
    const [amount, setAmount] = useState(bill?.amount?.toString() || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name || !amount) return;
        setLoading(true);
        try {
            if (isEditing) {
                await updateBill(bill.id, {
                    name,
                    amount: parseFloat(amount),
                });
            } else {
                await addBill({
                    name,
                    amount: parseFloat(amount),
                });
                setName("");
                setAmount("");
            }
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {isEditing ? (
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={onOpen}
                >
                    <PencilIcon size={16} />
                </Button>
            ) : (
                <Button
                    onPress={onOpen}
                    className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold shadow-lg uppercase tracking-tighter"
                    startContent={<PlusIcon />}
                >
                    Tambah Tagihan
                </Button>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" className="rounded-3xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white pt-8 px-8">
                                {isEditing ? "Edit Tagihan" : "Tambah Tagihan Baru"}
                            </ModalHeader>
                            <ModalBody className="gap-6 px-8 pb-8">
                                <Input
                                    label="Nama Tagihan"
                                    placeholder="Misal: Listrik, WiFi, Netflix"
                                    variant="bordered"
                                    radius="lg"
                                    labelPlacement="outside"
                                    value={name}
                                    onValueChange={setName}
                                    className="font-medium"
                                />

                                <Input
                                    label="Nominal Tagihan"
                                    placeholder="0"
                                    type="number"
                                    variant="bordered"
                                    radius="lg"
                                    labelPlacement="outside"
                                    startContent={<span className="text-zinc-400 text-sm">Rp</span>}
                                    value={amount}
                                    onValueChange={setAmount}
                                    className="font-medium"
                                />
                            </ModalBody>
                            <ModalFooter className="px-8 pb-8">
                                <Button variant="light" onPress={onClose} className="font-bold text-zinc-500">
                                    Batal
                                </Button>
                                <Button
                                    className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold px-8 shadow-xl"
                                    onPress={handleSubmit}
                                    isLoading={loading}
                                >
                                    {isEditing ? "Update Tagihan" : "Simpan Tagihan"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
