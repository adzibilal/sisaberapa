"use client";

import { useState } from "react";
import {
    Input,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Select,
    SelectItem,
} from "@heroui/react";
import { SparklesIcon, CheckIcon } from "lucide-react";
import { processQuickInput } from "@/app/actions/quick-input";
import { addTransaction, deleteTransaction } from "@/app/actions/transactions";


export type QuickInputData = {
    description: string;
    amount: number;
    fundSourceId: number;
    categoryId: number | null;
    type: "INCOME" | "EXPENSE";
    date: Date;
};

type Category = {
    id: number;
    name: string;
};

type FundSource = {
    id: number;
    name: string;
};

export function QuickInputClient({ categories, fundSources }: { categories: Category[], fundSources: FundSource[] }) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [parsedData, setParsedData] = useState<QuickInputData | null>(null);
    const [saving, setSaving] = useState(false);
    const [lastTransactionId, setLastTransactionId] = useState<number | null>(null);
    const [undoing, setUndoing] = useState(false);


    const handleProcess = async () => {
        if (!input) return;
        setLoading(true);
        try {
            const result = await processQuickInput(input);
            // Ensure result has type, defaulting to EXPENSE if not present (safeguard)
            const dataWithType = {
                ...result,
                type: result.type || "EXPENSE",
                date: new Date(result.date),
            };
            setParsedData(dataWithType);
        } catch (error) {
            alert("Gagal memproses input. Coba lagi dengan kalimat yang lebih jelas.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!parsedData) return;
        setSaving(true);
        try {
            const txId = await addTransaction(parsedData);
            setLastTransactionId(txId || null);
            setParsedData(null);
            setInput("");
        } catch (error) {
            alert("Gagal menyimpan transaksi.");
        } finally {
            setSaving(false);
        }
    };

    const handleUndo = async () => {
        if (!lastTransactionId) return;
        setUndoing(true);
        try {
            await deleteTransaction(lastTransactionId);
            setLastTransactionId(null);
        } catch (error) {
            alert("Gagal menghapus transaksi.");
        } finally {
            setUndoing(false);
        }
    };


    return (
        <div className="max-w-xl mx-auto space-y-6">
            <Card className="border border-divider shadow-sm bg-white dark:bg-zinc-900">
                <CardHeader className="flex flex-col items-start px-6 pt-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <SparklesIcon className="text-zinc-900 dark:text-zinc-100" />
                        Quick Input AI
                    </h1>
                    <p className="text-default-500 text-sm">
                        Ketik apa saja, biar AI yang rapihin datanya.
                    </p>
                </CardHeader>
                <CardBody className="px-6 pb-6 space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Contoh: beli baso 25rb"
                            value={input}
                            onValueChange={setInput}
                            size="lg"
                            className="bg-white dark:bg-default-100"
                            onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && handleProcess()}
                        />
                        <Button
                            color="primary"
                            size="lg"
                            className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold"
                            isIconOnly
                            isLoading={loading}
                            onPress={handleProcess}
                        >
                            {!loading && <SparklesIcon size={20} />}
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {lastTransactionId && !parsedData && (
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-bottom-4">
                    <CardBody className="flex flex-row items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full text-green-600 dark:text-green-400">
                                <CheckIcon size={18} />
                            </div>
                            <div>
                                <p className="font-semibold text-green-700 dark:text-green-300">Transaksi Berhasil Disimpan!</p>
                                <p className="text-xs text-green-600 dark:text-green-400">Salah input? Kamu bisa batalkan sekarang.</p>
                            </div>
                        </div>
                        <Button
                            color="danger"
                            variant="flat"
                            size="sm"
                            onPress={handleUndo}
                            isLoading={undoing}
                        >
                            Undo Transaksi
                        </Button>
                    </CardBody>
                </Card>
            )}

            {parsedData && (
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="px-6 pt-6">
                        <h2 className="font-bold text-lg">Konfirmasi Transaksi</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Tipe Transaksi"
                                selectedKeys={[parsedData.type]}
                                onSelectionChange={(keys) => setParsedData({ ...parsedData, type: (Array.from(keys)[0] as "INCOME" | "EXPENSE") })}
                            >
                                <SelectItem key="EXPENSE">Pengeluaran</SelectItem>
                                <SelectItem key="INCOME">Pemasukan</SelectItem>
                            </Select>
                            <Input
                                label="Deskripsi"
                                value={parsedData.description}
                                onValueChange={(v: string) => setParsedData({ ...parsedData, description: v })}
                            />
                            <Input
                                label="Jumlah (Rp)"
                                type="number"
                                value={parsedData.amount.toString()}
                                onValueChange={(v: string) => setParsedData({ ...parsedData, amount: parseFloat(v) })}
                            />
                            <Input
                                label="Tanggal"
                                type="date"
                                value={parsedData.date.toISOString().split('T')[0]}
                                onValueChange={(v: string) => setParsedData({ ...parsedData, date: new Date(v) })}
                            />
                            <Select
                                aria-label="Sumber Dana"
                                label="Sumber Dana"
                                selectedKeys={[parsedData.fundSourceId.toString()]}
                                onSelectionChange={(keys) => setParsedData({ ...parsedData, fundSourceId: Number(Array.from(keys)[0]) })}
                            >
                                {fundSources.map((s) => (
                                    <SelectItem key={s.id.toString()}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                aria-label="Kategori"
                                label="Kategori"
                                selectedKeys={parsedData.categoryId ? [parsedData.categoryId.toString()] : []}
                                onSelectionChange={(keys) => setParsedData({ ...parsedData, categoryId: Number(Array.from(keys)[0]) })}
                            >
                                {categories.map((c) => (
                                    <SelectItem key={c.id.toString()}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button
                                color="danger"
                                variant="flat"
                                fullWidth
                                onPress={() => setParsedData(null)}
                            >
                                Batal
                            </Button>
                            <Button
                                color="primary"
                                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold"
                                fullWidth
                                onPress={handleConfirm}
                                isLoading={saving}
                                startContent={!saving && <CheckIcon size={20} />}
                            >
                                Simpan Transaksi
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            <div className="text-center space-y-2">
                <p className="text-tiny text-default-400">Tips Kalimat:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {["makan siang 35.000", "gajian 5.5jt", "beli pulsa 50k", "topup gopay 100rb"].map(tip => (
                        <button
                            key={tip}
                            onClick={() => setInput(tip)}
                            className="text-tiny px-2 py-1 rounded-full border border-divider hover:bg-default-100 transition-colors"
                        >
                            &quot;{tip}&quot;
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
