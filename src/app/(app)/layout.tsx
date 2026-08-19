import { AppSidebar } from "@/components/layout/app-sidebar";
import { WorkspaceHeader } from "@/components/layout/workspace-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider className="min-h-full flex-1">
        <AppSidebar />
        <SidebarInset>
          <WorkspaceHeader />
          <div className="flex-1 px-6 py-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
