import type { Metadata } from "next";
import { Suspense } from "react";

import { JoinForm } from "@/features/join/join-form";

export const metadata: Metadata = {
  title: "Join course",
};

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <JoinForm />
    </Suspense>
  );
}
