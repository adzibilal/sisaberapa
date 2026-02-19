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
import { addFundSource, updateFundSource } from "@/app/actions/fund-sources";

interface FundSourceFormProps {
    mode?: "add" | "edit";
    isDark?: boolean;
    initialData?: {
        id: number;
        name: string;
        balance: number;
    };
}

export function FundSourceForm({ mode = "add", isDark = false, initialData }: FundSourceFormProps) {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [name, setName] = useState(initialData?.name || "");
    const [balance, setBalance] = useState(initialData?.balance?.toString() || "0");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (mode === "edit" && initialData) {
                await updateFundSource(initialData.id, name, parseFloat(balance));
            } else {
                await addFundSource(name, parseFloat(balance));
                setName("");
                setBalance("0");
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
            <Button
                onPress={onOpen}
                color={mode === "add" ? "primary" : "default"}
                variant={mode === "add" ? "solid" : "light"}
                isIconOnly={mode === "edit"}
                startContent={mode === "add" ? <PlusIcon /> : <PencilIcon />}
                size={mode === "edit" ? "sm" : "md"}
                className={isDark ? "text-white/80 hover:text-white" : ""}
            >
                {mode === "add" && "Tambah Sumber Dana"}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose: () => void) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {mode === "add" ? "Tambah Sumber Dana" : "Edit Sumber Dana"}
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Nama Sumber Dana"
                                    placeholder="Misal: BCA Adzi, Cash Riska"
                                    variant="bordered"
                                    value={name}
                                    onValueChange={setName}
                                />
                                <Input
                                    label="Saldo Awal"
                                    placeholder="0"
                                    type="number"
                                    variant="bordered"
                                    value={balance}
                                    onValueChange={setBalance}
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
