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
    Tabs,
    Tab
} from "@heroui/react";
import { PlusIcon } from "@/components/icons";
import { addTransaction } from "@/app/actions/transactions";

export function TransactionForm({ fundSources, categories }: { fundSources: any[], categories: any[] }) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [fundSourceId, setFundSourceId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!amount || !fundSourceId) return;
        setLoading(true);
        try {
            await addTransaction({
                amount: parseFloat(amount),
                type,
                description,
                fundSourceId: parseInt(fundSourceId),
                categoryId: categoryId ? parseInt(categoryId) : undefined,
                date: new Date(),
            });
            setAmount("");
            setDescription("");
            setFundSourceId("");
            setCategoryId("");
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCategories = categories.filter(c => c.type === type);

    return (
        <>
            <Button onPress={onOpen} color="primary" startContent={<PlusIcon />}>
                Catat Transaksi
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Catat Keuangan</ModalHeader>
                            <ModalBody>
                                <Tabs
                                    fullWidth
                                    selectedKey={type}
                                    onSelectionChange={(key) => setType(key as any)}
                                    color={type === "INCOME" ? "success" : "danger"}
                                >
                                    <Tab key="EXPENSE" title="Pengeluaran" />
                                    <Tab key="INCOME" title="Pemasukan" />
                                </Tabs>

                                <Input
                                    label="Nominal"
                                    placeholder="0"
                                    type="number"
                                    variant="bordered"
                                    value={amount}
                                    onValueChange={setAmount}
                                    isRequired
                                />

                                <Select
                                    label="Sumber Dana"
                                    placeholder="Pilih Sumber Dana"
                                    variant="bordered"
                                    selectedKeys={fundSourceId ? [fundSourceId] : []}
                                    onSelectionChange={(keys) => setFundSourceId(Array.from(keys)[0] as string)}
                                    isRequired
                                >
                                    {fundSources.map((source) => (
                                        <SelectItem key={source.id} value={source.id}>
                                            {source.name}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    label="Kategori"
                                    placeholder="Pilih Kategori (Optional)"
                                    variant="bordered"
                                    selectedKeys={categoryId ? [categoryId] : []}
                                    onSelectionChange={(keys) => setCategoryId(Array.from(keys)[0] as string)}
                                >
                                    {filteredCategories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Input
                                    label="Keterangan"
                                    placeholder="Misal: Beli Bakso, Gaji Bulanan"
                                    variant="bordered"
                                    value={description}
                                    onValueChange={setDescription}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onPress={onClose}>
                                    Batal
                                </Button>
                                <Button color={type === "INCOME" ? "success" : "danger"} onPress={handleSubmit} isLoading={loading}>
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
