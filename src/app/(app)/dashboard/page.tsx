import type { Metadata } from "next";

import { DashboardOverview } from "@/features/dashboard/dashboard-placeholder";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
