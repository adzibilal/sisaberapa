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
} from "@heroui/react";
import { payBill } from "@/app/actions/bills";

export function PayBillModal({ bill, fundSources }: { bill: any, fundSources: any[] }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [fundSourceId, setFundSourceId] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePay = async () => {
        if (!fundSourceId) return;
        setLoading(true);
        try {
            await payBill(bill.id, parseInt(fundSourceId));
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onPress={onOpen} color="primary" variant="shadow" fullWidth className="font-bold uppercase tracking-tight">
                Bayar Sekarang
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-xl font-black uppercase tracking-tighter">Konfirmasi Pembayaran</ModalHeader>
                            <ModalBody className="space-y-4">
                                <div className="bg-default-100 p-4 rounded-2xl space-y-1">
                                    <p className="text-xs uppercase font-bold text-default-400">Tagihan</p>
                                    <p className="text-lg font-bold">{bill.name}</p>
                                    <p className="text-2xl font-black text-danger">Rp {bill.amount.toLocaleString('id-ID')}</p>
                                </div>
                                <Select
                                    label="Pilih Sumber Dana"
                                    placeholder="Pilih rekening/dompet"
                                    variant="bordered"
                                    radius="lg"
                                    selectedKeys={fundSourceId ? new Set([fundSourceId]) : new Set()}
                                    onChange={(e) => setFundSourceId(e.target.value)}
                                    isRequired
                                >
                                    {fundSources.map((source) => (
                                        <SelectItem key={source.id.toString()} textValue={`${source.name} (Saldo: Rp ${source.balance.toLocaleString('id-ID')})`}>
                                            {source.name} (Saldo: Rp {source.balance.toLocaleString('id-ID')})
                                        </SelectItem>
                                    ))}
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose} className="font-bold">
                                    Batal
                                </Button>
                                <Button color="primary" onPress={handlePay} isLoading={loading} className="font-bold px-8 shadow-lg shadow-primary-200">
                                    Konfirmasi & Bayar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
