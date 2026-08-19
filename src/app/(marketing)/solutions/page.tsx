import type { Metadata } from "next";

import { SolutionsSection } from "@/features/marketing/solutions-section";

export const metadata: Metadata = {
  title: "Solutions",
};

export default function SolutionsPage() {
  return <SolutionsSection />;
}
