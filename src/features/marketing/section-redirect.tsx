"use client";

import { useEffect } from "react";

export default function SectionRedirect({
  hash,
}: {
  hash: "solutions" | "production" | "about" | "contact";
}) {
  useEffect(() => {
    window.location.replace(`/#${hash}`);
  }, [hash]);

  return null;
}
