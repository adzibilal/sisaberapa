"use client";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardBody,
    Button
} from "@heroui/react";
import { UserForm } from "@/components/user-form";
import { deleteUser } from "@/app/actions/users";
import { TrashIcon } from "@/components/icons";
import { useState } from "react";

interface UsersClientProps {
    data: any[];
}

export function UsersClient({ data }: UsersClientProps) {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Hapus user ini?")) return;
        setLoadingId(id);
        try {
            await deleteUser(id);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Kelola User</h1>
                    <p className="text-default-500">Daftar pengguna aplikasi SisaBerapa?.</p>
                </div>
                <UserForm />
            </div>

            <Card>
                <CardBody className="p-0">
                    <Table aria-label="Tabel User" removeWrapper>
                        <TableHeader>
                            <TableColumn>USERNAME</TableColumn>
                            <TableColumn>TANGGAL DIBUAT</TableColumn>
                            <TableColumn align="center">AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Belum ada user."}>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.username}</TableCell>
                                    <TableCell>{new Date(item.createdAt).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>
                                        <div className="relative flex justify-center items-center gap-2">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                color="danger"
                                                variant="light"
                                                onPress={() => handleDelete(item.id)}
                                                isLoading={loadingId === item.id}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}
