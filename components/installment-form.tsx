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
    Tabs,
    Tab,
} from "@heroui/react";
import { PlusIcon } from "@/components/icons";
import { PencilIcon } from "lucide-react";
import { addInstallment, updateInstallment } from "@/app/actions/installments";

export function InstallmentForm({ installment }: { installment?: any }) {
    const isEditing = !!installment;
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [name, setName] = useState(installment?.name || "");
    const [isFlexible, setIsFlexible] = useState(
        isEditing ? (installment.monthlyAmount === 0 || installment.monthlyAmount == null) : false
    );
    const [monthlyAmount, setMonthlyAmount] = useState(installment?.monthlyAmount?.toString() || "");
    const [totalMonths, setTotalMonths] = useState(installment?.totalMonths?.toString() || "");
    const [manualTotalAmount, setManualTotalAmount] = useState(installment?.totalAmount?.toString() || "");
    const [paidMonths, setPaidMonths] = useState(installment?.paidMonths?.toString() || "0");
    const [loading, setLoading] = useState(false);

    // Auto-calculate or use manual total amount
    const totalAmount = isFlexible
        ? parseFloat(manualTotalAmount) || 0
        : (parseFloat(monthlyAmount) || 0) * (parseInt(totalMonths) || 0);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (isEditing) {
                await updateInstallment(installment.id, {
                    name,
                    totalAmount: isFlexible ? parseFloat(manualTotalAmount) : totalAmount,
                    monthlyAmount: isFlexible ? 0 : parseFloat(monthlyAmount),
                    totalMonths: isFlexible ? 0 : parseInt(totalMonths),
                });
            } else {
                await addInstallment({
                    name,
                    totalAmount: totalAmount,
                    monthlyAmount: isFlexible ? 0 : parseFloat(monthlyAmount),
                    totalMonths: isFlexible ? 0 : parseInt(totalMonths),
                    paidMonths: isFlexible ? 0 : parseInt(paidMonths),
                    currentPaid: isFlexible ? 0 : (parseFloat(monthlyAmount) || 0) * (parseInt(paidMonths) || 0),
                    startDate: new Date(),
                });
                setName("");
                setMonthlyAmount("");
                setTotalMonths("");
                setManualTotalAmount("");
                setPaidMonths("0");
                setIsFlexible(false);
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
                    Tambah Cicilan
                </Button>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" className="rounded-3xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-2xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white pt-8 px-8">
                                {isEditing ? "Edit Cicilan" : "Tambah Tracking Cicilan"}
                            </ModalHeader>
                            <ModalBody className="gap-6 px-8 pb-8">
                                {!isEditing && (
                                    <Tabs
                                        fullWidth
                                        size="lg"
                                        aria-label="Mode Cicilan"
                                        onSelectionChange={(key) => setIsFlexible(key === "flexible")}
                                        classNames={{
                                            tabList: "bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl",
                                            cursor: "bg-white dark:bg-zinc-700 shadow-sm rounded-xl",
                                            tab: "h-10",
                                            tabContent: "font-bold tracking-tight"
                                        }}
                                    >
                                        <Tab key="fixed" title="TETAP" />
                                        <Tab key="flexible" title="FLEXIBLE" />
                                    </Tabs>
                                )}

                                <Input
                                    label="Nama Cicilan"
                                    placeholder="Misal: KPR, Motor, HP"
                                    variant="bordered"
                                    radius="lg"
                                    labelPlacement="outside"
                                    value={name}
                                    onValueChange={setName}
                                    className="font-medium"
                                />

                                {!isFlexible ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input
                                                label="Cicilan / Bulan"
                                                placeholder="0"
                                                type="number"
                                                variant="bordered"
                                                radius="lg"
                                                labelPlacement="outside"
                                                startContent={<span className="text-zinc-400 text-sm">Rp</span>}
                                                value={monthlyAmount}
                                                onValueChange={setMonthlyAmount}
                                                className="font-medium"
                                            />
                                            <Input
                                                label="Tenor (Bulan)"
                                                placeholder="12"
                                                type="number"
                                                variant="bordered"
                                                radius="lg"
                                                labelPlacement="outside"
                                                value={totalMonths}
                                                onValueChange={setTotalMonths}
                                                className="font-medium"
                                            />
                                        </div>

                                        <Input
                                            label="Total Pinjaman (Auto)"
                                            value={totalAmount ? `Rp ${totalAmount.toLocaleString('id-ID')}` : "Rp 0"}
                                            variant="flat"
                                            radius="lg"
                                            labelPlacement="outside"
                                            isReadOnly
                                            className="font-mono font-bold text-lg bg-zinc-50 dark:bg-zinc-800"
                                        />

                                        {!isEditing && (
                                            <Input
                                                label="Cicilan ke- (Saat ini berjalan)"
                                                placeholder="0"
                                                type="number"
                                                variant="bordered"
                                                radius="lg"
                                                labelPlacement="outside"
                                                description="Sudah cicilan ke berapa saat ini?"
                                                value={paidMonths}
                                                onValueChange={setPaidMonths}
                                                className="font-medium"
                                            />
                                        )}
                                    </>
                                ) : (
                                    <Input
                                        label="Total Pinjaman"
                                        placeholder="0"
                                        type="number"
                                        variant="bordered"
                                        radius="lg"
                                        labelPlacement="outside"
                                        startContent={<span className="text-zinc-400 text-sm">Rp</span>}
                                        value={manualTotalAmount}
                                        onValueChange={setManualTotalAmount}
                                        className="font-medium"
                                    />
                                )}
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
                                    {isEditing ? "Update Cicilan" : "Simpan Tracking"}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
