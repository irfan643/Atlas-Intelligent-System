import type { Metadata } from "next";

import { ProductionSection } from "@/features/marketing/production-section";

export const metadata: Metadata = {
  title: "Production",
};

export default function ProductionPage() {
  return <ProductionSection />;
}
