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
import { addUser } from "@/app/actions/users";

export function UserForm() {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!username || !password) return;
        setLoading(true);
        try {
            await addUser(username, password);
            setUsername("");
            setPassword("");
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
                Tambah User
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Tambah User Baru</ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="Username"
                                    placeholder="Masukkan username"
                                    variant="bordered"
                                    value={username}
                                    onValueChange={setUsername}
                                />
                                <Input
                                    label="Password"
                                    placeholder="Masukkan password"
                                    type="password"
                                    variant="bordered"
                                    value={password}
                                    onValueChange={setPassword}
                                />
                                <p className="text-tiny text-warning italic">* Password disimpan sebagai teks biasa (Prototype Only)</p>
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
