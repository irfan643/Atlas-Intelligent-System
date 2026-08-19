import Link from "next/link";

import { AuthBrandPanel } from "@/features/auth/auth-brand-panel";
import { site } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-svh max-h-svh overflow-hidden bg-background text-foreground lg:grid-cols-[1.08fr_0.92fr]">
      <AuthBrandPanel />
      <main className="flex min-h-0 flex-col overflow-hidden">
        <header className="flex h-12 shrink-0 items-center border-b px-5 lg:hidden">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold tracking-[-0.04em]">
              {site.name}
            </span>
            <span className="text-xs font-semibold text-violet">
              Intelligent System
            </span>
          </Link>
        </header>
        <div className="flex min-h-0 flex-1 items-center justify-center bg-linear-to-br from-white via-[#f7fbff] to-[#fbf9ff] px-5 py-4">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
