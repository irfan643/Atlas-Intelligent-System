"use client";

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
import { SectionLink } from "@/features/marketing/section-link";
import { marketingGutter, marketingNav, site } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between border-b bg-background/95 py-3 backdrop-blur",
        marketingGutter,
      )}
    >
      <SectionLink
        href="/#hero"
        className="text-2xl font-extrabold tracking-[-0.04em]"
      >
        {site.name}{" "}
        <span className="text-violet">Intelligent System</span>
      </SectionLink>
      <nav className="hidden items-center gap-6.5 min-[781px]:flex">
        {marketingNav.map((item) => (
          <SectionLink
            key={item.label}
            href={item.href}
            className="font-semibold text-foreground"
          >
            {item.label}
          </SectionLink>
        ))}
        <Button asChild variant="outline" className="h-9 rounded-lg px-6 font-bold">
          <a href="/login">Log in</a>
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
                <SectionLink
                  href={item.href}
                  className={cn("rounded-lg px-2 py-2 font-semibold")}
                >
                  {item.label}
                </SectionLink>
              </SheetClose>
            ))}
            <SheetClose asChild>
              <Button asChild variant="outline" className="h-12 font-bold">
                <a href="/login">Log in</a>
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
