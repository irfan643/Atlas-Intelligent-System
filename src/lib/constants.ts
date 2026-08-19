export const site = {
  name: "Atlas",
  fullName: "Atlas Intelligent System",
  description:
    "Atlas brings together secure learning, intelligent tools, and organization-ready experiences for healthcare, education, and enterprise teams.",
} as const;

export const marketingNav = [
  { href: "/solutions", hash: "#solutions", label: "Solutions" },
  { href: "/production", hash: "#production", label: "Production" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const appNav = [
  { href: "/dashboard", label: "Dashboard", enabled: true },
  { href: "/dashboard", label: "Learning", enabled: false },
  { href: "/dashboard", label: "Production", enabled: false },
] as const;
