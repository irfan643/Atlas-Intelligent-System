import Link from "next/link";

import { site } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t px-[clamp(22px,5vw,84px)] py-8 text-sm text-muted-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>
          {site.fullName}. Approved access required for demonstrations and
          project materials.
        </p>
        <div className="flex gap-4 font-semibold">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/access">Request access</Link>
        </div>
      </div>
    </footer>
  );
}
