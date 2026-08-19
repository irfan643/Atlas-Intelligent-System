import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { appNav, site } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="px-5 py-6">
        <Link href="/" className="text-lg font-extrabold tracking-tight">
          {site.name}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">Workspace</p>
      </div>
      <Separator />
      <nav className="flex flex-col gap-1 p-3">
        {appNav.map((item) =>
          item.enabled ? (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg bg-sidebar-accent px-3 py-2 text-sm font-semibold"
            >
              {item.label}
            </Link>
          ) : (
            <span
              key={item.label}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground",
              )}
            >
              {item.label}
            </span>
          ),
        )}
      </nav>
      <div className="mt-auto p-4 text-xs text-muted-foreground">
        Authentication is not connected yet.
      </div>
    </aside>
  );
}
