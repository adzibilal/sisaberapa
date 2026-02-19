"use client";

import { Link } from "@heroui/link";
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import Image from "next/image";
import logoImg from "@/public/logo-sisaberapa.png";
import { ThemeSwitch } from "./theme-switch";

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-divider bg-content1 px-4 py-8">
            <div className="flex items-center gap-2 mb-10 px-2">
                <NextLink href="/" className="flex items-center justify-center w-full px-6">
                    <Image
                        src={logoImg}
                        alt="SisaBerapa Logo"
                        priority
                    />
                </NextLink>
            </div>

            <nav className="flex-grow space-y-2">
                {siteConfig.navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <NextLink
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                isActive
                                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-lg"
                                    : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            )}
                        >
                            {item.label}
                        </NextLink>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-divider">
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-divider">
                    <span className="text-sm font-bold text-zinc-500">Mode Tampilan</span>
                    <ThemeSwitch />
                </div>
            </div>
        </aside>
    );
};
