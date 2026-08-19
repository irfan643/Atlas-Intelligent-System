import { AppSidebar } from "@/components/layout/app-sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b px-6 py-4">
          <p className="font-semibold">Atlas workspace</p>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </div>
    </div>
  );
}
