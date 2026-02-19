"use client";

import { useSession } from "next-auth/react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage || status === "unauthenticated") {
        return <main className="w-full flex-grow">{children}</main>;
    }

    return (
        <>
            <Sidebar />
            <div className="flex flex-col flex-grow">
                <Navbar />
                <main className="flex-grow p-6 lg:p-10 container mx-auto max-w-7xl">
                    {children}
                </main>
            </div>
        </>
    );
}
