"use client";

import { useState } from "react";
import {
    Input,
    Button,
    Card,
    CardBody,
    CardHeader,
    Divider,
    Autocomplete,
    AutocompleteItem,
    Select,
    SelectItem,
} from "@heroui/react";
import { SparklesIcon, CheckIcon, XIcon, Loader2 } from "lucide-react";
import { processQuickInput } from "@/app/actions/quick-input";
import { addTransaction } from "@/app/actions/transactions";
import { useRouter } from "next/navigation";

export function QuickInputClient({ categories, fundSources }: { categories: any[], fundSources: any[] }) {
    const router = useRouter();
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [parsedData, setParsedData] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const handleProcess = async () => {
        if (!input) return;
        setLoading(true);
        try {
            const result = await processQuickInput(input);
            setParsedData(result);
        } catch (error) {
            alert("Gagal memproses input. Coba lagi dengan kalimat yang lebih jelas.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        setSaving(true);
        try {
            await addTransaction(parsedData);
            router.push("/transactions");
            router.refresh();
        } catch (error) {
            alert("Gagal menyimpan transaksi.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-background">
                <CardHeader className="flex flex-col items-start px-6 pt-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <SparklesIcon className="text-indigo-600" />
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
                            className="bg-indigo-600"
                            isIconOnly
                            isLoading={loading}
                            onPress={handleProcess}
                        >
                            {!loading && <SparklesIcon size={20} />}
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {parsedData && (
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="px-6 pt-6">
                        <h2 className="font-bold text-lg">Konfirmasi Transaksi</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Select
                                aria-label="Sumber Dana"
                                label="Sumber Dana"
                                selectedKeys={[parsedData.fundSourceId.toString()]}
                                onSelectionChange={(keys: any) => setParsedData({ ...parsedData, fundSourceId: Number(Array.from(keys)[0]) })}
                            >
                                {fundSources.map((s) => (
                                    <SelectItem key={s.id.toString()} value={s.id.toString()}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                aria-label="Kategori"
                                label="Kategori"
                                selectedKeys={[parsedData.categoryId?.toString()]}
                                onSelectionChange={(keys: any) => setParsedData({ ...parsedData, categoryId: Number(Array.from(keys)[0]) })}
                            >
                                {categories.map((c) => (
                                    <SelectItem key={c.id.toString()} value={c.id.toString()}>
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
                                className="bg-indigo-600 font-bold"
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
                            "{tip}"
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
