"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardBody, Input, Button, Image } from "@heroui/react";
import { useRouter } from "next/navigation";

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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
            <Card className="max-w-[400px] w-full shadow-2xl backdrop-blur-md bg-white/90">
                <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-8">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg mb-4">
                        <h1 className="text-2xl font-bold text-white tracking-tight">Sisa Berapa?</h1>
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
                                label: "text-indigo-600 font-medium",
                                inputWrapper: "hover:border-indigo-400 focus-within:border-indigo-600"
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
                                label: "text-indigo-600 font-medium",
                                inputWrapper: "hover:border-indigo-400 focus-within:border-indigo-600"
                            }}
                        />
                        {error && <p className="text-danger text-tiny text-center">{error}</p>}
                        <Button
                            color="primary"
                            type="submit"
                            isLoading={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 font-bold py-6 text-md shadow-xl transition-all"
                        >
                            Masuk
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
