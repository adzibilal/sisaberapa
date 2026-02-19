"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardBody, Input, Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoImg from "@/public/logo-sisaberapa.png";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid username or password");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 font-sans">
            <Card className="max-w-[400px] w-full shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-8">
                    <div className="w-full max-w-[150px] mb-4">
                        <Image
                            src={logoImg}
                            alt="SisaBerapa Logo"
                            priority
                        />
                    </div>
                    <p className="text-default-500 text-small">Masuk untuk mencatat keuangan</p>
                </CardHeader>
                <CardBody className="py-8 px-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <Input
                            label="Username"
                            placeholder="Masukkan username"
                            variant="bordered"
                            value={username}
                            onValueChange={setUsername}
                            isRequired
                            classNames={{
                                label: "text-zinc-900 dark:text-zinc-100 font-bold",
                                inputWrapper: "hover:border-zinc-400 focus-within:border-zinc-900 dark:focus-within:border-zinc-100"
                            }}
                        />
                        <Input
                            label="Password"
                            placeholder="Masukkan password"
                            type="password"
                            variant="bordered"
                            value={password}
                            onValueChange={setPassword}
                            isRequired
                            classNames={{
                                label: "text-zinc-900 dark:text-zinc-100 font-bold",
                                inputWrapper: "hover:border-zinc-400 focus-within:border-zinc-900 dark:focus-within:border-zinc-100"
                            }}
                        />
                        {error && <p className="text-danger text-tiny text-center">{error}</p>}
                        <Button
                            color="primary"
                            type="submit"
                            isLoading={loading}
                            className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 hover:bg-black dark:hover:bg-white font-bold py-6 text-md shadow-xl transition-all"
                        >
                            Masuk
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
