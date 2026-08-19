"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function sectionIdFromHref(href: string) {
  const hashIndex = href.indexOf("#");
  return hashIndex === -1 ? null : href.slice(hashIndex + 1);
}

const HEADER_FALLBACK_PX = 72;

export function scrollToSection(id: string) {
  const section = document.getElementById(id);

  if (!section) {
    return;
  }

  const header = document.querySelector("header");
  const headerHeight =
    header?.getBoundingClientRect().height ?? HEADER_FALLBACK_PX;
  const rect = section.getBoundingClientRect();
  const availableHeight = window.innerHeight - headerHeight;
  const leftover = availableHeight - section.offsetHeight;
  const centerOffset = leftover > 0 ? leftover / 2 : 0;
  const top = window.scrollY + rect.top - headerHeight - centerOffset;

  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export function SectionLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const sectionId = sectionIdFromHref(href);

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (!sectionId) {
          return;
        }

        if (pathname !== "/") {
          return;
        }

        event.preventDefault();
        window.history.pushState(null, "", `#${sectionId}`);
        scrollToSection(sectionId);
        onNavigate?.();
      }}
    >
      {children}
    </Link>
  );
}

export function HomeHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const id = window.location.hash.replace("#", "");

    if (!id) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      scrollToSection(id);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
