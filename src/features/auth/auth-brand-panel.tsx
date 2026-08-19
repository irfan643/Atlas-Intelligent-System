import Link from "next/link";

import { site } from "@/lib/constants";
import { cn } from "@/lib/utils";

const signals = [
  { label: "Learning systems", live: true },
  { label: "Production Center", live: true },
  { label: "Approved organization access", live: false },
];

export function AuthBrandPanel() {
  return (
    <aside className="relative hidden h-full min-h-0 overflow-hidden bg-linear-to-br from-navy via-primary to-violet p-8 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_12%,#ffffff55_0_8%,transparent_32%),radial-gradient(circle_at_12%_88%,#6546d8_0_12%,transparent_40%)]" />
      <div className="relative z-2 min-h-0">
        <Link href="/" className="inline-flex items-baseline gap-2">
          <span className="text-[20px] font-extrabold tracking-[-0.04em]">
            {site.name}
          </span>
          <span className=" text-[20px] font-extrabold tracking-[-0.04em]">
            Intelligent System
          </span>
        </Link>
        <p className="mt-8 text-[13px] font-extrabold uppercase tracking-[0.12em] text-white/80">
          Secure workspace
        </p>
        <h1 className="mt-2 max-w-lg font-heading text-4xl leading-[0.98] font-semibold tracking-[-0.06em] xl:text-5xl">
          Build smarter. Learn further.
        </h1>
        <p className="mt-3 max-w-md text-base text-white/85">
          {site.description}
        </p>
      </div>
      <div className="relative z-2 shrink-0 rounded-2xl border border-white/20 bg-navy/25 p-5 backdrop-blur-sm">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-white/80">
          Build activity
        </p>
        <div className="mt-2">
          {signals.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-3 py-2.5 font-semibold",
                index < signals.length - 1 && "border-b border-white/15",
              )}
            >
              <span
                className={cn(
                  "size-3 shrink-0 rounded-full bg-white/30",
                  item.live && "bg-primary shadow-[0_0_0_6px_#1677ff33]",
                )}
              />
              {item.label}
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/80">
          Detailed demonstrations are available only through approved access.
        </p>
      </div>
    </aside>
  );
}
