"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, LayoutDashboard, LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { api } from "@/lib/api/client";
import { appNav, site } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navIcons = {
  Dashboard: LayoutDashboard,
  "My Courses": BookOpen,
  Profile: UserRound,
} as const;

export function AppSidebar({
  doctorName,
  doctorEmail,
}: {
  doctorName?: string;
  doctorEmail?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // still navigate
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="h-12 justify-center border-b px-3 py-0">
        <Link
          href="/dashboard"
          className="flex min-w-0 flex-col justify-center gap-0.5"
        >
          <span className="text-base leading-none font-extrabold tracking-[-0.04em]">
            {site.name}
          </span>
          <span className="text-xs font-semibold text-violet">
            Doctor workspace
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-2 py-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {appNav.map((item) => {
                const Icon = navIcons[item.label];
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "rounded-md px-2 text-sm font-medium",
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
      <SidebarFooter className="space-y-2 border-t px-3 py-3">
        {doctorName ? (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{doctorName}</p>
            {doctorEmail ? (
              <p className="truncate text-xs text-muted-foreground">
                {doctorEmail}
              </p>
            ) : null}
          </div>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-full justify-start gap-2 rounded-md"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
