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
import { PlusIcon } from "@/components/icons";
import { addInstallment } from "@/app/actions/installments";

export function InstallmentForm() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [name, setName] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [monthlyAmount, setMonthlyAmount] = useState("");
    const [totalMonths, setTotalMonths] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await addInstallment({
                name,
                totalAmount: parseFloat(totalAmount),
                monthlyAmount: parseFloat(monthlyAmount),
                totalMonths: parseInt(totalMonths),
                startDate: new Date(),
            });
            setName("");
            setTotalAmount("");
            setMonthlyAmount("");
            setTotalMonths("");
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onPress={onOpen} color="primary" startContent={<PlusIcon />}>
                Tambah Cicilan
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Tambah Tracking Cicilan</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Nama Cicilan"
                                    placeholder="Misal: KPR, Motor, HP"
                                    variant="bordered"
                                    value={name}
                                    onValueChange={setName}
                                />
                                <Input
                                    label="Total Pinjaman"
                                    placeholder="0"
                                    type="number"
                                    variant="bordered"
                                    value={totalAmount}
                                    onValueChange={setTotalAmount}
                                />
                                <Input
                                    label="Cicilan / Bulan"
                                    placeholder="0"
                                    type="number"
                                    variant="bordered"
                                    value={monthlyAmount}
                                    onValueChange={setMonthlyAmount}
                                />
                                <Input
                                    label="Tenor (Bulan)"
                                    placeholder="12"
                                    type="number"
                                    variant="bordered"
                                    value={totalMonths}
                                    onValueChange={setTotalMonths}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Batal
                                </Button>
                                <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                                    Simpan
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
