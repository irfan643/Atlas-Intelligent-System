"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Workflow } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { appNav, site } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navIcons = {
  Dashboard: LayoutDashboard,
  Learning: BookOpen,
  Production: Workflow,
} as const;

export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="h-14 justify-center border-b px-4 py-0">
        <Link href="/" className="flex min-w-0 flex-col justify-center gap-0.5">
          <span className="text-lg leading-none font-extrabold tracking-[-0.04em]">
            {site.name}
          </span>
          <span className="text-xs font-semibold text-violet">
            Intelligent System
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {appNav.map((item) => {
                const Icon = navIcons[item.label];
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        " rounded-sm px-2 text-sm font-semibold",
                        "hover:bg-muted hover:text-foreground",
                        "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90 data-[active=true]:hover:text-primary-foreground",
                      )}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpenMobile(false)}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t px-4 py-3 text-xs text-muted-foreground">
        Authentication is not connected yet.
      </SidebarFooter>
    </Sidebar>
  );
}
