export const site = {
  name: "Atlas",
  fullName: "Atlas Intelligent System",
  description:
    "Atlas brings together secure learning, intelligent tools, and organization-ready experiences for healthcare, education, and enterprise teams.",
} as const;

export const marketingNav = [
  { href: "/#solutions", label: "Solutions" },
  { href: "/#production", label: "Production" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;

export const appNav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/learning", label: "Learning" },
  { href: "/dashboard/production", label: "Production" },
] as const;

export const marketingGutter = "px-[clamp(22px,7vw,120px)]";
export const marketingScreenSection =
  "flex min-h-[calc(100dvh-4.5rem)] scroll-mt-[4.5rem] flex-col justify-center py-12";
