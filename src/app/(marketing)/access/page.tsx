import type { Metadata } from "next";

import { AccessWizard } from "@/features/access-request/access-wizard";

export const metadata: Metadata = {
  title: "Request access",
};

export default function AccessPage() {
  return (
    <section className="mx-auto w-full max-w-[680px] px-[clamp(22px,5vw,84px)] py-16">
      <AccessWizard />
    </section>
  );
}
