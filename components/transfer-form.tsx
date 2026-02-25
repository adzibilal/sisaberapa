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
    Select,
    SelectItem,
} from "@heroui/react";
import { TransferIcon } from "@/components/icons";
import { transferBalance } from "@/app/actions/transfer";

interface TransferFormProps {
    fundSources: any[];
}

export function TransferForm({ fundSources }: TransferFormProps) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [fromSourceId, setFromSourceId] = useState("");
    const [toSourceId, setToSourceId] = useState("");
    const [amount, setAmount] = useState("");
    const [adminFee, setAdminFee] = useState("0");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!fromSourceId || !toSourceId || !amount) return;

        setLoading(true);
        try {
            await transferBalance({
                fromSourceId: parseInt(fromSourceId),
                toSourceId: parseInt(toSourceId),
                amount: parseFloat(amount),
                adminFee: adminFee ? parseFloat(adminFee) : 0,
            });

            // Reset form
            setAmount("");
            setAdminFee("0");
            setFromSourceId("");
            setToSourceId("");
            onClose();
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : "Terjadi kesalahan saat transfer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                onPress={onOpen}
                color="secondary"
                variant="flat"
                startContent={<TransferIcon />}
            >
                Transfer
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Transfer Antar Rekening</ModalHeader>
                            <ModalBody>
                                <Select
                                    label="Dari Rekening"
                                    placeholder="Pilih Sumber"
                                    variant="bordered"
                                    selectedKeys={fromSourceId ? [fromSourceId] : []}
                                    onSelectionChange={(keys) => setFromSourceId(Array.from(keys)[0] as string)}
                                    isRequired
                                >
                                    {fundSources.map((source) => (
                                        <SelectItem key={source.id} textValue={source.name}>
                                            {source.name} (Rp {source.balance?.toLocaleString('id-ID')})
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    label="Ke Rekening"
                                    placeholder="Pilih Tujuan"
                                    variant="bordered"
                                    selectedKeys={toSourceId ? [toSourceId] : []}
                                    onSelectionChange={(keys) => setToSourceId(Array.from(keys)[0] as string)}
                                    isRequired
                                >
                                    {fundSources
                                        .filter(s => s.id.toString() !== fromSourceId)
                                        .map((source) => (
                                            <SelectItem key={source.id} textValue={source.name}>
                                                {source.name} (Rp {source.balance?.toLocaleString('id-ID')})
                                            </SelectItem>
                                        ))}
                                </Select>

                                <Input
                                    label="Nominal Transfer"
                                    placeholder="0"
                                    type="number"
                                    variant="bordered"
                                    value={amount}
                                    onValueChange={setAmount}
                                    isRequired
                                />

                                <Input
                                    label="Biaya Admin (Opsional)"
                                    placeholder="0"
                                    type="number"
                                    variant="bordered"
                                    value={adminFee}
                                    onValueChange={setAdminFee}
                                    description="Biaya admin akan didebet dari rekening asal"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Batal
                                </Button>
                                <Button
                                    color="secondary"
                                    onPress={handleSubmit}
                                    isLoading={loading}
                                    isDisabled={!fromSourceId || !toSourceId || !amount || fromSourceId === toSourceId}
                                >
                                    Transfer Sekarang
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
