import type { Metadata } from "next";

import { AccessWizard } from "@/features/access-request/access-wizard";
import { marketingGutter } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Request access",
};

export default function AccessPage() {
  return (
    <section className={`mx-auto w-full max-w-[680px] py-16 ${marketingGutter}`}>
      <AccessWizard />
    </section>
  );
}
