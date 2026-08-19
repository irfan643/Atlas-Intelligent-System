import type { Metadata } from "next";

import { LearningContent } from "@/features/dashboard/learning-content";

export const metadata: Metadata = {
  title: "Learning",
};

export default function LearningPage() {
  return <LearningContent />;
}
