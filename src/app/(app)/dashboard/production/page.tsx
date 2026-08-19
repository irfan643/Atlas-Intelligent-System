import type { Metadata } from "next";

import { ProductionContent } from "@/features/dashboard/production-content";

export const metadata: Metadata = {
  title: "Production",
};

export default function DashboardProductionPage() {
  return <ProductionContent />;
}
