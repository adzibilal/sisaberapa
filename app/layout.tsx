import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import NextLink from "next/link";
import clsx from "clsx";

import { Providers } from "./providers";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["keuangan keluarga", "tracking cicilan", "tagihan bulanan", "manajemen keuangan", "sisaberapa"],
  authors: [{ name: "Sisaberapa" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    locale: "id_ID",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex min-h-screen">
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </div>
        </Providers>
      </body>
    </html>
  );
}
