import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { TeacherDashboardOverview } from "@/features/teacher/teacher-dashboard";
import { getTeacherDashboardStats } from "@/features/teacher/actions";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const stats = await getTeacherDashboardStats();

  return (
    <TeacherDashboardOverview
      teacherName={stats.session.name}
      courseCount={stats.courseCount}
      lectureCount={stats.lectureCount}
      publishedCount={stats.publishedCount}
      courses={stats.courses}
    />
  );
}
