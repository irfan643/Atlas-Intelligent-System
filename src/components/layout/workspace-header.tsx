"use client";

import { usePathname } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { appNav } from "@/lib/constants";

function workspaceTitle(pathname: string) {
  const match = [...appNav]
    .reverse()
    .find(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    );

  return match?.label ?? "Workspace";
}

export function WorkspaceHeader() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger />
      <p className="font-semibold">{workspaceTitle(pathname)}</p>
    </header>
  );
}
