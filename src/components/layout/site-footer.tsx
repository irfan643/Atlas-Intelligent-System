import Link from "next/link";

import { marketingGutter, site } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer
      className={`mt-auto border-t py-8 text-sm text-muted-foreground ${marketingGutter}`}
    >
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
