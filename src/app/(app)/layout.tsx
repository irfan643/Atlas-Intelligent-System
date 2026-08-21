import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-full flex-1">
        <AppSidebar
          doctorName={session.name}
          doctorEmail={session.email}
        />
        <SidebarInset>
          <WorkspaceHeader />
          <div className="flex-1 px-5 py-5">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
