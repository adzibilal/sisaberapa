export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Sisaberapa",
  description:
    "Pantau keuangan keluarga dengan mudah — tracking saldo, transaksi, cicilan, dan tagihan bulanan dalam satu tempat.",
  navItems: [
    {
      label: "Quick Input",
      href: "/quick-input",
    },
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Sumber Dana",
      href: "/fund-sources",
    },
    {
      label: "Transaksi",
      href: "/transactions",
    },
    {
      label: "Cicilan",
      href: "/installments",
    },
    {
      label: "Tagihan",
      href: "/bills",
    },
    {
      label: "Kelola User",
      href: "/users",
    },
  ],
  navMenuItems: [
    {
      label: "Quick Input",
      href: "/quick-input",
    },
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Sumber Dana",
      href: "/fund-sources",
    },
    {
      label: "Transaksi",
      href: "/transactions",
    },
    {
      label: "Cicilan",
      href: "/installments",
    },
    {
      label: "Tagihan",
      href: "/bills",
    },
    {
      label: "Kelola User",
      href: "/users",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
