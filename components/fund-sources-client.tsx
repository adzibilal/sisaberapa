"use client";

import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardBody
} from "@heroui/react";
import { FundSourceForm } from "@/components/fund-source-form";

interface FundSourcesClientProps {
    data: any[];
}

export function FundSourcesClient({ data }: FundSourcesClientProps) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-sans">Management Sumber Dana</h1>
                    <p className="text-default-500">Kelola rekening, dompet, atau sumber dana lainnya.</p>
                </div>
                <FundSourceForm />
            </div>

            <Card>
                <CardBody className="p-0">
                    <Table aria-label="Tabel Sumber Dana" removeWrapper>
                        <TableHeader>
                            <TableColumn>NAMA SUMBER DANA</TableColumn>
                            <TableColumn>SALDO SAAT INI</TableColumn>
                            <TableColumn align="center">AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Belum ada sumber dana yang terdaftar."}>
                            {data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>Rp {item.balance.toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        <div className="relative flex justify-center items-center gap-2">
                                            <FundSourceForm mode="edit" initialData={item} />
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
