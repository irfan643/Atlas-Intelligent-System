"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OpenAccessButton } from "@/features/access-request/open-access-button";
import { marketingNav, site } from "@/lib/constants";
import { cn } from "@/lib/utils";

function navHref(pathname: string, item: (typeof marketingNav)[number]) {
  if (pathname === "/" && "hash" in item && item.hash) {
    return item.hash;
  }

  return item.href;
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 px-[clamp(22px,5vw,84px)] py-3 px-12 backdrop-blur">
      <Link href="/" className="text-2xl font-extrabold tracking-[-0.04em]">
        {site.name}{" "}
        <span className="text-violet">Intelligent System</span>
      </Link>
      <nav className="hidden items-center gap-6.5 min-[781px]:flex">
        {marketingNav.map((item) => (
          <Link
            key={item.label}
            href={navHref(pathname, item)}
            className="font-semibold text-foreground"
          >
            {item.label}
          </Link>
        ))}
        <Button asChild variant="outline" className="  h-9 rounded-lg px-6 font-bold">
          <Link href="/login">Log in</Link>
        </Button>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="min-[781px]:hidden"
            aria-label="Open menu"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{site.fullName}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-3 px-4">
            {marketingNav.map((item) => (
              <SheetClose asChild key={item.label}>
                <Link
                  href={navHref(pathname, item)}
                  className={cn("rounded-lg px-2 py-2 font-semibold")}
                >
                  {item.label}
                </Link>
              </SheetClose>
            ))}
            <SheetClose asChild>
              <Button asChild variant="outline" className="h-12 font-bold">
                <Link href="/login">Log in</Link>
              </Button>
            </SheetClose>
            <OpenAccessButton className="h-12 font-bold">
              Request access
            </OpenAccessButton>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
