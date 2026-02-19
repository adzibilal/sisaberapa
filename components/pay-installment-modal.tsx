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
    Select,
    SelectItem,
    Input,
} from "@heroui/react";
import { payInstallment } from "@/app/actions/installments";

export function PayInstallmentModal({ installment, fundSources }: { installment: any, fundSources: any[] }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [fundSourceId, setFundSourceId] = useState("");
    const [amount, setAmount] = useState(installment.monthlyAmount.toString());
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        if (!fundSourceId || !amount) return;
        setLoading(true);
        try {
            await payInstallment(installment.id, parseInt(fundSourceId), parseFloat(amount));
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onPress={onOpen} color="primary" variant="shadow" fullWidth>
                Bayar Cicilan
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Bayar Cicilan: {installment.name}</ModalHeader>
                            <ModalBody className="space-y-4">
                                <p className="text-default-600">
                                    Masukkan nominal yang ingin dibayarkan.
                                </p>
                                <Input
                                    label="Nominal Pembayaran"
                                    placeholder="0.00"
                                    variant="bordered"
                                    type="number"
                                    value={amount}
                                    onValueChange={setAmount}
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">Rp</span>
                                        </div>
                                    }
                                    isRequired
                                />
                                <Select
                                    label="Pilih Sumber Dana"
                                    placeholder="Pilih rekening/dompet"
                                    variant="bordered"
                                    selectedKeys={fundSourceId ? [fundSourceId] : []}
                                    onSelectionChange={(keys) => setFundSourceId(Array.from(keys)[0] as string)}
                                    isRequired
                                >
                                    {fundSources.map((source) => (
                                        <SelectItem key={source.id} value={source.id}>
                                            {source.name} (Saldo: Rp {source.balance.toLocaleString('id-ID')})
                                        </SelectItem>
                                    ))}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Batal
                                </Button>
                                <Button color="primary" onPress={handlePay} isLoading={loading}>
                                    Konfirmasi Pembayaran
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
