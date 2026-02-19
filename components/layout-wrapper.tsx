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
                <footer className="w-full flex items-center justify-center py-3 border-t border-divider mt-auto">
                    <NextLink
                        className="flex items-center gap-1 text-current"
                        href="https://heroui.com?utm_source=next-app-template"
                    >
                        <span className="text-default-600">Powered by</span>
                        <p className="text-primary">HeroUI</p>
                    </NextLink>
                </footer>
            </div>
        </>
    );
}
